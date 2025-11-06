import { Checkbox, Flexbox, Text } from '@lobehub/ui-rn';
import React, { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} />
        <Text>点击切换状态</Text>
      </Flexbox>
      <Text type="secondary">当前状态: {checked ? '已选中' : '未选中'}</Text>
    </Flexbox>
  );
};
