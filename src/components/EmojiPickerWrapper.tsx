import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, Space, Button } from "antd";
import { useIsDark } from "@/hooks/useIsDark";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";

type EmojiPickerWrapperProps = {
  children: ReactNode;
  disabled?: boolean;
  onSelect?: (emoji: string) => void;
  onOpenChange?: (open: boolean) => void;
};

const PLATFORM = EmojiStyle.FACEBOOK;

const EmojiPickerWrapper: FC<EmojiPickerWrapperProps> = ({
  children,
  disabled = false,
  onSelect = () => {},
  onOpenChange = () => {},
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const isDark = useIsDark();
  const { t } = useTranslation();

  useEffect(() => {
    onOpenChange(open);
  }, [open]);

  function handleEmojiSelect(emoji: EmojiClickData) {
    onSelect(emoji.emoji);
    setOpen(false);
  }

  function handleSetOpen(open) {
    if (disabled) return;
    setOpen(open);
  }

  return (
    <Popover
      title={""}
      open={open}
      onOpenChange={handleSetOpen}
      overlayInnerStyle={{
        backgroundColor: "transparent",
        padding: 0,
      }}
      trigger={["click"]}
      content={
        <Space direction={"vertical"} size={12}>
          <EmojiPicker
            skinTonesDisabled={true}
            onEmojiClick={handleEmojiSelect}
            emojiStyle={PLATFORM}
            lazyLoadEmojis={false}
            theme={isDark ? Theme.DARK : Theme.LIGHT}
          />
        </Space>
      }
      destroyTooltipOnHide={true}
    >
      {children}
    </Popover>
  );
};

export default EmojiPickerWrapper;
