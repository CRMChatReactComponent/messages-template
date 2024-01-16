import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import { TemplateFormTypeEnum } from "@/types";
import { getCurrentTimestamp } from "@/utils";
import TemplateForm from "../components/TemplateForm";
import { sleep } from "./helper/helper";
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

describe("TemplateForm component", () => {
  {
    const onSaveCallback = vi.fn();
    const { container } = render(
      <TemplateForm
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
        type={TemplateFormTypeEnum.EDIT}
      />,
    );

    const C = within(container);

    it("renders correctly", async () => {
      expect(C.getByTestId("template-form")).toBeTruthy();
    });

    it("renders fields correctly", async () => {
      expect(C.getByTestId("title")).toBeTruthy();
      expect(C.getByTestId("shortCode")).toBeTruthy();
      expect(C.getByTestId("content")).toBeTruthy();
    });

    it("type option works", async () => {
      const saveBtn = C.getByTestId("saveBtn") as HTMLButtonElement;
      expect(saveBtn.textContent).toBe("save");
    });

    it("save callback called", async () => {
      const saveBtn = C.getByTestId("saveBtn");
      fireEvent.click(saveBtn);
      await sleep(100);
      expect(onSaveCallback).toHaveBeenCalled();
    });
  }

  {
    const { container } = render(<TemplateForm data={null} readonly={true} />);
    const C = within(container);

    it("readonly option works", async () => {
      const input = C.getByTestId("content") as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });
  }
});
