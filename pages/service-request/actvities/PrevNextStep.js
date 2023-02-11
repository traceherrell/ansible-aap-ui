import { useContext, useState } from "react";
//import { useParams, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
} from "@mui/material";

import { JobContext } from "../../../context/JobContext";

import { NotificationContext } from "../../../context/NotificationContext";

const PrevNextStep = ({ children, isValid, onSubmit }) => {
  const [open, setOpen] = useState(false);

  const { step } = useParams();
  const STEP = step ? parseInt(step) : 1;

  const { jobList, clearAllJobs } = useContext(JobContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const maxStep = jobList.length + 1;

  const nextStep = () => {
    if (isValid()) {
      navigate(`/service-request/step/${STEP + 1}`);
    } else {
      addNotification({
        severity: "error",
        message: "Please complete all required fields",
      });
    }
  };

  const prevStep = () => {
    navigate(`/service-request/step/${STEP - 1}`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
    clearAllJobs();
    navigate(`/service-request`);
  };
  const handleCancelClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <Stack
        marginTop="50px"
        marginRight="100px"
        direction="row-reverse"
        justifyContent="space-between"
      >
        {" "}
        <Stack spacing={2} direction="row-reverse">
          {onSubmit ? (
            <Button
              data-testid="button-submit"
              disabled={STEP > maxStep}
              onClick={onSubmit}
              variant="contained"
            >
              SUBMIT
            </Button>
          ) : (
            <Button
              data-testid="button-next"
              disabled={STEP > maxStep}
              onClick={nextStep}
              variant="contained"
            >
              NEXT
            </Button>
          )}
          <Button
            data-testid="button-prev"
            disabled={STEP < 2}
            onClick={prevStep}
            color="inherit"
          >
            PREVIOUS
          </Button>
          <Button
            data-testid="button-cancel"
            onClick={handleCancelClick}
            color="secondary"
          >
            CANCEL
          </Button>
        </Stack>
        {children}
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation Required</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to exit this service request before completion. This
            action is irreversible. Any data associated with this request will
            be permanently deleted.
          </DialogContentText>
          <DialogContentText paddingTop="15px" id="alert-dialog-description2">
            Do you wish to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            No, Go Back
          </Button>
          <Button onClick={handleCancel} autoFocus>
            Yes, Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PrevNextStep;
