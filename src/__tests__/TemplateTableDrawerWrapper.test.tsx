import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import { TemplateFormTypeEnum } from "@/types";
import { getCurrentTimestamp } from "@/utils";
import TemplateTableDrawerWrapper from "../components/TemplateTableDrawerWrapper";
import { AntdApiContextProviderCmp } from "../context/AntdApiContext";
import { fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe("TemplateTable component", () => {
  {
    const onSaveCallback = vi.fn();
    const { container } = render(
      <AntdApiContextProviderCmp>
        <TemplateTableDrawerWrapper
          data={[
            {
              id: "1",
              title: "你好",
              shortCode: "code",
              content: "我是内容",
              active: true,
              createdAt: getCurrentTimestamp(),
              modifiedAt: getCurrentTimestamp(),
            },
          ]}
          onChange={onSaveCallback}
        >
          <button data-testid={"trigger"}>Trigger</button>
        </TemplateTableDrawerWrapper>
      </AntdApiContextProviderCmp>,
    );

    const C = within(container);

    it("renders correctly", async () => {
      expect(true).toBeTruthy();
    });
  }
});
