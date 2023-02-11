import React, { useContext } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { JobContext } from "../../../context/JobContext";

const AggAddresses = ({ aggregate_address, rowId, activityId }) => {
  const { updateJobParam, updateNestedJobParam } = useContext(JobContext);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    updateNestedJobParam(
      activityId,
      rowId,
      "aggregate_address",
      index,
      name,
      value
    );
  };
  const handleCheckBoxChange = (index, event) => {
    const { name, checked } = event.target;
    updateNestedJobParam(
      activityId,
      rowId,
      "aggregate_address",
      index,
      name,
      checked
    );
  };
  const handleRemoveClick = (index) => {
    const list = [...aggregate_address];
    list.splice(index, 1);

    updateJobParam(activityId, rowId, "aggregate_address", list);
  };
  const handleAddClick = () => {
    const list = [...aggregate_address];
    list.push({ network: "", summary_only: false });
    updateJobParam(activityId, rowId, "aggregate_address", list);
  };
  return (
    <Stack spacing={1}>
      {" "}
      {aggregate_address.map((adr, index) => (
        <Stack direction="row" key={index}>
          <Stack sx={{ padding: "5px" }} spacing={1}>
            <IconButton
              data-testid={`${index + 1}-agg-adr-button-add`}
              aria-label="add"
              onClick={(e) => handleAddClick(index)}
              sx={{ width: ".7em", height: ".7em" }}
            >
              <AddIcon sx={{ width: ".6em", height: ".6em" }} />
            </IconButton>
            <IconButton
              disabled={aggregate_address.length < 2}
              data-testid={`${index + 1}-agg-adr-button-remove`}
              aria-label="remove"
              sx={{ width: ".7em", height: ".7em" }}
              onClick={(e) => handleRemoveClick(index)}
            >
              <RemoveIcon sx={{ width: ".6em", height: ".6em" }} />
            </IconButton>
          </Stack>
          <TextField
            name="network"
            label="Network"
            inputProps={{
              "data-testid": `${index + 1}-input-network`,
            }}
            value={adr.network}
            onChange={(e) => handleInputChange(index, e)}
          />{" "}
          <FormGroup sx={{ paddingLeft: "5px" }}>
            <FormControlLabel
              label="Summary Only"
              control={
                <Checkbox
                  name="summary_only"
                  inputProps={{
                    "data-testid": `${index + 1}-input-summary-only`,
                  }}
                  onChange={(e) => handleCheckBoxChange(index, e)}
                  checked={adr.summary_only}
                />
              }
            />
          </FormGroup>
        </Stack>
      ))}{" "}
    </Stack>
  );
};

export default AggAddresses;
