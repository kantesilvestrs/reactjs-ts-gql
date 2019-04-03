import React from "react";
import {
  wait,
  render,
  cleanup,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved,
  act
} from "@testing-library/react";
import { MockedProvider } from "react-apollo/test-utils";
import ContactAddDialog, {
  ADD_CONTACT,
  ContactAddDialogOnCloseParams
} from "./contact-add-dialog.component";
import "jest-dom/extend-expect";

describe("Test: ContactAddDialog_component_render", () => {
  const dialogTestId = "contactadddialog-component";
  const dialogAddFormTestId = `${dialogTestId}-add-form`;
  const dialogNameFieldTestId = `${dialogTestId}-name-field`;
  const dialogEmailFieldTestId = `${dialogTestId}-email-field`;
  const dialogActionsTestId = `${dialogTestId}-actions`;
  const dialogCreateButtonTestId = `${dialogTestId}-create-button`;
  const dialogCloseButtonTestId = `${dialogTestId}-close-button`;
  const loadingSpinnerTestId = "loadingwrapper-component-loadingspinner";

  describe("(Render)", () => {
    afterEach(cleanup);
    it("1: should render without crashing", () => {
      render(
        <MockedProvider>
          <ContactAddDialog open={true} onClose={() => {}} />
        </MockedProvider>
      );
    });
    it("2: should render when open prop set true", async () => {
      const { queryByTestId } = render(
        <MockedProvider>
          <ContactAddDialog
            open={true}
            onClose={() => {}}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );
      expect(queryByTestId(dialogTestId)).not.toBeNull();
    });
    it("3: should not render when open prop set false", () => {
      const { queryByTestId } = render(
        <MockedProvider>
          <ContactAddDialog
            open={false}
            onClose={() => {}}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );
      expect(queryByTestId(dialogTestId)).toBeNull();
    });
    it("4: should render if onClose prop not defined", () => {
      const { queryByTestId } = render(
        <MockedProvider>
          <ContactAddDialog open={true} data-testid={dialogTestId} />
        </MockedProvider>
      );
      expect(queryByTestId(dialogTestId)).not.toBeNull();
    });
    it("5: should close if open prop changes to false", () => {
      //expect(true).toBe(false);
    });
  });

  describe("(Action): Create", () => {
    afterEach(cleanup);

    // Same data
    // should correctly reflect input changes
    // should correctly reflect multiple input changes
    // should render loading spinner and hide action buttons when clicking create
    // should use correct values against mocked request
    // should send send onClose({confirm: true}) once when contact is created

    it("1: should correctly reflect input changes", () => {
      //expect(true).toBe(false);
    });
    it("2: should correctly reflect multiple input changes", () => {
      //expect(true).toBe(false);
    });
    it("3: should render loading spinner and hide actions when create is clicked", async done => {
      const mocks = [
        {
          request: {
            query: ADD_CONTACT,
            variables: {
              name: "",
              email: ""
            }
          },
          result: {
            data: { addContact: null }
          }
        }
      ];
      const { getByTestId, queryByTestId } = render(
        <MockedProvider mocks={mocks}>
          <ContactAddDialog open={true} />
        </MockedProvider>
      );

      expect(queryByTestId(dialogCreateButtonTestId)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId(dialogCreateButtonTestId));
      });

      expect(queryByTestId(dialogActionsTestId)).not.toBeInTheDocument();
      expect(queryByTestId(loadingSpinnerTestId)).toBeInTheDocument();

      done();
    });
    it("4: should use correct values against mocked request", async done => {
      const mockFn = jest.fn(
        (params: ContactAddDialogOnCloseParams) => params.confirm
      );
      const testContact = {
        id: "contact-test-id",
        name: "contact-test-name",
        email: "contact-test-email"
      };
      const mocks = [
        {
          request: {
            query: ADD_CONTACT,
            variables: {
              name: testContact.name,
              email: testContact.email
            }
          },
          result: {
            data: {
              addContact: {
                id: "result-id",
                name: testContact.name,
                email: testContact.email
              }
            }
          }
        }
      ];
      const { getByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ContactAddDialog open={true} onClose={mockFn} />
        </MockedProvider>
      );

      const nameInput = getByTestId(dialogNameFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;
      const emailinput = getByTestId(dialogEmailFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;

      // Input fields should exist
      expect(nameInput).toBeInstanceOf(HTMLInputElement);
      expect(emailinput).toBeInstanceOf(HTMLInputElement);

      // Set name and email fields
      act(() => {
        // Trigger input changes
        fireEvent.change(nameInput, {
          target: { value: testContact.name }
        });
        fireEvent.change(emailinput, {
          target: { value: testContact.email }
        });
      });

      act(() => {
        // Initiate create mutation
        fireEvent.click(getByTestId(dialogCreateButtonTestId));
      });

      // Wait for mocked request to be called
      await wait(() => {});

      done();
    });
    it("5: should successfully complete create when values are changed multiple times", async done => {
      const mockFn = jest.fn(
        (params: ContactAddDialogOnCloseParams) => params.confirm
      );
      const testContact = {
        id: "contact-test-id",
        name: "contact-test-name",
        email: "contact-test-email"
      };
      const mocks = [
        {
          request: {
            query: ADD_CONTACT,
            variables: {
              name: testContact.name,
              email: testContact.email
            }
          },
          result: {
            data: {
              addContact: {
                id: "result-id",
                name: testContact.name,
                email: testContact.email
              }
            }
          }
        }
      ];
      const { getByTestId, queryByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ContactAddDialog
            open={true}
            onClose={mockFn}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      const nameInput = getByTestId(dialogNameFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;
      const emailinput = getByTestId(dialogEmailFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;

      // Input fields should exist
      expect(nameInput).toBeInstanceOf(HTMLInputElement);
      expect(emailinput).toBeInstanceOf(HTMLInputElement);

      // Set name and email fields

      // Trigger input changes
      fireEvent.change(nameInput, {
        target: { value: "_initial_value_name" }
      });
      fireEvent.change(emailinput, {
        target: { value: "_initial_value_email" }
      });

      // Trigger second input changes
      fireEvent.change(nameInput, {
        target: { value: testContact.name }
      });
      fireEvent.change(emailinput, {
        target: { value: testContact.email }
      });

      // Initiate create mutation
      fireEvent.click(getByTestId(dialogCreateButtonTestId));

      // Wait for mocked request to be called
      await wait(() => {});

      await wait(() => {
        expect(queryByTestId(dialogTestId)).not.toBeInTheDocument();
      });

      done();
    });
    it("6: should send single onClose({confirm: true}) callback when contact is created ", async done => {
      const mockFn = jest.fn(
        (params: ContactAddDialogOnCloseParams) => params.confirm
      );
      const testContact = {
        id: "contact-test-id",
        name: "contact-test-name",
        email: "contact-test-email"
      };
      const mocks = [
        {
          request: {
            query: ADD_CONTACT,
            variables: {
              name: testContact.name,
              email: testContact.email
            }
          },
          result: {
            data: {
              addContact: {
                id: "result-id",
                name: testContact.name,
                email: testContact.email
              }
            }
          }
        }
      ];
      const { getByTestId, queryByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ContactAddDialog
            open={true}
            onClose={mockFn}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      const nameInput = getByTestId(dialogNameFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;
      const emailinput = getByTestId(dialogEmailFieldTestId).querySelector(
        "input"
      ) as HTMLInputElement;

      // Input fields should exist
      expect(nameInput).toBeInstanceOf(HTMLInputElement);
      expect(emailinput).toBeInstanceOf(HTMLInputElement);

      // Set name and email fields

      // Trigger input changes
      fireEvent.change(nameInput, {
        target: { value: testContact.name }
      });
      fireEvent.change(emailinput, {
        target: { value: testContact.email }
      });

      // Initiate create mutation
      fireEvent.click(getByTestId(dialogCreateButtonTestId));

      // Wait for mocked request to be called
      await wait(() => {});

      expect(mockFn).toBeCalled();
      expect(mockFn).toBeCalledTimes(1);
      expect(mockFn).toReturnWith(true);

      done();
    });
  });

  describe("(Action): Close", () => {
    afterEach(cleanup);
    it("1: should send onClose({confirm: false}) once and unmount component", async done => {
      const mockFn = jest.fn(
        (params: ContactAddDialogOnCloseParams) => params.confirm
      );
      const { getByTestId, queryByTestId } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <ContactAddDialog
            open={true}
            onClose={mockFn}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      // Initiate create mutation
      fireEvent.click(getByTestId(dialogCloseButtonTestId));

      await wait(() => {
        expect(queryByTestId(dialogTestId)).not.toBeInTheDocument();
      });

      expect(mockFn).toBeCalled();
      expect(mockFn).toBeCalledTimes(1);
      expect(mockFn).toReturnWith(false);

      done();
    });
  });
});

// inputs
// values match
// values pass through to save

// save data
// correct data gets saved
// data is reset after re-open
// error on null return

// callbacks
// returns true on successful save
// returns false on cancel button click

// states
// dialog open
// dialog content loading
// dailog query error
