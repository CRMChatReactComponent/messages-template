import { useState } from "react";
import { omit } from "lodash-es";
import { getCurrentTimestamp, uuidv4 } from "@/utils";
import TemplateTable from "../components/TemplateTable";
import { TemplateType } from "../types";
import { getRandomTemplate } from "./helpers/getRandomTemplate";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TemplateTable> = {
  title: "TemplateTable",
  component: TemplateTable,
  args: {
    onChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: "calc(100vw - 420px)" }}>
        <TemplateTable data={data} onChange={handleChanged} />
      </div>
    );
  },
};

type Story = StoryObj<typeof TemplateTable>;

export const Empty: Story = {};

export const DataList: Story = {
  args: {
    data: getRandomTemplate(),
  },
};

export default meta;
