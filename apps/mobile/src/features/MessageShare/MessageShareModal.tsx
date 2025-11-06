import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet, Button, Center, Flexbox, Text, useTheme, useToast } from '@lobehub/ui-rn';
import { Image as ExpoImage } from 'expo-image';
import { ShareIcon } from 'lucide-react-native';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ScrollView, View, useWindowDimensions } from 'react-native';

import { loading } from '@/libs/loading';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { captureViewToImage, saveImageToLibrary, shareImage } from '@/utils/captureTopicToImage';

import { ShareMessageContent } from './ShareMessageContent';

interface MessageShareModalProps {
  messageIds: string[];
  onClose?: () => void;
  visible: boolean;
}

/**
 * MessageShareModal - 消息分享模态框
 * 渲染选中的消息用于截图分享
 */
const MessageShareModal = memo<MessageShareModalProps>(({ messageIds, visible, onClose }) => {
  const theme = useTheme();
  const toast = useToast();
  const { t } = useTranslation(['chat', 'common']);
  const { width: windowWidth } = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const contentRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ height: number; width: number } | null>(null);

  const messages = useChatStore(chatSelectors.mainDisplayChats);

  // 获取选中的消息
  const selectedMessages = messages?.filter((msg) => messageIds.includes(msg.id)) || [];

  // 关闭模态框
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // 截图
  const handleCaptureImage = useCallback(async () => {
    if (!contentRef.current) {
      console.log('contentRef.current is null');
      return;
    }

    console.log('Starting capture...');
    setIsCapturing(true);
    const { done } = loading.start();

    try {
      const imageUri = await captureViewToImage(contentRef, {
        format: 'png',
        quality: 1,
      });

      console.log('Captured image URI:', imageUri);

      if (!imageUri) {
        throw new Error('Failed to capture image');
      }

      // 获取图片尺寸
      Image.getSize(
        imageUri,
        (width: number, height: number) => {
          console.log('Image size:', width, height);
          setImageSize({ height, width });
        },
        (error) => {
          console.error('Failed to get image size:', error);
        },
      );

      setCapturedImageUri(imageUri);
      console.log('Set captured image URI');
      done();
      setIsCapturing(false);
    } catch (error) {
      console.error('Screenshot failed:', error);
      done();
      setIsCapturing(false);
      toast.error(t('shareImageCaptureFailed'));
    }
  }, [t, toast]);

  // 控制 BottomSheet 的打开和关闭
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
      // 重置图片状态
      setCapturedImageUri(null);
      setImageSize(null);
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // 在内容渲染后自动截图
  useEffect(() => {
    console.log('Auto capture effect:', {
      capturedImageUri,
      contentRefCurrent: contentRef.current,
      isCapturing,
      visible,
    });

    if (visible && !capturedImageUri && !isCapturing) {
      console.log('Scheduling capture..., contentRef.current:', contentRef.current);
      // 延迟确保 BottomSheet 动画完成且内容完全渲染
      const timer = setTimeout(() => {
        console.log('Timer fired, contentRef.current:', contentRef.current);
        if (contentRef.current) {
          handleCaptureImage();
        } else {
          console.error('contentRef.current is still null after delay');
        }
      }, 500); // 增加到 1.5 秒确保动画完成
      return () => clearTimeout(timer);
    }
  }, [visible, capturedImageUri, isCapturing, handleCaptureImage]);

  // 保存图片
  const handleSaveImage = useCallback(async () => {
    if (!capturedImageUri) return;

    const saved = await saveImageToLibrary(capturedImageUri);
    if (saved) {
      toast.success(t('shareImageSaveSuccess'));
      handleClose();
    } else {
      toast.error(t('shareImageSaveFailed'));
    }
  }, [capturedImageUri, t, toast, handleClose]);

  // 分享图片
  const handleShareImage = useCallback(async () => {
    if (!capturedImageUri) return;

    await shareImage(capturedImageUri, t);
    // 分享后等待一小段时间再关闭，避免分享界面被打断
    setTimeout(() => {
      handleClose();
    }, 500);
  }, [capturedImageUri, t, handleClose]);

  // 计算图片在容器中的显示尺寸
  const displayImageSize = imageSize
    ? {
        height: ((windowWidth - 32) * imageSize.height) / imageSize.width,
        width: windowWidth - 32, // 减去左右 padding
      }
    : undefined;

  return (
    <BottomSheet
      disableScrollView
      enablePanDownToClose
      onClose={handleClose}
      open={visible}
      ref={bottomSheetRef}
      showCloseButton={false}
      snapPoints={['90%']}
    >
      <Flexbox flex={1} paddingInline={16}>
        {/* 图片预览区域 - 占据剩余空间 */}

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            position: 'relative',
          }}
          showsVerticalScrollIndicator={false}
          style={{
            borderRadius: theme.borderRadiusLG * 1.5,
          }}
        >
          {capturedImageUri ? (
            <ExpoImage
              contentFit="contain"
              source={{ uri: capturedImageUri }}
              style={{
                backgroundColor: theme.colorBgContainerSecondary,
                borderRadius: theme.borderRadiusLG * 1.5,
                height: displayImageSize?.height || 400,
                width: displayImageSize?.width || windowWidth - 32,
              }}
            />
          ) : (
            <Center align="center" flex={1} justify="center" paddingBlock={100}>
              <ActivityIndicator color={theme.colorPrimary} size="large" />
              <Text style={{ marginTop: 16 }} type="secondary">
                {t('status.capturing', { ns: 'common' })}
              </Text>
            </Center>
          )}
        </ScrollView>

        {/* 底部操作按钮（固定在底部） */}
        <Flexbox gap={12} horizontal paddingBlock={16}>
          <Button
            disabled={isCapturing || !capturedImageUri}
            icon={ShareIcon}
            onPress={handleShareImage}
          />
          <Flexbox flex={1}>
            <Button
              disabled={isCapturing || !capturedImageUri}
              onPress={handleSaveImage}
              type="primary"
            >
              {t('actions.saveToAlbum', { ns: 'common' })}
            </Button>
          </Flexbox>
        </Flexbox>
      </Flexbox>
      {/* 截图内容区域（始终隐藏在背后用于截图） */}
      <View
        pointerEvents="none"
        style={{
          opacity: 0,
          position: 'absolute',
          zIndex: -999,
        }}
      >
        <ShareMessageContent messages={selectedMessages} ref={contentRef} />
      </View>
    </BottomSheet>
  );
});

MessageShareModal.displayName = 'MessageShareModal';

export default MessageShareModal;
