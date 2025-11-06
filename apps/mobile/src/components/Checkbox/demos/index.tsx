import type { DemoConfig } from '@lobehub/ui-rn';
import React from 'react';

import BasicDemo from './basic';
import ColorsDemo from './colors';
import DisabledDemo from './disabled';
import SizesDemo from './sizes';
import UncontrolledDemo from './uncontrolled';

const demos: DemoConfig = [
  { component: <BasicDemo />, key: 'basic', title: '基础用法' },
  { component: <UncontrolledDemo />, key: 'uncontrolled', title: '非受控模式' },
  { component: <SizesDemo />, key: 'sizes', title: '不同尺寸' },
  { component: <ColorsDemo />, key: 'colors', title: '自定义颜色' },
  { component: <DisabledDemo />, key: 'disabled', title: '禁用状态' },
];

export default demos;
