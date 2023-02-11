import { useContext, useState } from "react";

import { Stack, TextField } from "@mui/material";
import AddRemoveCopy from "./AddRemoveCopy";
import { JobContext } from "../../../context/JobContext";
import PrevNextStep from "./PrevNextStep";
import ImportExport from "./ImportExport";
import ContainerHeight from "../../../components/ContainerHeight";

const RouteMapDelete = ({ activityId }) => {
  const [errors, setErrors] = useState({});
  const { getJobParams, updateJobParam } = useContext(JobContext);
  const params = getJobParams(activityId);

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };
  const isValid = () => {
    let errors = {};
    // create a hash count of the interface names
    let hostnames = {};
    params.forEach((row) => {
      let key = row.hostname.toLowerCase() + row.route_map.toLowerCase();
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
        hostnames[row.hostname.toLowerCase() + row.route_map.toLowerCase()] > 1
      ) {
        errors[`hostname${row.rowId}`] = "Duplicate";
      }
      if (!row.route_map) {
        errors[`route_map${row.rowId}`] = "Required";
      } else if (
        hostnames[row.hostname.toLowerCase() + row.route_map.toLowerCase()] > 1
      ) {
        errors[`route_map${row.rowId}`] = "Duplicate";
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
                placeholder="AREPOL01"
                error={!!errors[`hostname${activity.rowId}`]}
                helperText={errors[`hostname${activity.rowId}`]}
                required
                inputProps={{
                  "data-testid": `${activity.rowId}-input-hostname`,
                }}
                value={activity.hostname}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              />

              <TextField
                label="Route Map Name"
                name="route_map"
                error={!!errors[`route_map${activity.rowId}`]}
                helperText={errors[`route_map${activity.rowId}`]}
                placeholder="RM-AREPOL01-TO-AREPOL02"
                required
                value={activity.route_map}
                onChange={(e) => handleInputChange(activity.rowId, e)}
                variant="outlined"
              />
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

export default RouteMapDelete;
