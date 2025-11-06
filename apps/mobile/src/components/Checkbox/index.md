---
group: Form
title: Checkbox
description: 复选框组件，基于 ActionIcon 实现，提供选中和未选中两种状态的视觉反馈，支持受控和非受控模式。
---

## Features

- ✅ 支持受控和非受控模式
- ✅ 玻璃态设计，视觉效果更现代
- ✅ 可自定义颜色和大小
- ✅ 支持禁用状态
- ✅ 基于 ActionIcon 实现，继承其交互效果
- ✅ TypeScript 类型支持

## Basic Usage

### 受控模式

```tsx
import { Checkbox } from '@lobehub/ui-rn';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);

  return <Checkbox checked={checked} onChange={setChecked} />;
};
```

### 非受控模式

```tsx
import { Checkbox } from '@lobehub/ui-rn';

export default () => {
  return <Checkbox defaultChecked={false} onChange={(value) => console.log('当前值:', value)} />;
};
```

## API

### CheckboxProps

| 属性             | 类型                       | 默认值               | 说明                   |
| ---------------- | -------------------------- | -------------------- | ---------------------- |
| `checked`        | `boolean`                  | -                    | 是否选中（受控）       |
| `defaultChecked` | `boolean`                  | `false`              | 默认是否选中（非受控） |
| `disabled`       | `boolean`                  | `false`              | 是否禁用               |
| `onChange`       | `(value: boolean) => void` | -                    | 状态变化回调函数       |
| `size`           | `number`                   | `20`                 | 复选框大小（像素）     |
| `activeColor`    | `ColorValue`               | `theme.colorPrimary` | 选中时的颜色           |
| `uncheckedColor` | `ColorValue`               | `'transparent'`      | 未选中时的颜色         |

## Notes

- 组件使用 `useMergeState` 同时支持受控和非受控模式
- 选中时会显示 CheckIcon 图标，图标大小为 `size * 0.66`
- 使用玻璃态效果（glass），选中时背景色会应用 activeColor
- 禁用状态下透明度降低到 50%
