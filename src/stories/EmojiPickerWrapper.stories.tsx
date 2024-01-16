import { useState } from "react";
import { Button, Space } from "antd";
import "antd";
import { omit } from "lodash-es";
import EmojiPickerWrapper from "../components/EmojiPickerWrapper";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Emoji, EmojiStyle } from "emoji-picker-react";

const meta: Meta<typeof EmojiPickerWrapper> = {
  title: "EmojiPickerWrapper",
  component: EmojiPickerWrapper,
  args: {
    onSelect: fn(),
    onOpenChange: fn(),
  },
  render(props) {
    const [emoji, setEmoji] = useState<string>();
    return (
      <div style={{ paddingLeft: 42 }}>
        <EmojiPickerWrapper
          {...omit(props, ["onSelect"])}
          onSelect={(emoji) => {
            setEmoji(emoji);
            props?.onSelect?.(emoji);
          }}
        >
          <Space size={12} align={"center"}>
            <div>
              {!!emoji && (
                <Emoji
                  unified={emoji}
                  emojiStyle={EmojiStyle.FACEBOOK}
                  size={32}
                />
              )}
            </div>
            <Button>显示图标选择器</Button>
          </Space>
        </EmojiPickerWrapper>
      </div>
    );
  },
};

type Story = StoryObj<typeof EmojiPickerWrapper>;

export const Basic: Story = {};

export default meta;
