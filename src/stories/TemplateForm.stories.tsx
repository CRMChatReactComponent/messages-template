import { useState } from "react";
import { omit } from "lodash-es";
import { TemplateFormTypeEnum } from "@/types";
import { getCurrentTimestamp } from "@/utils";
import TemplateForm from "../components/TemplateForm";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TemplateForm> = {
  title: "TemplateForm",
  component: TemplateForm,
  args: {
    onSaved: fn(),
    onChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);

    function handleSaved(data) {
      setData(data);
      props?.onSaved?.(data);
    }

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: 480 }}>
        <TemplateForm
          {...omit(props, ["data", "onSaved", "onChange"])}
          data={data}
          onChange={handleChanged}
          onSaved={handleSaved}
        />
      </div>
    );
  },
};

type Story = StoryObj<typeof TemplateForm>;

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
