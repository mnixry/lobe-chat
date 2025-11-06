import { Checkbox, Flexbox, Text } from '@lobehub/ui-rn';
import React from 'react';

export default () => {
  return (
    <Flexbox gap={24}>
      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={false} disabled />
        <Text type="secondary">未选中 - 禁用</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={true} disabled />
        <Text type="secondary">已选中 - 禁用</Text>
      </Flexbox>
    </Flexbox>
  );
};
