import { useContext, useEffect, useState } from "react";

import {
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";

import { JobContext } from "../../../context/JobContext";
import { NotificationContext } from "../../../context/NotificationContext";
import { useGraphApi } from "../../../hooks/useGraphApi";

import PrevNextStep from "./PrevNextStep";

const GlobalInfo = () => {
  const { globalInfo, updateGlobalInfo, submitJobs, clearAllJobs } =
    useContext(JobContext);
  const { addNotification } = useContext(NotificationContext);
  const [serviceAuthorizationGroups, setServiceAuthorization] = useState([]);

  const { get } = useGraphApi();

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    updateGlobalInfo(name, value);
  };

  const isValid = () => {
    let errors = {};
    if (!globalInfo.intakeNum) {
      errors.intakeNum = "Required";
    }
    if (!globalInfo.justification) {
      errors.justification = "Required";
    } else if (globalInfo.justification.length < 20) {
      errors.justification = "Min 20 characters";
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const getManagerNtid = async () => {
    try {
      const response = await get("/manager?$select=onPremisesSamAccountName");
      const data = await response.json();
      updateGlobalInfo("managerNtid", data.onPremisesSamAccountName);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getManagerNtid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    if (!isValid()) return;

    const response = await submitJobs();

    if (response.ok) {
      const id = await response.json();
      console.log(id);
      addNotification({
        severity: "success",
        message: "Jobs submitted successfully",
      });

      clearAllJobs();
      navigate("/");
    } else if (response.status === 401) {
      const info = await response.json();

      setServiceAuthorization(info.unAuthorizedActivities);

      addNotification({
        severity: "error",
        message:
          info.message +
          ". You can request to be added to the following groups: " +
          info.unAuthorizedActivities.join(", \n"),
      });
      setOpen(true);
    } else if (response.status === 409) {
      const info = await response.json();
      console.error(info);
      addNotification({
        severity: "error",
        message: info.message,
      });
    } else {
      const err = await response.json();
      console.error(err);
      addNotification({
        severity: "error",
        message: "error submitting request",
      });
    }
  };
  const handleYesRequestAuthClick = () => {
    // setOpen(false);
    navigate("/permissions");
  };

  return (
    <div>
      <Stack marginTop={"15px"} spacing={1} direction="row">
        <TextField
          label="Intake #"
          name="intakeNum"
          required
          error={!!errors["intakeNum"]}
          helperText={errors["intakeNum"]}
          value={globalInfo.intakeNum}
          inputProps={{ "data-testid": `input-intake-number` }}
          onChange={handleInputChange}
          variant="outlined"
        />
        <TextField
          label="Approver NTID"
          name="managerNtid"
          required
          error={!!errors["managerNtid"]}
          helperText={errors["managerNtid"]}
          value={globalInfo.managerNtid}
          inputProps={{ "data-testid": `input-managerNtid` }}
          onChange={handleInputChange}
          variant="outlined"
        />
      </Stack>
      <TextField
        fullWidth
        sx={{ marginTop: "15px" }}
        label="Business justification for the CR"
        name="justification"
        error={!!errors["justification"]}
        helperText={errors["justification"]}
        required
        value={globalInfo.justification}
        inputProps={{ "data-testid": `input-justification` }}
        onChange={handleInputChange}
        variant="outlined"
      />
      <TextField
        fullWidth
        multiline={true}
        error={!!errors["notes"]}
        helperText={errors["notes"]}
        rows={3}
        sx={{ marginTop: "15px" }}
        placeholder="Special Notes for CR Worklog"
        name="notes"
        value={globalInfo.notes}
        inputProps={{ "data-testid": `input-notes` }}
        onChange={handleInputChange}
      />

      <PrevNextStep isValid={isValid} onSubmit={onSubmit} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle data-testid="alert-dialog-title" id="alert-dialog-title">
          Authorization Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are not authorized for the requested service activities. Would
            you like to request authorization for the group(s) below?
          </DialogContentText>
          {serviceAuthorizationGroups.map((group) => (
            <DialogContentText key={group}>{group}</DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button
            color="secondary"
            onClick={handleYesRequestAuthClick}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GlobalInfo;
