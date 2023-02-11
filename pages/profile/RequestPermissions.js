import { useState } from "react";

import { MenuItem, Stack, Button, TextField } from "@mui/material";

import {
  getActivities,
  getCategories,
  getServices,
} from "../service-request/activities";

const RequestPermissions = () => {
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");

  const [services, setServices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories] = useState(getCategories());

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setServices(getServices(event.target.value));

    setService("");
    setActivities([]);
    setActivity("");
  };

  const handleServiceChange = (event) => {
    setService(event.target.value);
    setActivities(getActivities(category, event.target.value));
    setActivity("");
  };
  const handleActivityChange = (event) => {
    setActivity(event.target.value);
  };

  const handleRequestPermission = () => {};

  return (
    <div>
      <Stack spacing={2}>
        <TextField
          label="Category"
          select
          inputProps={{ "data-testid": "select-category" }}
          value={category}
          onChange={handleCategoryChange}
          style={{ width: "100%" }}
        >
          {categories.map((key) => {
            return (
              <MenuItem
                data-testid={`select-option-${key}`}
                key={key}
                value={key}
              >
                {key}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField
          select
          label="Service"
          inputProps={{ "data-testid": "select-service" }}
          value={service}
          onChange={handleServiceChange}
          style={{ width: "100%" }}
        >
          {services.map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Activity"
          value={activity}
          onChange={handleActivityChange}
          inputProps={{ "data-testid": "select-activity" }}
          style={{ width: "100%" }}
        >
          {activities.map((activity, i) => (
            <MenuItem key={i} value={activity.id}>
              {activity.activity}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          inputProps={{ "data-testid": "input-securityGroup" }}
          name="securityGroup"
          label="Security Group"
          value={activity}
          variant="outlined"
          disabled={true}
          style={{ width: "100%" }}
        >
          {activities.map((activity, i) => (
            <MenuItem key={i} value={activity.id}>
              {activity.activity}
            </MenuItem>
          ))}
        </TextField>
        <Button
          data-testid="button-request-permission"
          onClick={handleRequestPermission}
          variant="contained"
        >
          {" "}
          Request Access
        </Button>
      </Stack>
    </div>
  );
};

export default RequestPermissions;
