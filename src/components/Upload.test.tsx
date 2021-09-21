import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Upload from "src/components/Upload";

test("renders learn react link", () => {
  const addImages = jest.fn();
  render(<Upload addImages={addImages} />);

  let dialog = document.querySelector("[data-testid=upload-dialog]");
  expect(dialog).not.toBeInTheDocument();

  let button = document.querySelector("[data-testid=upload-button]");
  expect(button?.innerHTML).toContain("Upload");

  act(() => {
    button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  dialog = document.querySelector("[data-testid=upload-dialog]");
  expect(dialog).toBeInTheDocument();

  let upload = document.querySelector("[data-testid=upload-upload]");
  expect(upload).toBeInTheDocument();

  expect(addImages).toBeCalledTimes(0);

  act(() => {
    upload!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(addImages).toBeCalledTimes(1);
});
