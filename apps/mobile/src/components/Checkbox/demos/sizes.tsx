import { Checkbox, Flexbox, Text } from '@lobehub/ui-rn';
import React, { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(true);

  return (
    <Flexbox gap={24}>
      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} size={16} />
        <Text>小尺寸 (16px)</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} size={20} />
        <Text>默认尺寸 (20px)</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} size={24} />
        <Text>中尺寸 (24px)</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox checked={checked} onChange={setChecked} size={32} />
        <Text>大尺寸 (32px)</Text>
      </Flexbox>
    </Flexbox>
  );
};
