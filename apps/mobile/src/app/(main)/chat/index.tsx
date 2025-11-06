import {
  ActionIcon,
  Button,
  Checkbox,
  Flexbox,
  PageContainer,
  Text,
  useTheme,
} from '@lobehub/ui-rn';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ChevronRightIcon,
  Clock,
  ImagePlayIcon,
  MessageSquarePlusIcon,
  TextAlignStartIcon,
  X,
} from 'lucide-react-native';
import { darken } from 'polished';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

import ChatInput from '@/features/ChatInput';
import { ChatList } from '@/features/Conversation';
import Hydration from '@/features/Hydration';
import { MessageShareModal } from '@/features/MessageShare';
import SideBar from '@/features/SideBar';
import TopicDrawer from '@/features/TopicDrawer';
import { useSinglePress } from '@/hooks/useSinglePress';
import { useSwitchTopic } from '@/hooks/useSwitchSession';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors, sessionSelectors } from '@/store/session/selectors';
import { isIOS } from '@/utils/detection';

export default function ChatWithDrawer() {
  const theme = useTheme();
  const isInbox = useSessionStore(sessionSelectors.isInboxSession);
  const toggleTopicDrawer = useGlobalStore((s) => s.toggleTopicDrawer);
  const toggleDrawer = useGlobalStore((s) => s.toggleDrawer);
  const switchTopic = useSwitchTopic();
  const activeTopicId = useChatStore((s) => s.activeTopicId);
  const { t } = useTranslation(['chat', 'common']);
  const title = useSessionStore(sessionMetaSelectors.currentAgentTitle);

  const router = useRouter();
  const { handlePress: handleTitlePress, isPressed: isNavigating } = useSinglePress(() => {
    router.push('/chat/setting');
  });

  // 消息选择模式状态
  const [
    messageSelectionMode,
    selectedMessageIds,
    exitMessageSelectionMode,
    toggleSelectAllMessages,
  ] = useGlobalStore((s) => [
    s.messageSelectionMode,
    s.selectedMessageIds,
    s.exitMessageSelectionMode,
    s.toggleSelectAllMessages,
  ]);
  const [showShareModal, setShowShareModal] = useState(false);
  // 保存要分享的消息 ID 列表（在退出选择模式前保存）
  const [shareMessageIds, setShareMessageIds] = useState<string[]>([]);

  // 获取所有消息 ID
  const allMessages = useChatStore(chatSelectors.mainDisplayChats);
  const allMessageIds = useMemo(() => allMessages?.map((msg) => msg.id) || [], [allMessages]);
  const isAllSelected =
    selectedMessageIds.length === allMessageIds.length && allMessageIds.length > 0;

  const displayTitle = isInbox ? t('inbox.title') : title;
  const isInDefaultTopic = !activeTopicId;

  // 取消选择
  const handleCancel = useCallback(() => {
    exitMessageSelectionMode();
  }, [exitMessageSelectionMode]);

  // 全选/取消全选
  const handleToggleSelectAll = useCallback(() => {
    toggleSelectAllMessages(allMessageIds);
  }, [toggleSelectAllMessages, allMessageIds]);

  // 完成选择，打开分享模态框
  const handleDone = useCallback(() => {
    if (selectedMessageIds.length === 0) {
      return;
    }
    // 保存选中的消息 ID（在退出选择模式前）
    setShareMessageIds([...selectedMessageIds]);
    // 打开分享模态框并立即退出选择模式
    setShowShareModal(true);
    exitMessageSelectionMode();
  }, [selectedMessageIds, exitMessageSelectionMode]);

  // 关闭分享模态框
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setShareMessageIds([]); // 清空保存的消息 ID
  }, []);

  const renderContent = () => {
    return (
      <LinearGradient
        colors={[theme.colorBgContainerSecondary, darken(0.04, theme.colorBgLayout)]}
        locations={[0.2, 1]}
        style={{ flex: 1 }}
      >
        <PageContainer
          backgroundColor={'transparent'}
          extra={
            messageSelectionMode ? (
              // 选择模式：显示取消按钮
              <ActionIcon icon={X} onPress={handleCancel} pressEffect={false} />
            ) : (
              // 正常模式：显示原有操作按钮
              <Flexbox align={'center'} gap={1} horizontal>
                <ActionIcon
                  disabled={isInDefaultTopic}
                  icon={MessageSquarePlusIcon}
                  onPress={() => switchTopic()}
                  pressEffect={false}
                />
                <ActionIcon icon={Clock} onPress={toggleTopicDrawer} pressEffect={false} />
              </Flexbox>
            )
          }
          headerBackgroundColor={theme.colorBgContainerSecondary}
          left={
            messageSelectionMode ? (
              <Checkbox checked={isAllSelected} onChange={() => handleToggleSelectAll()} />
            ) : (
              // 正常模式：显示侧边栏按钮
              <ActionIcon icon={TextAlignStartIcon} onPress={toggleDrawer} pressEffect={false} />
            )
          }
          onTitlePress={
            messageSelectionMode
              ? undefined
              : (isInbox || isNavigating)
                ? undefined
                : handleTitlePress
          }
          title={
            messageSelectionMode ? (
              // 选择模式：显示选择数量
              <Text strong>{t('selectedMessages', { count: selectedMessageIds.length })}</Text>
            ) : (
              // 正常模式：显示标题
              displayTitle
            )
          }
          titleIcon={messageSelectionMode ? undefined : isInbox ? undefined : ChevronRightIcon}
        >
          <KeyboardStickyView offset={{ closed: 0, opened: isIOS ? 32 : 16 }} style={{ flex: 1 }}>
            <ChatList />
            {messageSelectionMode ? (
              <Flexbox padding={16} style={{ paddingTop: 24 }}>
                <Button
                  disabled={selectedMessageIds.length === 0}
                  icon={ImagePlayIcon}
                  onPress={handleDone}
                  padding={8}
                  paddingInline={16}
                  type={'primary'}
                >
                  {t('generateShareImage')}
                </Button>
              </Flexbox>
            ) : (
              <ChatInput />
            )}
          </KeyboardStickyView>
        </PageContainer>

        {/* 分享模态框 */}
        <MessageShareModal
          messageIds={shareMessageIds}
          onClose={handleCloseShareModal}
          visible={showShareModal}
        />
      </LinearGradient>
    );
  };

  return (
    <Flexbox flex={1}>
      {/* Hydration组件：处理URL和Store的双向同步 */}
      <Hydration />
      <SideBar>
        <TopicDrawer>{renderContent()}</TopicDrawer>
      </SideBar>
    </Flexbox>
  );
}
