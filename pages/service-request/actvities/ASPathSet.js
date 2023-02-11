import { useContext, useState } from "react";

import {
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddRemoveCopy from "./AddRemoveCopy";
import { JobContext } from "../../../context/JobContext";
import PrevNextStep from "./PrevNextStep";
import Accordion from "../../../components/Accordion";
import ContainerHeight from "../../../components/ContainerHeight";

const EntryKeyHelp = {
  remark: "Plain text comment or label	string commonly starts with a space",
  "dfa-regex": "DFA style regular expression	string is a regex",
  "ios-regex": "Traditional IOS style regular expression	string is a regex",
  "neighbor-is": "BGP AS-path neighbor is	string containing an AS or range",
  "originates-from":
    "BGP AS-path originates-from	string containing an AS or range",
  "passes-through":
    "BGP AS-path passes-through	string containing an AS or range",
  length: "Length of BGP AS-path	One of eq/is/ge/le, and an integer",
  "unique-length":
    "Length of BGP AS-path ignoring duplicates	One of eq/is/ge/le, and an integer",
};

const ASPathSet = ({ activityId }) => {
  const { getJobParams, updateJobParam } = useContext(JobContext);

  const params = getJobParams(activityId);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState({ 1: true });
  const [entry, setEntry] = useState({ key: "remark", value: "" });

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };

  const handleAdd = (rowId, entries) => {
    let copy = [...entries];
    if (entry.value === "") {
      return;
    }

    copy.push({ ...entry });

    updateJobParam(activityId, rowId, "entries", copy);
    setEntry({ key: "remark", value: "" });
  };
  const handleRemove = (rowId, entries, index) => {
    let copy = [...entries];
    copy.splice(index, 1);
    updateJobParam(activityId, rowId, "entries", copy);
  };

  const toggleExpanded = (rowId) => {
    let copy = { ...expanded };
    copy[rowId] = !copy[rowId];
    setExpanded(copy);
  };

  const isValid = () => {
    let errors = {};
    let hostnames = {};
    params.forEach((row) => {
      let key = row.hostname.toLowerCase() + row.name.toLowerCase();
      if (hostnames[key]) {
        hostnames[key]++;
      } else {
        hostnames[key] = 1;
      }
    });
    params.forEach((row) => {
      if (!row.hostname) {
        errors[`hostname${row.rowId}`] = "Required";
      } else if (
        hostnames[row.hostname.toLowerCase() + row.name.toLowerCase()] > 1
      ) {
        errors[`hostname${row.rowId}`] = "Duplicate";
        errors[`name${row.rowId}`] = "Duplicate";
      }
      if (!row.name) {
        errors[`name${row.rowId}`] = "Required";
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <ContainerHeight>
        {params.map((activity) => {
          return (
            <Accordion
              key={activity.rowId}
              expanded={expanded[activity.rowId] || false}
              onChange={(e) => {
                // ignore event from child
                if (e.target.tagName !== "INPUT") {
                  toggleExpanded(activity.rowId);
                }
              }}
              summary={
                <Stack spacing={1} direction="row" key={activity.rowId}>
                  <TextField
                    label="Hostname"
                    name="hostname"
                    error={!!errors[`hostname${activity.rowId}`]}
                    helperText={errors[`hostname${activity.rowId}`]}
                    placeholder="Ex. ARGKCY93"
                    required
                    value={activity.hostname}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-hostname`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  />

                  <TextField
                    label="Name"
                    name="name"
                    required
                    error={!!errors[`name${activity.rowId}`]}
                    helperText={errors[`name${activity.rowId}`]}
                    placeholder="Bundle-Ether335.10"
                    value={activity.name}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-name`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>

                  <AddRemoveCopy
                    activityId={activityId}
                    rowId={activity.rowId}
                  />
                </Stack>
              }
              details={
                <div>
                  <Stack
                    marginLeft={"25px"}
                    direction={"row"}
                    alignContent={"top"}
                    marginTop={"15px"}
                    spacing={1}
                  >
                    <TextField
                      label="Key"
                      name="key"
                      size="small"
                      value={entry.key}
                      onChange={(e) =>
                        setEntry({ ...entry, key: e.target.value })
                      }
                      sx={{ width: "200px" }}
                      select
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-key`,
                      }}
                      variant="outlined"
                    >
                      {Object.keys(EntryKeyHelp).map((key) => {
                        return (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <TextField
                      label="Value"
                      name="value"
                      size="small"
                      onChange={(e) =>
                        setEntry({ ...entry, value: e.target.value })
                      }
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleAdd(activity.rowId, activity.entries);
                        }
                      }}
                      value={entry.value}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-value`,
                      }}
                      variant="outlined"
                    ></TextField>
                    <IconButton
                      variant="contained"
                      disabled={entry.key === "" || entry.value === ""}
                      size="small"
                      onClick={() =>
                        handleAdd(activity.rowId, activity.entries)
                      }
                    >
                      <AddIcon />
                    </IconButton>{" "}
                    <em style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                      <Typography paddingLeft={"5px"} paddingTop={"7px"}>
                        {EntryKeyHelp[entry.key]}
                      </Typography>
                    </em>
                  </Stack>

                  <Stack marginLeft={"25px"} marginTop={"15px"} spacing={1}>
                    {activity.entries.map((entry, index) => {
                      return (
                        <Stack direction={"row"} spacing={1}>
                          <IconButton
                            color="secondary"
                            aria-label="remove"
                            onClick={() =>
                              handleRemove(
                                activity.rowId,
                                activity.entries,
                                index
                              )
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                          <Typography paddingTop={"7px"} key={index}>
                            {entry.key || "empty"} : {entry.value || "empty"}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </div>
              }
            />
          );
        })}
      </ContainerHeight>
      <PrevNextStep isValid={isValid} />
    </div>
  );
};

export default ASPathSet;
