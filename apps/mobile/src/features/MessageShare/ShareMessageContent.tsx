import { UIChatMessage } from '@lobechat/types';
import { Divider, Flexbox, LobeHub, Text, useTheme } from '@lobehub/ui-rn';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';

import { ChatMessageItem } from '@/features/Conversation/Messages';

interface ShareMessageContentProps {
  messages: UIChatMessage[];
}

/**
 * ShareMessageContent - 分享消息内容组件
 * 用于渲染需要截图的消息内容
 */
export const ShareMessageContent = forwardRef<View, ShareMessageContentProps>(
  ({ messages }, ref) => {
    const theme = useTheme();
    const { t } = useTranslation('chat');
    const { width: windowWidth } = useWindowDimensions();

    return (
      <View
        collapsable={false}
        ref={ref}
        style={{
          backgroundColor: theme.colorBgContainerSecondary,
          paddingBlock: 16,
          width: windowWidth,
        }}
      >
        {/* 头部信息 */}
        <Flexbox paddingBlock={8} paddingInline={16}>
          <LobeHub size={32} type={'combine'} />
        </Flexbox>

        {/* 消息列表 */}
        <Flexbox gap={16}>
          {messages.map((message, index) => (
            <ChatMessageItem
              disableEditing
              forceNormalMode
              hideActions
              index={index}
              item={message}
              key={message.id}
              totalLength={messages.length}
            />
          ))}
        </Flexbox>

        {/* 底部水印 */}
        <Flexbox paddingInline={16}>
          <Divider style={{ marginBlock: 16 }} />
          <Text align={'center'} fontSize={12} style={{ marginBlock: 8 }} type="secondary">
            {t('shareDisclaimer')}
          </Text>
        </Flexbox>
      </View>
    );
  },
);

ShareMessageContent.displayName = 'ShareMessageContent';
