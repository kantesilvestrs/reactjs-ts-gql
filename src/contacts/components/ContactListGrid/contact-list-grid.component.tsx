import React, { useState } from "react";
import { Link } from "react-router-dom";

// Material usings
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

// Internal usings
import IContact from "./../../gql-client/model/IContact";
import ContactDeleteDialog, {
  ContactDeleteDialogOnCloseParams
} from "../ContactDeleteDialog/contact-delete-dialog.component";

const ContactActionButton = withStyles(theme => ({
  root: {
    margin: theme.spacing(1)
  }
}))(IconButton);

export interface ContactListGridProps {
  contacts: IContact[];
  onContactChange?(): void;
}

export interface ContactListGridState {
  deleteContactDialogOpen: boolean;
  selectedContact: IContact | null;
}

const ContactListGrid: React.FunctionComponent<ContactListGridProps> = ({
  contacts,
  onContactChange
}) => {
  const [values, setStates] = useState<ContactListGridState>({
    deleteContactDialogOpen: false,
    selectedContact: null
  });

  function handleContactDeleteButtonClick(contact: IContact) {
    if (contact) {
      setStates({
        ...values,
        deleteContactDialogOpen: true,
        selectedContact: contact
      });
    }
  }

  function handleContactDeleteDialogOnClose(
    params: ContactDeleteDialogOnCloseParams
  ) {
    setStates({
      ...values,
      deleteContactDialogOpen: false,
      selectedContact: null
    });
    if (typeof onContactChange === "function") {
      onContactChange();
    }
  }

  if (contacts.length === 0) {
    return (
      <Paper>
        <Typography paragraph={true} style={{ padding: "10px" }}>
          No contact data found.
        </Typography>
      </Paper>
    );
  }

  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map(contact => {
            const { id, name, email } = contact;
            return (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  <ContactActionButton
                    size="small"
                    color="secondary"
                    aria-label="Delete"
                    onClick={() => handleContactDeleteButtonClick(contact)}
                  >
                    <DeleteIcon />
                  </ContactActionButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ContactDeleteDialog
        open={values.deleteContactDialogOpen}
        contact={values.selectedContact}
        onClose={params => handleContactDeleteDialogOnClose(params)}
      />
    </React.Fragment>
  );
};

export default ContactListGrid;
