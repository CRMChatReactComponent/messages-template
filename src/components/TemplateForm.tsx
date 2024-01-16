import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Input, Switch, Typography, Flex, Button } from "antd";
import { TemplateFormTypeEnum, TemplateType } from "@/types";
import { getCurrentTimestamp, uuidv4 } from "@/utils";
import EmojiPickerWrapper from "./EmojiPickerWrapper";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "styled-components";

const { Text } = Typography;

export type TemplateFormProps = {
  //  如果为新增时可以传入 null
  data: TemplateType | null;
  //  是编辑还是新增
  type?: TemplateFormTypeEnum;
  //  是否只读
  readonly?: boolean;
  //  字数限制
  limitation?: {
    title?: number;
    shortCode?: number;
    content?: number;
  };
  //  span 宽度，[0] 代表着 fieldName
  //  [1] 代表着输入框
  spanSize?: [number, number];
  onChange?: (data: TemplateType) => void;
  //  保存前需要判断下是否会出现冲突，比如 shortCode 冲突
  onBeforeSaved?: (data: TemplateType) => void | false | Promise<void | false>;
  onSaved?: (data: TemplateType) => void;
};

const Wrapper = styled.section`
  .ant-col .ant-typography {
    display: block;
    width: 100%;
    text-align: right;
  }
`;

const TextareaWrapper = styled.div`
  .epr-emoji-img {
    position: absolute;
    cursor: pointer;
    right: 2px;
    bottom: -1px;
    transform: translateY(100%);
  }

  .ant-input-data-count {
    padding-right: 24px;
  }
`;

const FieldSpan = styled.span<{
  $required?: boolean;
}>`
  display: inline-block;
  position: relative;

  &::after {
    content: ":";
    padding-left: ${(p) => (p.$required ? "8px" : "4px")};
  }

  &::before {
    content: "*";
    position: absolute;
    right: 4px;
    top: -4px;
    color: #f20;
    display: ${(p) => (p.$required ? "block" : "none")};
  }
`;

const TemplateForm: FC<TemplateFormProps> = ({
  data: _data,
  type = TemplateFormTypeEnum.CREATE,
  readonly = false,
  limitation = {},
  spanSize = [6, 18],
  onChange = () => {},
  onSaved = () => {},
  onBeforeSaved = () => {},
}) => {
  const {
    title: titleLimit = 40,
    shortCode: shortCodeLimit = 10,
    content: contentLimit = 5000,
  } = limitation;

  const [data, setData] = useState<TemplateType>(
    _data ? _data : getDefaultTemplateData(),
  );
  const lastCursorPosition = useRef<number>(0);
  const isAllowSaved = useMemo(() => {
    return data.title.trim().length > 0 && data.content.trim().length > 0;
  }, [data]);

  const { t } = useTranslation();

  useEffect(() => {
    _data ? setData(_data) : setData(getDefaultTemplateData());
  }, [_data]);

  async function handleSave() {
    const cb = await onBeforeSaved(data);
    if (cb !== false) {
      onSaved(data);
    }
  }

  function handleAddEmoji(emoji) {
    const newContent =
      data.content.slice(0, lastCursorPosition.current) +
      emoji +
      data.content.slice(lastCursorPosition.current);
    lastCursorPosition.current = lastCursorPosition.current + emoji.length;
    handleFieldChange("content", newContent);
  }

  function handleFieldChange<T extends keyof TemplateType>(
    key: T,
    value: TemplateType[T],
  ) {
    const newData = {
      ...data,
      [key]: value,
    };
    setData(newData);

    onChange(newData);
  }

  return (
    <Wrapper data-testid={"template-form"}>
      <Row gutter={[8, 24]}>
        <Col span={spanSize[0]}>
          <Text>
            <FieldSpan $required={true}>{t("title")}</FieldSpan>
          </Text>
        </Col>
        <Col span={spanSize[1]}>
          <Input
            showCount={true}
            maxLength={titleLimit}
            data-testid={"title"}
            placeholder={t("placeholder", { name: t("title") })}
            value={data.title}
            disabled={readonly}
            onChange={(ev) => handleFieldChange("title", ev.target.value)}
          />
        </Col>
        <Col span={spanSize[0]}>
          <Text>
            <FieldSpan>{t("shortCode")}</FieldSpan>
          </Text>
        </Col>
        <Col span={spanSize[1]}>
          <Input
            prefix={"/"}
            showCount={true}
            maxLength={shortCodeLimit}
            disabled={readonly}
            data-testid={"shortCode"}
            placeholder={t("placeholder", { name: t("shortCode") })}
            value={data.shortCode}
            onChange={(ev) => handleFieldChange("shortCode", ev.target.value)}
          />
        </Col>
        <Col span={spanSize[0]}>
          <Text>
            <FieldSpan $required={true}>{t("content")}</FieldSpan>
          </Text>
        </Col>
        <Col span={spanSize[1]}>
          <TextareaWrapper>
            <Input.TextArea
              showCount={true}
              maxLength={contentLimit}
              disabled={readonly}
              data-testid={"content"}
              placeholder={t("placeholder", { name: t("content") })}
              autoSize={{ minRows: 4, maxRows: 6 }}
              value={data.content}
              onChange={(ev) => handleFieldChange("content", ev.target.value)}
              onBlur={(ev) => {
                lastCursorPosition.current = ev.target.selectionStart;
              }}
            />
            <EmojiPickerWrapper onSelect={handleAddEmoji}>
              <div>
                <Emoji
                  unified={"1f600"}
                  emojiStyle={EmojiStyle.FACEBOOK}
                  size={18}
                />
              </div>
            </EmojiPickerWrapper>
          </TextareaWrapper>
        </Col>
        <Col span={spanSize[0]}>
          <Text>
            <FieldSpan>{t("active")}</FieldSpan>
          </Text>
        </Col>
        <Col span={spanSize[1]}>
          <Switch
            disabled={readonly}
            value={data.active}
            onChange={(val) => handleFieldChange("active", val)}
          />
        </Col>
      </Row>
      <Flex justify={"end"} style={{ marginTop: 24 }}>
        {!readonly && (
          <Button
            disabled={!isAllowSaved}
            type={"primary"}
            onClick={handleSave}
            data-testid={"saveBtn"}
          >
            {type === TemplateFormTypeEnum.CREATE ? t("create") : t("save")}
          </Button>
        )}
      </Flex>
    </Wrapper>
  );
};

function getDefaultTemplateData(): TemplateType {
  return {
    id: uuidv4(),
    title: "",
    shortCode: "",
    content: "",
    active: true,
    createdAt: getCurrentTimestamp(),
    modifiedAt: getCurrentTimestamp(),
  };
}

export default TemplateForm;
