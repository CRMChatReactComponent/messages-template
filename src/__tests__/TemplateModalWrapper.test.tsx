import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import { TemplateFormTypeEnum } from "@/types";
import { getCurrentTimestamp } from "@/utils";
import TemplateModalWrapper from "../components/TemplateModalWrapper";
import { sleep } from "./helper/helper";
import { fireEvent, render, cleanup, within } from "@testing-library/react";
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

describe("TemplateModalWrapper component", () => {
  {
    const onSaveCallback = vi.fn();
    const { container, queryByTestId, getByTestId } = render(
      <TemplateModalWrapper
        data={{
          id: "1",
          title: "你好",
          shortCode: "code",
          content: "我是内容",
          active: true,
          createdAt: getCurrentTimestamp(),
          modifiedAt: getCurrentTimestamp(),
        }}
        onSaved={onSaveCallback}
      >
        <button data-testid={"trigger"}></button>
      </TemplateModalWrapper>,
    );

    const triggerBtn = getByTestId("trigger");

    it("modal trigger correctly", async () => {
      fireEvent.click(triggerBtn);
      vi.waitUntil(() => !queryByTestId("template-form"));
      expect(getByTestId("template-form")).toBeTruthy();
    });

    it("renders fields correctly", async () => {
      expect(getByTestId("title")).toBeTruthy();
      expect(getByTestId("shortCode")).toBeTruthy();
      expect(getByTestId("content")).toBeTruthy();
    });

    it("save callback called", async () => {
      const saveBtn = getByTestId("saveBtn");
      fireEvent.click(saveBtn);
      await sleep(100);
      expect(onSaveCallback).toHaveBeenCalled();
    });
  }
});
