import { useContext, useState } from "react";

import { Stack, TextField, MenuItem } from "@mui/material";
import AddRemoveCopy from "./AddRemoveCopy";
import { JobContext } from "../../../context/JobContext";
import PrevNextStep from "./PrevNextStep";
import ImportExport from "./ImportExport";
import ContainerHeight from "../../../components/ContainerHeight";

import {
  isValidRange,
  isValidInterfaceName,
  isValidVlanId,
} from "../../../hooks/useValidators";

const PortTurnUp = ({ activityId }) => {
  const [errors, setErrors] = useState({});

  const { getJobParams, updateJobParam, updateJobParams } =
    useContext(JobContext);
  const params = getJobParams(activityId);

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };
  const handleTypeChange = (rowId, event) => {
    const { name, value } = event.target;
    if (value === "access") {
      updateJobParams(activityId, rowId, [
        { name: "native", value: "" },
        { name: name, value: value },
      ]);
    } else {
      updateJobParam(activityId, rowId, name, value);
    }
  };
  const isValid = () => {
    return checkErrors();
  };

  const checkErrors = () => {
    const errors = {};
    // create a hash count of the interface names
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
      if (!row.aSideHostname) {
        errors[`aSideHostname${row.rowId}`] = "Required";
      }
      if (!row.aSidePort) {
        errors[`aSidePort${row.rowId}`] = "Required";
      }
      if (!row.aSideSlot) {
        errors[`aSideSlot${row.rowId}`] = "Required";
      }
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

      if (!row.type) {
        errors[`type${row.rowId}`] = "Required";
      } else {
        if (row.vlan === "") {
          errors[`vlan${row.rowId}`] = "Required";
        } else if (row.type === "trunk") {
          // vlan accepts ranges or numbers;
          if (!isValidRange(row.vlan)) {
            errors[`vlan${row.rowId}`] = "Invalid Vlan ID or Vlan Range";
          }
          if (!isValidVlanId(row.native)) {
            errors[`native${row.rowId}`] = "Invalid Vlan ID";
          }
        } else {
          if (!isValidVlanId(row.vlan)) {
            errors[`vlan${row.rowId}`] = "Invalid Vlan ID";
          }
        }
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <ContainerHeight>
        {params.map((activity, i) => {
          return (
            <Stack key={i} direction="row" paddingTop="15px" spacing={3}>
              <Stack spacing={1} direction="row">
                <TextField
                  label="Network Device"
                  error={!!errors[`hostname${activity.rowId}`]}
                  helperText={errors[`hostname${activity.rowId}`]}
                  name="hostname"
                  placeholder="Ex. AREPOLV7"
                  required
                  value={activity.hostname || ""}
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
                  placeholder="Ex. Ethernet1/94"
                  required
                  value={activity.interface}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-interface`,
                  }}
                  sx={{ width: "250px" }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                ></TextField>
              </Stack>
              <Stack spacing={1} direction="row">
                <TextField
                  label="Server Hostname"
                  error={!!errors[`aSideHostname${activity.rowId}`]}
                  helperText={errors[`aSideHostname${activity.rowId}`]}
                  name="aSideHostname"
                  placeholder="Ex. PXESXPCF1371101"
                  required
                  value={activity.aSideHostname || ""}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-aSideHostname`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                />

                <TextField
                  label="Server Slot"
                  name="aSideSlot"
                  error={!!errors[`aSideSlot${activity.rowId}`]}
                  helperText={errors[`aSideSlot${activity.rowId}`]}
                  placeholder="Ex. ONBOARD"
                  required
                  value={activity.aSideSlot || ""}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-aSideSlot`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                />
                <TextField
                  label="Server Port"
                  name="aSidePort"
                  error={!!errors[`aSidePort${activity.rowId}`]}
                  helperText={errors[`aSidePort${activity.rowId}`]}
                  placeholder="Ex. ILO"
                  required
                  value={activity.aSidePort || ""}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-aSidePort`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={1} direction="row">
                <TextField
                  label="Speed"
                  name="speed"
                  error={!!errors[`speed${activity.rowId}`]}
                  helperText={errors[`speed${activity.rowId}`]}
                  value={activity.speed}
                  select
                  sx={{ width: "100px" }}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-speed`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
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
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-duplex`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="auto">auto</MenuItem>
                  <MenuItem value="full">full</MenuItem>
                </TextField>
                <TextField
                  label="MTU"
                  name="mtu"
                  error={!!errors[`mtu${activity.rowId}`]}
                  helperText={errors[`mtu${activity.rowId}`]}
                  value={activity.mtu || ""}
                  select
                  sx={{ width: "100px" }}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-mtu`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="1500">1500</MenuItem>
                  <MenuItem value="9216">9216</MenuItem>
                </TextField>
                <TextField
                  label="Mode"
                  name="type"
                  error={!!errors[`type${activity.rowId}`]}
                  helperText={errors[`type${activity.rowId}`]}
                  required
                  value={activity.type || ""}
                  select
                  sx={{ width: "100px" }}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-type`,
                  }}
                  onChange={(e) => handleTypeChange(activity.rowId, e)}
                  variant="outlined"
                >
                  <MenuItem value="access">access</MenuItem>
                  <MenuItem value="trunk">trunk</MenuItem>
                </TextField>
                <TextField
                  label={activity.type === "access" ? "Vlan" : "Vlan(s)"}
                  name="vlan"
                  error={!!errors[`vlan${activity.rowId}`]}
                  helperText={errors[`vlan${activity.rowId}`]}
                  placeholder={
                    activity.type === "access" ? "Ex. 2" : "Ex: 2-5,17,25-49"
                  }
                  value={activity.vlan}
                  disabled={activity.type === "" ? true : false}
                  sx={{ width: "150px" }}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-vlan`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                />
                <TextField
                  label="Native Vlan"
                  name="native"
                  error={!!errors[`native${activity.rowId}`]}
                  helperText={errors[`native${activity.rowId}`]}
                  placeholder={"Ex: 17"}
                  value={activity.native || ""}
                  disabled={
                    activity.type === "" || activity.type === "access"
                      ? true
                      : false
                  }
                  sx={{ width: "100px" }}
                  inputProps={{
                    "data-testid": `${activity.rowId}-input-native`,
                  }}
                  onChange={(e) => handleInputChange(activity.rowId, e)}
                  variant="outlined"
                />
              </Stack>

              <AddRemoveCopy rowId={activity.rowId} activityId={activityId} />
            </Stack>
          );
        })}
      </ContainerHeight>
      <PrevNextStep isValid={isValid}>
        <ImportExport activityId={activityId} />
      </PrevNextStep>
    </div>
  );
};

export default PortTurnUp;
