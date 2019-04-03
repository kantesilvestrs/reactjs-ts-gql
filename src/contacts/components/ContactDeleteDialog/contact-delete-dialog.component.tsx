import React, { useState, useEffect, FormEvent } from "react";
import gql from "graphql-tag";
import IContact from "../../gql-client/model/IContact";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@material-ui/core";
import { Mutation, MutationFn } from "react-apollo";
import LoadingWrapper from "../../../components/LoadingWrapper/loading-wrapper.component";

export type DeleteContactMutationDataType = {
  deleteContact: boolean;
};

export type DeleteContactMutationVariableType = {
  id: string;
};

export const DELETE_CONTACT = gql`
  mutation deleteContact($id: ID) {
    deleteContact(id: $id)
  }
`;

export interface ContactDeleteDialogOnCloseParams {
  confirm: boolean;
}

export interface ContactDeleteDialogProps {
  open: boolean;
  contact: IContact | null;
  onClose?(params: ContactDeleteDialogOnCloseParams): void;
}

const ContactDeleteDialog: React.FunctionComponent<
  ContactDeleteDialogProps
> = ({ open, contact, onClose, ...props }) => {
  const [dialogOpen, setOpen] = useState<boolean>(open);

  if (!contact || !contact.id) {
    contact = { id: "", name: "", email: "" };
  }

  useEffect(() => {
    if (dialogOpen != open) {
      setOpen(open);
    }
  }, [open]);

  let handleOnClose = (params: ContactDeleteDialogOnCloseParams) => {
    setOpen(false);
    if (onClose) {
      onClose(params);
    }
  };

  const { id, name } = contact;
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open && dialogOpen}
      {...props}
    >
      <Mutation<
        DeleteContactMutationDataType,
        DeleteContactMutationVariableType
      >
        mutation={DELETE_CONTACT}
        variables={{ id: id }}
        onCompleted={() => handleOnClose({ confirm: true })}
      >
        {(deleteContact, { loading }) => {
          return (
            <React.Fragment>
              <DialogTitle id="confirmation-dialog-title">
                Confirm action
              </DialogTitle>
              <LoadingWrapper loading={loading}>
                <DialogContent dividers>
                  {id !== "" ? (
                    <Typography
                      paragraph={true}
                      data-testid="contactdeletedialog-component-action-message"
                    >
                      Do you want to delete
                      <b style={{ fontWeight: "bold" }}>{name}'s</b> contact
                      details?
                    </Typography>
                  ) : (
                    <Typography
                      paragraph={true}
                      data-testid="contactdeletedialog-component-nodatafound"
                    >
                      No data found.
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions data-testid="contactdeletedialog-component-actions">
                  <Button
                    color="primary"
                    onClick={() => handleOnClose({ confirm: false })}
                    data-testid="contactdeletedialog-component-cancel-button"
                  >
                    Close
                  </Button>
                  {id !== "" && (
                    <Button
                      color="secondary"
                      onClick={() => {
                        deleteContact().then();
                      }}
                      data-testid="contactdeletedialog-component-delete-button"
                    >
                      Delete
                    </Button>
                  )}
                </DialogActions>
              </LoadingWrapper>
            </React.Fragment>
          );
        }}
      </Mutation>
    </Dialog>
  );
};

export default ContactDeleteDialog;
