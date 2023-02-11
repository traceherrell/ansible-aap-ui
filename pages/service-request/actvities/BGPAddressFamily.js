import React, { useContext, useState } from "react";

import { MenuItem, Stack, TextField } from "@mui/material";
import { JobContext } from "../../../context/JobContext";
import AddRemoveCopy from "./AddRemoveCopy";
import AggAddresses from "./AggAddresses";
import PrevNextStep from "./PrevNextStep";
import { isValidASNumber } from "../../../hooks/useValidators";
import ContainerHeight from "../../../components/ContainerHeight";

const BGPAddressFamilyAdd = ({ activityId }) => {
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
      let key = row.hostname.toLowerCase();
      if (hostnames[key]) {
        hostnames[key]++;
      } else {
        hostnames[key] = 1;
      }
    });
    params.forEach((row) => {
      if (!row.hostname) {
        errors[`hostname${row.rowId}`] = "Required";
      } else if (hostnames[row.hostname.toLowerCase()] > 1) {
        errors[`hostname${row.rowId}`] = "Duplicate";
      }
      if (!row.safi) {
        errors[`safi${row.rowId}`] = "Required";
      }
      if (!row.as_number) {
        errors[`as_number${row.rowId}`] = "Required";
      } else if (!isValidASNumber(row.as_number)) {
        errors[`as_number${row.rowId}`] = "Invalid";
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
                label="VRF"
                name="vrf"
                error={!!errors[`vrf${activity.rowId}`]}
                helperText={errors[`vrf${activity.rowId}`]}
                placeholder="Ex. NMNET"
                value={activity.vrf}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-vrf`,
                }}
                sx={{ width: "150px" }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>
              <TextField
                label="AS Number"
                name="as_number"
                error={!!errors[`as_number${activity.rowId}`]}
                helperText={errors[`as_number${activity.rowId}`]}
                placeholder="Ex. 65000"
                required
                value={activity.as_number}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-as_number`,
                }}
                sx={{ width: "150px" }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>
              <TextField
                label="2nd Addr FI"
                name="safi"
                error={!!errors[`safi${activity.rowId}`]}
                helperText={errors[`safi${activity.rowId}`]}
                required
                value={activity.safi}
                select
                sx={{ width: "150px" }}
                inputProps={{ "data-testid": `${activity.rowId}-input-safi` }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              >
                <MenuItem value="unicast">unicast</MenuItem>
                <MenuItem value="multicast">multicast</MenuItem>
              </TextField>
              <AggAddresses
                aggregate_address={activity.aggregate_address}
                rowId={activity.rowId}
                activityId={activityId}
              />
              <AddRemoveCopy activityId={activityId} rowId={activity.rowId} />
            </Stack>
          );
        })}
      </ContainerHeight>
      <PrevNextStep isValid={isValid} />
    </div>
  );
};

export default BGPAddressFamilyAdd;
