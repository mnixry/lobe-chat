import { Checkbox, Flexbox, Text } from '@lobehub/ui-rn';
import React, { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(true);

  return (
    <Flexbox gap={24}>
      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} />
        <Text>主题色 (默认)</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox activeColor="#34C759" checked={checked} onChange={setChecked} />
        <Text>绿色</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox activeColor="#FF3B30" checked={checked} onChange={setChecked} />
        <Text>红色</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox activeColor="#FF9500" checked={checked} onChange={setChecked} />
        <Text>橙色</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox activeColor="#AF52DE" checked={checked} onChange={setChecked} />
        <Text>紫色</Text>
      </Flexbox>
    </Flexbox>
  );
};
