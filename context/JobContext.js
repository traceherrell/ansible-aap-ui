import { useState, createContext } from "react";

import { cloneDeep } from "lodash";

import { activities } from "../pages/service-request/activities";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";

const JobContext = createContext({
  jobList: [],
  globalInfo: {},
  updateGlobalInfo: () => {},
  removeJob: () => {},
  moveJob: () => {},
  addJob: () => {},
  addJobs: () => {},
  resubmitJobs: () => {},
  clearAllJobs: () => {},
  getJobParams: () => {},
  updateJobParam: () => {},
  updateJobParams: () => {},
  updateNestedJobParam: () => {},
  copyJobParamsRow: () => {},
  removeJobParamsRow: () => {},
  addJobParamsRow: () => {},
  addParams: () => {},
  submitJobs: () => {},
});
const JobProvider = ({ children }) => {
  const [jobList, setJobList] = useState([]);
  const [globalInfo, setGlobalInfo] = useState({
    intakeNum: "",
    justification: "",
    notes: "",
    managerNtid: "",
  });
  const { post } = useFetchWithAuth();

  const addJob = (activityId, params) => {
    if (jobList.find((job) => job.id === activityId)) return;
    const newJob = cloneDeep(activities[activityId]);
    if (params) {
      newJob.params = params;
    }
    const copy = cloneDeep(jobList);
    copy.push(newJob);
    setJobList(copy);
  };
  const addJobs = (activityIds) => {
    const copy = cloneDeep(jobList);
    activityIds.forEach((activityId) => {
      const newJob = cloneDeep(activities[activityId]);
      //if job already exists, don't add it again
      if (!copy.find((job) => job.id === newJob.id)) {
        copy.push(newJob);
      }
    });

    setJobList(copy);
  };
  const resubmitJobs = (serviceActivities) => {
    const copy = cloneDeep(jobList);
    serviceActivities.forEach((sa) => {
      const newJob = cloneDeep(activities[sa.id]);
      //if job already exists, don't add it again
      if (!copy.find((job) => job.id === newJob.id)) {
        newJob.params = sa.params;
        copy.push(newJob);
      }
    });

    setJobList(copy);
  };
  const getJobParams = (id) => {
    const job = jobList.find((job) => job.id === id);
    return job ? job.params : [];
  };
  const addJobParamsRow = (id) => {
    const copy = cloneDeep(jobList);
    const newRow = cloneDeep(activities[id].params[0]);
    const job = copy.find((job) => job.id === id);

    // get max rowId
    const maxRowId = Math.max(...job.params.map((item) => item.rowId));
    newRow.rowId = maxRowId + 1;

    console.log(newRow);
    job.params.push(newRow);
    // add new row to state
    setJobList(copy);
  };

  // used primarily for adding params from a csv file
  const addParams = (id, params) => {
    let copy = cloneDeep(jobList);
    let job = copy.find((job) => job.id === id);
    let maxRowId = Math.max(...job.params.map((item) => item.rowId));

    params.forEach((row) => {
      maxRowId++;
      row.rowId = maxRowId;
    });
    // check to see if any params already exist for this job
    // if so, add new params to existing params
    if (job.params.length === 1 && job.params[0].hostname === "") {
      job.params = params;
    } else {
      job.params = job.params.concat(params);
    }

    setJobList(copy);
  };
  const updateGlobalInfo = (key, value) => {
    const copy = cloneDeep(globalInfo);
    copy[key] = value;
    setGlobalInfo(copy);
  };

  const copyJobParamsRow = (id, rowId) => {
    let copy = cloneDeep(jobList);
    // find row to copy
    const job = copy.find((job) => job.id === id);
    const row = job.params.find((r) => r.rowId === rowId);
    // copy row
    const newRow = cloneDeep(row);
    // get max rowId
    const maxRowId = Math.max(...job.params.map((item) => item.rowId));
    newRow.rowId = maxRowId + 1;
    // add new row to state
    job.params.push(newRow);
    setJobList(copy);
  };
  const removeJobParamsRow = (id, rowId) => {
    let copy = cloneDeep(jobList);
    const job = copy.find((job) => job.id === id);
    job.params = job.params.filter((item) => item.rowId !== rowId);
    setJobList(copy);
  };

  const updateJobParam = (id, rowId, name, value) => {
    let copy = cloneDeep(jobList);
    const job = copy.find((job) => job.id === id);
    const row = job.params.find((r) => r.rowId === rowId);

    row[name] = value;
    console.log(row);

    setJobList(copy);
  };

  const updateJobParams = (id, rowId, params) => {
    let copy = cloneDeep(jobList);
    const job = copy.find((job) => job.id === id);
    const row = job.params.find((r) => r.rowId === rowId);
    params.forEach(({ name, value }) => {
      console.log(name, value);
      row[name] = value;
    });
    setJobList(copy);
  };

  const updateNestedJobParam = (id, rowId, property, index, name, value) => {
    let copy = cloneDeep(jobList);
    const job = copy.find((job) => job.id === id);
    console.log(id);
    console.log(job);
    const row = job.params.find((r) => r.rowId === rowId);
    // find property
    const prop = row[property];
    // find index
    const item = prop[index];
    // update value
    item[name] = value;

    setJobList(copy);
  };

  const removeJob = (id) => {
    setJobList((prev) => prev.filter((item) => item.id !== id));
  };
  const moveJob = (id, direction) => {
    const index = jobList.findIndex((item) => item.id === id);
    const newList = [...jobList];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    setJobList(newList);
  };
  const clearAllJobs = async () => {
    await setJobList([]);
    await setGlobalInfo({ intakeNum: "", justification: "", notes: "" });
  };

  const submitJobs = async () => {
    let jobRequest = { ...globalInfo };
    jobRequest.serviceActivities = jobList;
    return post("/servicerequest", jobRequest);
  };

  return (
    <JobContext.Provider
      value={{
        jobList,
        globalInfo,
        updateGlobalInfo,
        addJob,
        addJobs,
        resubmitJobs,
        removeJob,
        moveJob,
        clearAllJobs,
        updateJobParam,
        updateJobParams,
        updateNestedJobParam,
        addParams,
        getJobParams,
        copyJobParamsRow,
        removeJobParamsRow,
        addJobParamsRow,
        submitJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export { JobContext, JobProvider };
