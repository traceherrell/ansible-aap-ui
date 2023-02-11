import React, { useContext, useState } from "react";

import { Stack, TextField } from "@mui/material";
import { JobContext } from "../../../context/JobContext";
import AddRemoveCopy from "./AddRemoveCopy";
import PrevNextStep from "./PrevNextStep";
import { isValidRange, hasWhiteSpace } from "../../../hooks/useValidators";
import ContainerHeight from "../../../components/ContainerHeight";

const Vlan = ({ activityId }) => {
  const { getJobParams, updateJobParam } = useContext(JobContext);

  const params = getJobParams(activityId);

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };

  const [errors, setErrors] = useState({});

  const isValid = () => {
    let errors = {};
    let hostnames = {};
    params.forEach((row) => {
      let key = row.hostname.toLowerCase() + row.vlan_name;
      if (hostnames[key]) {
        hostnames[key]++;
      } else {
        hostnames[key] = 1;
      }
    });
    params.forEach((row) => {
      if (!row.hostname) {
        errors[`hostname${row.rowId}`] = "Required";
      } else if (hostnames[row.hostname.toLowerCase() + row.vlan_name] > 1) {
        errors[`hostname${row.rowId}`] = "Duplicate";
        errors[`vlan_name${row.rowId}`] = "Duplicate";
      }
      if (!row.vlan_id) {
        errors[`vlan_id${row.rowId}`] = "Required";
      } else if (!isValidRange(row.vlan_id)) {
        errors[`vlan_id${row.rowId}`] = "0-11,22,30-40";
      }
      if (!row.vlan_name) {
        errors[`vlan_name${row.rowId}`] = "Required";
      } else if (hasWhiteSpace(row.vlan_name)) {
        errors[`vlan_name${row.rowId}`] = "No spaces";
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
            <Stack
              marginTop={"15px"}
              spacing={1}
              direction="row"
              key={activity.rowId}
            >
              <TextField
                label="Hostname"
                name="hostname"
                error={!!errors[`hostname${activity.rowId}`]}
                helperText={errors[`hostname${activity.rowId}`]}
                placeholder="Ex. AREPOL01"
                required
                value={activity.hostname}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-hostname`,
                }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              />

              <TextField
                label="Vlan ID"
                name="vlan_id"
                error={!!errors[`vlan_id${activity.rowId}`]}
                helperText={errors[`vlan_id${activity.rowId}`]}
                placeholder="Ex. 0-11,22,30-40"
                required
                value={activity.vlan_id}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-vlan_id`,
                }}
                sx={{ width: "150px" }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>

              <TextField
                label="Vlan Name"
                name="vlan_name"
                error={!!errors[`vlan_name${activity.rowId}`]}
                helperText={errors[`vlan_name${activity.rowId}`]}
                required
                value={activity.vlan_name}
                sx={{ width: "150px" }}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-vlan_name`,
                }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>

              <AddRemoveCopy activityId={activityId} rowId={activity.rowId} />
            </Stack>
          );
        })}
      </ContainerHeight>
      <PrevNextStep isValid={isValid} />
    </div>
  );
};

export default Vlan;
