import { UIChatMessage } from '@lobechat/types';
import { Checkbox, Flexbox } from '@lobehub/ui-rn';
import { memo, useCallback, useMemo } from 'react';

import { LOADING_FLAT } from '@/_const/message';
import { useChat } from '@/hooks/useChat';
import { useGlobalStore } from '@/store/global';

import MessageContextMenu from '../components/MessageContextMenu';
import AssistantMessage from './Assistant';
import GroupMessage from './Group';
import SupervisorMessage from './Supervisor';
import UserMessage from './User';

export interface ChatMessageItemProps {
  disableEditing?: boolean;
  /**
   * 强制使用普通模式渲染，忽略全局的消息选择状态
   * 用于截图等场景，不显示选择框和背景色
   */
  forceNormalMode?: boolean;
  /**
   * 隐藏操作栏（ActionsBar）
   * 用于选择模式和截图场景
   */
  hideActions?: boolean;
  index: number;
  item: UIChatMessage;
  totalLength: number;
}

/**
 * ChatMessageItem - 消息列表项容器
 *
 * 职责：
 * 1. 根据消息角色分发到对应的角色组件
 * 2. 提供 MessageContextMenu 上下文菜单支持
 * 3. 处理加载状态和 markdown 配置
 */
const ChatMessageItem = memo<ChatMessageItemProps>(
  ({ item, index, totalLength, disableEditing, forceNormalMode = false, hideActions = false }) => {
    const { isGenerating } = useChat();
    const [messageSelectionMode, selectedMessageIds, toggleMessageSelection] = useGlobalStore(
      (s) => [s.messageSelectionMode, s.selectedMessageIds, s.toggleMessageSelection],
    );
    const isLastMessage = index === totalLength - 1;
    const isAssistant = item.role === 'assistant';
    const isLoadingContent = item.content === LOADING_FLAT;
    const hasError = !!item.error?.type;
    // 如果有错误，即使content是LOADING_FLAT也不应该显示为loading状态
    const shouldShowLoading = isLastMessage && isAssistant && isLoadingContent && !hasError;
    const isSelected = selectedMessageIds.includes(item.id);

    // 在选择模式下，点击消息切换选中状态
    const handleMessagePress = useCallback(() => {
      if (messageSelectionMode) {
        toggleMessageSelection(item.id);
      }
    }, [messageSelectionMode, toggleMessageSelection, item.id]);

    const commonProps = {
      index,
      isGenerating,
      isLastMessage,
      isLoading: shouldShowLoading,
      message: item,
      showActionsBar: isLastMessage && !hideActions && !messageSelectionMode,
      totalLength,
    };

    const renderContent = useMemo(() => {
      switch (item?.role) {
        case 'user': {
          return <UserMessage {...commonProps} />;
        }

        case 'assistant': {
          return (
            <AssistantMessage {...commonProps} disableEditing={disableEditing} showTime showTitle />
          );
        }

        case 'group': {
          return (
            <GroupMessage
              {...item}
              disableEditing={disableEditing}
              index={index}
              isGenerating={isGenerating}
              isLastMessage={isLastMessage}
              showTime
              showTitle
            />
          );
        }

        case 'supervisor': {
          return <SupervisorMessage {...commonProps} />;
        }

        default: {
          return null;
        }
      }
    }, [item?.role, commonProps, disableEditing, index, isGenerating, isLastMessage]);

    if (!item) return null;

    // 选择模式：显示复选框（除非强制使用普通模式）
    if (messageSelectionMode && !forceNormalMode) {
      return (
        <Flexbox
          align="flex-start"
          gap={16}
          horizontal
          onPress={handleMessagePress}
          paddingBlock={8}
          pressEffect
          style={{
            paddingLeft: 8,
            paddingRight: 16,
          }}
        >
          <Checkbox checked={isSelected} style={{ marginBlock: 2, pointerEvents: 'none' }} />

          {/* 消息内容 */}
          <Flexbox flex={1} gap={8} style={{ pointerEvents: 'none' }}>
            {renderContent}
          </Flexbox>
        </Flexbox>
      );
    }

    // 正常模式：显示上下文菜单
    return (
      <MessageContextMenu
        borderRadius={false}
        gap={8}
        message={item}
        paddingBlock={8}
        paddingInline={16}
      >
        {renderContent}
      </MessageContextMenu>
    );
  },
);

ChatMessageItem.displayName = 'ChatMessageItem';

export { ChatMessageItem };
export default ChatMessageItem;
