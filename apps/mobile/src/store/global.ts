import { SessionDefaultGroup } from '@lobechat/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface GlobalState {
  drawerOpen: boolean;
  /**
   * 消息选择模式
   */
  messageSelectionMode: boolean;
  /**
   * 选中的消息 ID 列表
   */
  selectedMessageIds: string[];
  /**
   * Session 分组展开状态
   * 默认所有分组都展开
   */
  sessionGroupKeys: string[];
  topicDrawerOpen: boolean;
}

interface GlobalActions {
  /**
   * 清除消息选择
   */
  clearMessageSelection: () => void;
  /**
   * 退出消息选择模式
   */
  exitMessageSelectionMode: () => void;
  setDrawerOpen: (open: boolean) => void;
  /**
   * 设置消息选择模式
   */
  setMessageSelectionMode: (enabled: boolean) => void;
  setSessionGroupKeys: (keys: string[]) => void;
  setTopicDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  /**
   * 切换消息选中状态
   */
  toggleMessageSelection: (messageId: string) => void;
  /**
   * 全选或取消全选所有消息
   */
  toggleSelectAllMessages: (allMessageIds: string[]) => void;
  toggleTopicDrawer: () => void;
}

export const useGlobalStore = createWithEqualityFn<GlobalState & GlobalActions>()(
  (set, get) => ({
    clearMessageSelection: () => {
      set({ selectedMessageIds: [] });
    },
    drawerOpen: false,
    exitMessageSelectionMode: () => {
      set({ messageSelectionMode: false, selectedMessageIds: [] });
    },
    
    messageSelectionMode: false,
    
selectedMessageIds: [],

    // 默认展开 Pinned 和 Default 分组
sessionGroupKeys: [SessionDefaultGroup.Pinned, SessionDefaultGroup.Default],

    setDrawerOpen: (open: boolean) => {
      set({ drawerOpen: open });
    },

    setMessageSelectionMode: (enabled: boolean) => {
      set({ messageSelectionMode: enabled });
      if (!enabled) {
        set({ selectedMessageIds: [] });
      }
    },

    setSessionGroupKeys: (sessionGroupKeys: string[]) => {
      set({ sessionGroupKeys });
    },

    setTopicDrawerOpen: (open: boolean) => {
      set({ topicDrawerOpen: open });
    },

    toggleDrawer: () => {
      set({ drawerOpen: !get().drawerOpen });
    },

    toggleMessageSelection: (messageId: string) => {
      const { selectedMessageIds } = get();
      const isSelected = selectedMessageIds.includes(messageId);

      if (isSelected) {
        set({ selectedMessageIds: selectedMessageIds.filter((id) => id !== messageId) });
      } else {
        set({ selectedMessageIds: [...selectedMessageIds, messageId] });
      }
    },

    toggleSelectAllMessages: (allMessageIds: string[]) => {
      const { selectedMessageIds } = get();
      // 如果已经全选，则取消全选；否则全选
      if (selectedMessageIds.length === allMessageIds.length) {
        set({ selectedMessageIds: [] });
      } else {
        set({ selectedMessageIds: allMessageIds });
      }
    },

    toggleTopicDrawer: () => {
      set({ topicDrawerOpen: !get().topicDrawerOpen });
    },

    topicDrawerOpen: false,
  }),
  shallow,
);
