import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

// default export가 필요합니다
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// 각각의 스토리는 named export로 내보냅니다
export const Primary: Story = {
  args: {
  },
};
