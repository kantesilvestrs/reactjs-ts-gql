import React from "react";
import { render, cleanup } from "@testing-library/react";
import LoadingWrapper from "./loading-wrapper.component";

describe("Test: LoadingWrapper_component_render", () => {
  const childTestId = "loadingwrapper-component-child";
  const loadingSpinnerTestId = "loadingwrapper-component-loadingspinner";
  const renderComponent = (loading?: boolean) =>
    render(
      <LoadingWrapper loading={loading || false}>
        <div data-testid={childTestId} />
      </LoadingWrapper>
    );

  afterEach(cleanup);

  it("1: should render without crashing", () => {
    renderComponent();
  });

  it("2: should render loading spinner and not child while IN loading state", () => {
    const { getByTestId } = renderComponent(true);

    expect(() => getByTestId(loadingSpinnerTestId)).toBeDefined();
    expect(() => getByTestId(childTestId)).toThrowError();
  });

  it("3: should render child and not loading spinner while NOT IN loading state", () => {
    const { getByTestId } = renderComponent();

    expect(() => getByTestId(childTestId)).toBeDefined();
    expect(() => getByTestId(loadingSpinnerTestId)).toThrowError();
  });

  it("4: should render child after finishing loading", () => {
    const { rerender, getByTestId } = renderComponent(true);

    expect(() => getByTestId(loadingSpinnerTestId)).toBeDefined();
    expect(() => getByTestId(childTestId)).toThrowError();

    rerender(
      <LoadingWrapper loading={false}>
        <div data-testid={childTestId} />
      </LoadingWrapper>
    );

    expect(() => getByTestId(childTestId)).toBeDefined();
    expect(() => getByTestId(loadingSpinnerTestId)).toThrowError();
  });

  it("5: should not render child when start loading", () => {
    const { rerender, getByTestId } = renderComponent(false);
    expect(() => getByTestId(childTestId)).toBeDefined();
    expect(() => getByTestId(loadingSpinnerTestId)).toThrowError();
    rerender(
      <LoadingWrapper loading={true}>
        <div data-testid={childTestId} />
      </LoadingWrapper>
    );
    expect(() => getByTestId(loadingSpinnerTestId)).toBeDefined();
    expect(() => getByTestId(childTestId)).toThrowError();
  });
});
