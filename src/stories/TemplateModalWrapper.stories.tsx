import { useState } from "react";
import { Button } from "antd";
import { omit } from "lodash-es";
import { TemplateFormTypeEnum } from "@/types";
import { getCurrentTimestamp } from "@/utils";
import TemplateModalWrapper from "../components/TemplateModalWrapper";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TemplateModalWrapper> = {
  title: "TemplateModalWrapper",
  component: TemplateModalWrapper,
  args: {
    onSaved: fn(),
    onChange: fn(),
    onOpenChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);
    const [open, setOpen] = useState(props.open ?? false);

    function handleSaved(data) {
      setData(data);
      props?.onSaved?.(data);
    }

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    function handleOpenChange(open) {
      setOpen(open);
      props?.onOpenChange?.(open);
    }

    return (
      <div style={{ width: 480 }}>
        <TemplateModalWrapper
          {...omit(props, [
            "open",
            "data",
            "onSaved",
            "onChange",
            "onOpenChange",
          ])}
          open={open}
          data={data}
          onChange={handleChanged}
          onSaved={handleSaved}
          onOpenChange={handleOpenChange}
        >
          <Button>点击显示 modal</Button>
        </TemplateModalWrapper>
      </div>
    );
  },
};

type Story = StoryObj<typeof TemplateModalWrapper>;

const testingData = {
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  shortCode: faker.hacker.noun(),
  content: faker.commerce.productDescription(),
  active: true,
  createdAt: getCurrentTimestamp(),
  modifiedAt: getCurrentTimestamp(),
};

export const Add: Story = {};

export const Edit: Story = {
  args: {
    data: testingData,
    type: TemplateFormTypeEnum.EDIT,
  },
};

export const Readonly: Story = {
  args: {
    data: testingData,
    readonly: true,
    type: TemplateFormTypeEnum.EDIT,
  },
};

export const Limitation: Story = {
  args: {
    limitation: {
      title: 5,
      shortCode: 5,
      content: 5,
    },
  },
};

export default meta;
