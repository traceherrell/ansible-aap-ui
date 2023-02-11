import { useContext, useState } from "react";

import {
  Typography,
  Stack,
  Button,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { JobContext } from "../../context/JobContext";
import { NotificationContext } from "../../context/NotificationContext";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const JobList = () => {
  const { jobList, removeJob, moveJob } = useContext(JobContext);
  const { addNotification } = useContext(NotificationContext);

  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const { post } = useFetchWithAuth();

  const handleTemplateChange = (event) => {
    const { value } = event.target;
    setTemplateName(value);
  };

  const handleTemplateDescriptionChange = (event) => {
    const { value } = event.target;
    setTemplateDescription(value);
  };

  const handleStart = () => {};
  const handleSaveTemplate = async () => {
    try {
      const resposnse = await post("/userprofile/template", {
        id: Math.random().toString(36).substring(2, 15),
        description: templateDescription,
        name: templateName,
        tag: "personal",
        date: new Date().toISOString().substring(0, 10),
        activities: jobList.map((job) => job.id),
      });
      if (resposnse.ok) {
        addNotification({
          severity: "success",
          message: "Template saved successfully",
        });
      } else {
        addNotification({
          severity: "error",
          message: "Error saving template",
        });
      }
      setOpen(false);
    } catch (e) {
      addNotification({ severity: "error", message: "Error saving template" });
    }

    setOpen(false);
  };
  return (
    <Stack spacing={2}>
      {jobList.map((activity, i) => {
        return (
          <Paper elevation={3} key={activity.id} style={{ padding: "10px" }}>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography paddingLeft="5px" component="div">
                {`${activity.category} / ${activity.service} / ${activity.activity}`}
              </Typography>
              {activity.tag && <Chip label={activity.tag} />}
              <div>
                <IconButton
                  disabled={i === 0}
                  onClick={() => moveJob(activity.id, -1)}
                  data-testid={`${i}-button-up`}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  disabled={i === jobList.length - 1}
                  onClick={() => moveJob(activity.id, 1)}
                  data-testid={`${i}-button-down`}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
                <IconButton
                  onClick={() => removeJob(activity.id)}
                  data-testid={`${i}-button-remove`}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Stack>
          </Paper>
        );
      })}

      {jobList.length > 0 && (
        <Stack spacing={2} direction="row-reverse">
          <Button
            data-testid="button-start"
            disabled={!jobList.length}
            onClick={handleStart}
            variant="contained"
          >
            START
          </Button>
          <Button
            data-testid="button-save-template"
            disabled={jobList.length < 2}
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            SAVE AS TEMPLATE
          </Button>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Save as Personal Template
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The series of Service Activities in the current service request
                can be saved to your personal templates for later use. Please
                provide a name for this template below:
              </DialogContentText>
              <TextField
                sx={{ marginTop: "20px" }}
                id="input-template-name"
                name="templateName"
                onChange={handleTemplateChange}
                value={templateName}
                label="Template Name"
                variant="outlined"
                inputProps={{ "data-testid": "input-template-name" }}
              />
            </DialogContent>

            <DialogContent>
              <TextField
                multiline
                fullWidth
                id="input-template-description"
                name="templateDescription"
                onChange={handleTemplateDescriptionChange}
                value={templateDescription}
                label="Description"
                variant="outlined"
                inputProps={{ "data-testid": "input-template-description" }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  setOpen(false);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                disabled={templateName.length < 3}
                onClick={handleSaveTemplate}
                data-testid="button-save"
                autoFocus
                variant="contained"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      )}
    </Stack>
  );
};

export default JobList;
