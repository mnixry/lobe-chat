import type { ColorValue } from 'react-native';

import type { ActionIconProps } from '../ActionIcon';

export interface CheckboxProps extends Pick<ActionIconProps, 'style'> {
  activeColor?: ColorValue;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  glass?: boolean;
  onChange?: (value: boolean) => void;
  size?: number;
  uncheckedColor?: ColorValue;
}
