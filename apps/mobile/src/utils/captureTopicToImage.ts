import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/**
 * 捕获 View 并保存为图片
 * @param viewRef View 的 ref
 * @param options 捕获选项
 * @returns Promise<string | null> 返回图片本地路径，失败返回 null
 */
export async function captureViewToImage(
  viewRef: any,
  options?: {
    /**
     * 图片格式
     * @default 'png'
     */
    format?: 'png' | 'jpg';
    /**
     * 图片质量 (0-1)
     * @default 1
     */
    quality?: number;
  },
): Promise<string | null> {
  try {
    if (!viewRef || !viewRef.current) {
      console.error('View ref is not available');
      return null;
    }

    const format = options?.format || 'png';
    const quality = options?.quality || 1;

    // 捕获 View 截图
    const uri = await captureRef(viewRef, {
      format,
      quality,
      result: 'tmpfile', // 保存为临时文件
    });

    return uri;
  } catch (error) {
    console.error('Capture view to image failed:', error);
    return null;
  }
}

/**
 * 保存图片到相册
 * @param imageUri 图片本地路径
 * @returns Promise<boolean> 是否保存成功
 */
export async function saveImageToLibrary(imageUri: string): Promise<boolean> {
  try {
    // 1. 请求权限
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    // 2. 保存到相册
    await MediaLibrary.saveToLibraryAsync(imageUri);

    return true;
  } catch (error) {
    console.error('Save image to library failed:', error);
    return false;
  }
}

/**
 * 捕获 Topic 聊天内容并保存到相册
 * @param viewRef Topic 内容的 View ref
 * @param t 国际化翻译函数
 * @returns Promise<boolean> 是否成功
 */
export async function captureTopicAndSave(
  viewRef: any,
  t: (key: string, options?: any) => string,
): Promise<boolean> {
  try {
    // 1. 捕获截图
    const imageUri = await captureViewToImage(viewRef, {
      format: 'png',
      quality: 1,
    });

    if (!imageUri) {
      Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageCaptureFailed'));
      return false;
    }

    // 2. 请求相册权限
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'denied') {
      Alert.alert(
        t('image.permissionDenied', { ns: 'common' }),
        t('image.permissionRequest', { ns: 'common' }),
        [
          { style: 'cancel', text: t('actions.cancel', { ns: 'common' }) },
          {
            text: t('actions.openSettings', { ns: 'common' }),
          },
        ],
      );
      return false;
    }

    if (status !== 'granted') {
      return false;
    }

    // 3. 保存到相册
    const saved = await saveImageToLibrary(imageUri);

    if (saved) {
      Alert.alert(t('status.success', { ns: 'common' }), t('topic.shareImageSaveSuccess'));
      // 清理临时文件
      try {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
      } catch {
        // 忽略清理错误
      }
      return true;
    } else {
      Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageSaveFailed'));
      return false;
    }
  } catch (error) {
    console.error('Capture and save topic failed:', error);
    Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageSaveFailed'));
    return false;
  }
}

/**
 * 分享图片到系统分享菜单
 * @param imageUri 图片本地路径
 * @param t 国际化翻译函数
 * @returns Promise<boolean> 是否成功
 */
export async function shareImage(
  imageUri: string,
  t: (key: string, options?: any) => string,
): Promise<boolean> {
  try {
    // 动态导入 expo-sharing（避免 Web 平台错误）
    const Sharing = require('expo-sharing');

    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareNotAvailable'));
      return false;
    }

    await Sharing.shareAsync(imageUri, {
      dialogTitle: t('topic.shareImageTitle'),
      mimeType: 'image/png',
    });

    return true;
  } catch (error) {
    console.error('Share image failed:', error);
    Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageFailed'));
    return false;
  }
}

/**
 * 捕获 Topic 聊天内容并分享
 * @param viewRef Topic 内容的 View ref
 * @param t 国际化翻译函数
 * @returns Promise<boolean> 是否成功
 */
export async function captureTopicAndShare(
  viewRef: any,
  t: (key: string, options?: any) => string,
): Promise<boolean> {
  try {
    // 1. 捕获截图
    const imageUri = await captureViewToImage(viewRef, {
      format: 'png',
      quality: 1,
    });

    if (!imageUri) {
      Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageCaptureFailed'));
      return false;
    }

    // 2. 分享图片
    const shared = await shareImage(imageUri, t);

    // 3. 清理临时文件
    try {
      await FileSystem.deleteAsync(imageUri, { idempotent: true });
    } catch {
      // 忽略清理错误
    }

    return shared;
  } catch (error) {
    console.error('Capture and share topic failed:', error);
    Alert.alert(t('status.error', { ns: 'common' }), t('topic.shareImageFailed'));
    return false;
  }
}
