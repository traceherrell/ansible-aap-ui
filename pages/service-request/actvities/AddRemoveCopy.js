import { useContext } from "react";

import { IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { JobContext } from "../../../context/JobContext";

const AddRemoveCopy = ({ activityId, rowId }) => {
  const {
    copyJobParamsRow,
    removeJobParamsRow,
    addJobParamsRow,
    getJobParams,
  } = useContext(JobContext);
  const paramsLength = getJobParams(activityId).length;

  const handleCopy = (e, rowId) => {
    e.stopPropagation();
    copyJobParamsRow(activityId, rowId);
  };

  const handleRemove = (e, rowId) => {
    e.stopPropagation();
    removeJobParamsRow(activityId, rowId);
  };

  const handleAdd = (e, rowId) => {
    e.stopPropagation();
    addJobParamsRow(activityId, rowId);
  };
  return (
    <Stack
      sx={{ paddingTop: "5px", paddingLeft: "5px" }}
      alignItems="flex-start"
      spacing={1}
      direction="row"
    >
      <IconButton
        color="secondary"
        data-testid={`${rowId}-button-add`}
        aria-label="add"
        onClick={(e) => handleAdd(e, rowId)}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        disabled={paramsLength < 2}
        color="secondary"
        data-testid={`${rowId}-button-remove`}
        aria-label="remove"
        onClick={(e) => handleRemove(e, rowId)}
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        color="secondary"
        data-testid={`${rowId}-button-copy`}
        aria-label="copy"
        onClick={(e) => handleCopy(e, rowId)}
      >
        <ContentCopyIcon />
      </IconButton>
    </Stack>
  );
};

export default AddRemoveCopy;
