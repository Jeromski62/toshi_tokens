import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { ToshiButtonComponent } from './button.component';

const meta: Meta<ToshiButtonComponent> = {
  title: 'Base/Button',
  component: ToshiButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Button',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ToshiButtonComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    button.focus();
    await expect(button).toHaveFocus();
  },
};
