import { CheckIcon } from 'lucide-react-native';
import { readableColor } from 'polished';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import { useTheme } from '@/components/styles';

import ActionIcon from '../ActionIcon';
import type { CheckboxProps } from './type';

/**
 * Checkbox - 复选框组件
 * 提供选中和未选中两种状态的视觉反馈
 */
const Checkbox = memo<CheckboxProps>(
  ({
    checked: value,
    disabled = false,
    size = 20,
    activeColor,
    uncheckedColor = 'transparent',
    defaultChecked = false,
    onChange,
    glass,
    style,
  }) => {
    const [checked, setChecked] = useMergeState(defaultChecked, {
      defaultValue: defaultChecked,
      onChange,
      value,
    });
    const theme = useTheme();
    const acolor = (activeColor as string) || theme.colorPrimary;
    return (
      <ActionIcon
        color={readableColor(acolor)}
        disabled={disabled}
        glass={glass}
        glassColor={checked ? acolor : undefined}
        icon={checked ? CheckIcon : null}
        onPress={() => {
          if (disabled) return;
          setChecked(!checked);
        }}
        pressEffect
        size={{
          blockSize: size,
          borderRadius: size,
          size: size * 0.66,
          strokeWidth: 3,
        }}
        style={({ pressed, hovered }) => [
          {
            backgroundColor: checked ? acolor : uncheckedColor,
            borderWidth: 2,
            opacity: disabled ? 0.5 : 1,
          },
          typeof style === 'function' ? style({ hovered, pressed }) : style,
        ]}
        variant={'outlined'}
      />
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
