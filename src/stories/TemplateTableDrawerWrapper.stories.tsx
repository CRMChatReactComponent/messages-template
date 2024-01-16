import { useState } from "react";
import { Button } from "antd";
import { omit } from "lodash-es";
import { TemplateFormTypeEnum, TemplateType } from "@/types";
import { getCurrentTimestamp, uuidv4 } from "@/utils";
import TemplateTableDrawerWrapper from "../components/TemplateTableDrawerWrapper";
import { getRandomTemplate } from "./helpers/getRandomTemplate";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TemplateTableDrawerWrapper> = {
  title: "TemplateTableDrawerWrapper",
  component: TemplateTableDrawerWrapper,
  args: {
    onOpenChange: fn(),
    onChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: 480 }}>
        <TemplateTableDrawerWrapper
          {...omit(props, ["data", "onChange"])}
          data={data}
          onChange={handleChanged}
        >
          <Button>点击进入 template 编辑</Button>
        </TemplateTableDrawerWrapper>
      </div>
    );
  },
};

type Story = StoryObj<typeof TemplateTableDrawerWrapper>;

export const Default: Story = {};

export const withData: Story = {
  args: {
    data: getRandomTemplate(),
  },
};

export default meta;
