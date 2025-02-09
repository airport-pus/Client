import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './row';

// default export가 필요합니다
const meta: Meta<typeof Row> = {
  title: 'UI/Row',
  component: Row,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Row>;

// 각각의 스토리는 named export로 내보냅니다
export const Primary: Story = {
  args: {
  },
};
