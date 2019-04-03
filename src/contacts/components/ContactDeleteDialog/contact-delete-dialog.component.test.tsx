import React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import ContactDeleteDialog, {
  DELETE_CONTACT,
  ContactDeleteDialogOnCloseParams
} from "./contact-delete-dialog.component";
import {
  render,
  cleanup,
  fireEvent,
  wait,
  act,
  waitForElement
} from "@testing-library/react";

//#region Do not modify existing mock data
const mockData = [
  {
    id: "",
    name: "",
    email: ""
  },
  {
    id: "contact-test-1-id",
    name: "contact-test-1-name",
    email: "contact-test-1-email"
  },
  {
    id: "contact-test-2-id",
    name: "contact-test-2-name",
    email: "contact-test-2-email"
  }
];
//#endregion

describe("Test: ContactDeleteDialog_component", () => {
  const dialogTestId = "contactdeletedialog-component";
  const dialogActionMessageTestId = `${dialogTestId}-action-message`;
  const dialogNoDataFoundTestId = `${dialogTestId}-nodatafound`;
  const dialogDeleteButtonTestId = `${dialogTestId}-delete-button`;
  const dialogCancelButtonTestId = `${dialogTestId}-cancel-button`;
  const dialogActionsTestId = `${dialogTestId}-actions`;
  const loadingSpinnerTestId = "loadingwrapper-component-loadingspinner";

  describe("(Render)", () => {
    afterEach(cleanup);

    it("1: should render without crashing", () => {
      render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={mockData[0]}
            onClose={() => {}}
          />
        </MockedProvider>
      );
    });

    it("2: should render component without onClose property", () => {
      render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog open={true} contact={mockData[0]} />
        </MockedProvider>
      );
    });

    it("3: should render component if open is true", () => {
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={mockData[0]}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogTestId)).toBeDefined();
    });

    it("4: should not render component if open is false", () => {
      const { queryByTestId, container } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={false}
            contact={mockData[0]}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogTestId)).toBeNull();
    });

    it("5: should display correct action message", () => {
      const testContact = mockData[1];
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={testContact}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogActionMessageTestId)).not.toBeNull();
      expect(
        (queryByTestId(dialogActionMessageTestId) as HTMLElement).innerHTML
      ).toContain(testContact.name);
    });

    it("6: should hide delete button and show no data found message if id is empty", () => {
      const testContact = mockData[0];
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={testContact}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogActionMessageTestId)).toBeNull();
      expect(queryByTestId(dialogDeleteButtonTestId)).toBeNull();
      expect(queryByTestId(dialogNoDataFoundTestId)).not.toBeNull();
      expect(queryByTestId(dialogCancelButtonTestId)).not.toBeNull();
    });

    it("7: should hide delete button and show no data found message if contact is null", () => {
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={null}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogActionMessageTestId)).toBeNull();
      expect(queryByTestId(dialogDeleteButtonTestId)).toBeNull();
      expect(queryByTestId(dialogNoDataFoundTestId)).not.toBeNull();
      expect(queryByTestId(dialogCancelButtonTestId)).not.toBeNull();
    });
  });

  describe("(Action): Delete", async () => {
    afterEach(cleanup);

    it("1: should display loading spinner and hide action message if delete button is clicked", async () => {
      const testContact = mockData[1];
      const mocks = [
        {
          request: {
            query: DELETE_CONTACT,
            variables: {
              id: testContact.id
            }
          },
          result: {
            data: {
              deleteContact: true
            }
          }
        }
      ];
      const { queryByTestId, getByTestId, container } = render(
        <MockedProvider mocks={mocks}>
          <ContactDeleteDialog
            open={true}
            contact={testContact}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogDeleteButtonTestId)).not.toBeNull();
      fireEvent.click(getByTestId(dialogDeleteButtonTestId));

      await waitForElement(() => getByTestId(loadingSpinnerTestId));
      expect(queryByTestId(dialogActionsTestId)).toBeNull();
    });

    it("2: should close dialog and send onClose({confirm: true}) once if delete mutation is successful", async () => {
      const mockFn = jest.fn((params: { confirm: boolean }) => {
        return params.confirm;
      });
      const testContact = mockData[1];
      const mocks = [
        {
          request: {
            query: DELETE_CONTACT,
            variables: {
              id: testContact.id
            }
          },
          result: {
            data: {
              deleteContact: true
            }
          }
        }
      ];
      const { queryByTestId, getByTestId } = render(
        <MockedProvider mocks={mocks}>
          <ContactDeleteDialog
            open={true}
            contact={testContact}
            onClose={mockFn}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogDeleteButtonTestId)).not.toBeNull();
      act(() => {
        fireEvent.click(getByTestId(dialogDeleteButtonTestId));
      });

      await wait(() => {
        expect(queryByTestId(dialogTestId)).toBeNull();
      });

      expect(mockFn).toBeCalled();
      expect(mockFn).toBeCalledTimes(1);
      expect(mockFn).toReturnWith(true);
    });

    //Q Displays loading spinner and does not display action message if delete button is clicked
    //Q Closes dialog and onClose Returns true if delete mutation is successful
    //X Shows error and hides delete button if delete mutation was unsuccessful
  });

  describe("(Action): Close", () => {
    afterEach(cleanup);
    it("1: should close dialog and return false onClose when cancel button is clicked", async () => {
      const mockFn = jest.fn((params: ContactDeleteDialogOnCloseParams) => {
        return params.confirm;
      });
      const { queryByTestId, getByTestId } = render(
        <MockedProvider mocks={[]}>
          <ContactDeleteDialog
            open={true}
            contact={mockData[0]}
            onClose={mockFn}
            data-testid={dialogTestId}
          />
        </MockedProvider>
      );

      expect(queryByTestId(dialogCancelButtonTestId)).not.toBeNull();
      act(() => {
        fireEvent.click(getByTestId(dialogCancelButtonTestId));
      });

      await wait(() => {
        expect(queryByTestId(dialogTestId)).toBeNull();
      });

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toBeCalledTimes(1);
      expect(mockFn).toReturnWith(false);
    });

    //Q Closes dialog and onClose Returns false if cancel button is clicked
  });
});
