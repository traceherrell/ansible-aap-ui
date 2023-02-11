import { useState, useContext, useEffect } from "react";

import { MenuItem, Stack, Button, TextField } from "@mui/material";

import { getActivities, getCategories, getServices } from "./activities";

import { JobContext } from "../../context/JobContext";

const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

const ActivitySelector = () => {
  const [activityId, setActivityId] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [services, setServices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories] = useState(getCategories());
  const { addJob } = useContext(JobContext);
  const [activeActivities, setActiveActivities] = useState([]);

  const isDisabled = () => {
    return !activityId || !service || !category || !isDirty;
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setServices(getServices(event.target.value));
    setIsDirty(true);
    setService("");
    setActivities([]);
    setActivityId("");
  };

  const handleServiceChange = (event) => {
    setService(event.target.value);
    const activities = getActivities(category, event.target.value);
    // filter for active activities

    const active = activities.filter((activity) =>
      activeActivities.includes(activity.id)
    );
    // if dev, add all activities
    if (isDev) setActivities(activities);
    else setActivities(active);
    setActivityId("");
    setIsDirty(true);
  };
  const handleActivityChange = (event) => {
    setActivityId(event.target.value);
    setIsDirty(true);
  };

  const handleAddJob = () => {
    addJob(activityId);
    setActivityId("");
    setIsDirty(false);
  };

  return (
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
        value={activityId}
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
      <Button
        data-testid="button-add-job"
        disabled={isDisabled()}
        onClick={handleAddJob}
        variant="contained"
      >
        ADD TO REQUEST
      </Button>
    </Stack>
  );
};

export default ActivitySelector;
