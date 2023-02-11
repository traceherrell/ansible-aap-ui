import React, { useContext, useState } from "react";

import { Stack, TextField, MenuItem } from "@mui/material";
import AddRemoveCopy from "./AddRemoveCopy";
import { JobContext } from "../../../context/JobContext";
import ImportExport from "./ImportExport";
import PrevNextStep from "./PrevNextStep";
import {
  isValidInterfaceName,
  isValidIpAddressWithMask,
} from "../../../hooks/useValidators";
import ContainerHeight from "../../../components/ContainerHeight";

const CableTesting = ({ activityId }) => {
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
      let key = row.hostname.toLowerCase() + row.interface.toLowerCase();
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
        hostnames[row.hostname.toLowerCase() + row.interface.toLowerCase()] > 1
      ) {
        errors[`hostname${row.rowId}`] = "Duplicate";
      }
      if (!row.interface) {
        errors[`interface${row.rowId}`] = "Required";
      } else if (!isValidInterfaceName(row.interface)) {
        errors[`interface${row.rowId}`] = "Ex. Ethernet3/1";
      } else if (
        hostnames[row.hostname.toLowerCase() + row.interface.toLowerCase()] > 1
      ) {
        errors[`interface${row.rowId}`] = "Duplicate";
      }
      if (!row.ip) {
        errors[`ip${row.rowId}`] = "Required";
      } else if (!isValidIpAddressWithMask(row.ip)) {
        errors[`ip${row.rowId}`] = "Ex. 192.168.1.1/31";
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
                label="Network Device"
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
                label="Interface Name"
                name="interface"
                error={!!errors[`interface${activity.rowId}`]}
                helperText={errors[`interface${activity.rowId}`]}
                placeholder="Ex. Ethernet1/20"
                required
                value={activity.interface}
                inputProps={{
                  "data-testid": `${activity.rowId}-input-interface`,
                }}
                sx={{ width: "250px" }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>
              <TextField
                label="IP Address"
                name="ip"
                error={!!errors[`ip${activity.rowId}`]}
                helperText={errors[`ip${activity.rowId}`]}
                placeholder="Ex. 192.168.1.1/31"
                required
                value={activity.ip}
                inputProps={{ "data-testid": `${activity.rowId}-input-ip` }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              ></TextField>
              <TextField
                label="Speed"
                name="speed"
                error={!!errors[`speed${activity.rowId}`]}
                helperText={errors[`speed${activity.rowId}`]}
                value={activity.speed}
                select
                sx={{ width: "100px" }}
                inputProps={{ "data-testid": `${activity.rowId}-input-speed` }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="auto">auto</MenuItem>
                <MenuItem value="10">10 (10Mb/s)</MenuItem>
                <MenuItem value="100">100 (100Mb/s)</MenuItem>
                <MenuItem value="1000">1000 (1Gb/s)</MenuItem>
                <MenuItem value="10000">10000 (10Gb/s)</MenuItem>
                <MenuItem value="25000">25000 (25Gb/s)</MenuItem>
                <MenuItem value="40000">40000 (40Gb/s)</MenuItem>
                <MenuItem value="100000">100000 (100Gb/s)</MenuItem>
              </TextField>
              <TextField
                label="Duplex"
                name="duplex"
                error={!!errors[`duplex${activity.rowId}`]}
                helperText={errors[`duplex${activity.rowId}`]}
                value={activity.duplex}
                select
                sx={{ width: "100px" }}
                inputProps={{ "data-testid": `${activity.rowId}-input-duplex` }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="auto">auto</MenuItem>
                <MenuItem value="full">full</MenuItem>
              </TextField>
              <TextField
                label="MTU"
                name="mtu"
                error={!!errors[`mtu${activity.rowId}`]}
                helperText={errors[`mtu${activity.rowId}`]}
                value={activity.mtu}
                select
                sx={{ width: "100px" }}
                inputProps={{ "data-testid": `${activity.rowId}-input-mtu` }}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="1500">1500</MenuItem>
                <MenuItem value="9216">9216</MenuItem>
              </TextField>

              <AddRemoveCopy activityId={activityId} rowId={activity.rowId} />
            </Stack>
          );
        })}
      </ContainerHeight>
      <PrevNextStep activityId={activityId} isValid={isValid}>
        <ImportExport activityId={activityId} />
      </PrevNextStep>
    </div>
  );
};

export default CableTesting;
