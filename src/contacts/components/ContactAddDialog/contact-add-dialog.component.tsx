import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import IContact from "../../gql-client/model/IContact";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  withStyles,
  Theme,
  TextField,
  Box
} from "@material-ui/core";
import { Mutation, MutationFn } from "react-apollo";
import LoadingWrapper from "../../../components/LoadingWrapper/loading-wrapper.component";

export const ADD_CONTACT = gql`
  mutation addContact($name: String, $email: String) {
    addContact(contact: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const TextFieldWithStyles = withStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}))(TextField);

type addContactMutation = {
  addContact: IContact;
};

type addContactMutationVariables = {
  name: string;
  email: string;
};

export interface ContactAddDialogOnCloseParams {
  confirm: boolean;
}

export interface ContactAddDialogProps {
  open: boolean;
  onClose?(params: ContactAddDialogOnCloseParams): void;
}

export interface ContactAddDialogState {
  dialogOpen: boolean;
  nameField: string;
  emailField: string;
}

const ContactDeleteDialog: React.FunctionComponent<ContactAddDialogProps> = ({
  open,
  onClose,
  ...props
}) => {
  const [values, setStates] = useState<ContactAddDialogState>({
    dialogOpen: open,
    nameField: "",
    emailField: ""
  });

  useEffect(() => {
    if (values.dialogOpen != open) {
      setStates({
        nameField: open ? "" : values.nameField,
        emailField: open ? "" : values.emailField,
        dialogOpen: open
      });
    }
  }, [open]);

  const handleFormFieldChange = (name: keyof ContactAddDialogState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStates({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    addContact: MutationFn<addContactMutation, addContactMutationVariables>
  ) => {
    event.preventDefault();
    addContact({
      variables: {
        name: values.nameField,
        email: values.emailField
      }
    });
  };

  const handleOnClose = (params: any) => {
    setStates({
      ...values,
      dialogOpen: false
    });
    if (onClose) {
      onClose(params);
    }
  };

  const { dialogOpen, nameField, emailField } = values;

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open && dialogOpen}
      {...props}
    >
      <Mutation<{ addContact: IContact }>
        mutation={ADD_CONTACT}
        onCompleted={() => handleOnClose({ confirm: true })}
      >
        {(addContact, { loading }) => {
          return (
            <React.Fragment>
              <DialogTitle id="confirmation-dialog-title">
                Add a new contact
              </DialogTitle>
              <LoadingWrapper loading={loading}>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={e => handleSubmit(e, addContact)}
                  data-testid="contactadddialog-component-add-form"
                >
                  <DialogContent dividers>
                    <Box
                      style={{
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                    >
                      <TextFieldWithStyles
                        name="name"
                        id="contact-name"
                        label="Full Name"
                        value={nameField}
                        onChange={handleFormFieldChange("nameField")}
                        data-testid="contactadddialog-component-name-field"
                      />
                      <TextFieldWithStyles
                        name="email"
                        id="contact-email"
                        label="Email"
                        value={emailField}
                        onChange={handleFormFieldChange("emailField")}
                        data-testid="contactadddialog-component-email-field"
                      />
                    </Box>
                  </DialogContent>

                  <DialogActions data-testid="contactadddialog-component-actions">
                    <Button
                      color="primary"
                      onClick={() => handleOnClose({ confirm: false })}
                      data-testid="contactadddialog-component-close-button"
                    >
                      close
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      data-testid="contactadddialog-component-create-button"
                    >
                      Create
                    </Button>
                  </DialogActions>
                </form>
              </LoadingWrapper>
            </React.Fragment>
          );
        }}
      </Mutation>
    </Dialog>
  );
};

export default ContactDeleteDialog;
