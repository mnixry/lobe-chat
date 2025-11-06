import { Checkbox, Flexbox, Text } from '@lobehub/ui-rn';
import React from 'react';
import { Alert } from 'react-native';

export default () => {
  return (
    <Flexbox gap={24}>
      <Flexbox align="center" gap={12} horizontal>
        <Checkbox
          defaultChecked={false}
          onChange={(value) => Alert.alert('提示', `当前值: ${value}`)}
        />
        <Text>默认未选中（非受控）</Text>
      </Flexbox>

      <Flexbox align="center" gap={12} horizontal>
        <Checkbox
          defaultChecked={true}
          onChange={(value) => Alert.alert('提示', `当前值: ${value}`)}
        />
        <Text>默认选中（非受控）</Text>
      </Flexbox>
    </Flexbox>
  );
};
