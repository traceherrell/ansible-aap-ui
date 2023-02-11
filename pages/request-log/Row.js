import { Fragment, useContext } from "react";

import {
  Collapse,
  Grid,
  TableCell,
  Typography,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { format, parseISO } from "date-fns";

import { JobContext } from "../../context/JobContext";
import { activities } from "../service-request/activities";
import StatusIcon from "./StatusIcon";
import useInterval from "../../hooks/useInterval";
import JobHistory from "./JobHistory";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const { REACT_APP_AAC_URL } = process.env;

const parseServiceActivities = (row) => {
  const input = JSON.parse(row.serviceRequestInput);
  if (input.serviceActivities) {
    const serviceActivities = input.serviceActivities.map((item) => {
      return activities[item.id] ? activities[item.id].activity : "";
    });
    return serviceActivities;
  }
  return [];
};

const Row = ({ row, selectedRow, setSelectedRow, updateSeviceRequestData }) => {
  const { globalInfo, resubmitJobs } = useContext(JobContext);
  const { get } = useFetchWithAuth();

  //const navigate = useNavigate();

  const open = selectedRow != null && selectedRow.id === row.id;

  const errors = selectedRow?.validationErrors || [];

  row.techReviewId = row.serviceActivityRecords[0]?.jobId || "Not Started";
  row.techReviewStatus = row.serviceActivityRecords[0]?.jobStatus;

  useInterval(() => {
    if (
      open &&
      row.requestStatus !== "FAIL" &&
      row.requestStatus !== "SUCCESS"
    ) {
      getActivityLogs();
    }
  }, 3000);

  const getActivityLogs = async () => {
    const response = await get(`/servicerequest/${selectedRow.id}`);
    if (response.ok) {
      const data = await response.json();
      updateSeviceRequestData(data);
      setSelectedRow(data);
    } else {
      console.error(
        `Error loading activity log details   ${selectedRow.id}`,
        response
      );
    }
  };

  const handleClick = (row) => {
    if (open) {
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
    }
  };

  const handleRunJob = (row) => {
    const request = JSON.parse(row.serviceRequestInput);
    resubmitJobs(request.serviceActivities);

    if (row.requestStatus !== "SUCCESS") {
      globalInfo.intakeNum = request.intakeNum;
      globalInfo.justification = request.justification;
      globalInfo.notes = request.notes;
    }
    //navigate to start
    // navigate("/service-request/step/1");
  };

  return (
    <Fragment>
      <TableRow selected={open} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            data-testid={`expand-row-button-${row.id}`}
            onClick={() => handleClick(row)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {format(parseISO(row.creationDate), "MM-dd-yyyy hh:mm a")}
        </TableCell>
        <TableCell>
          <Button
            color="secondary"
            variant="text"
            onClick={() =>
              window.open(
                `${REACT_APP_AAC_URL}/#/jobs/workflow/${row.techReviewId}/output`
              )
            }
          >
            {row.techReviewId}
          </Button>
        </TableCell>
        <TableCell>
          <Button
            color="secondary"
            variant="text"
            onClick={() =>
              window.open(
                `${REACT_APP_AAC_URL}/#/jobs/workflow/${row.implementationJobID}/output`
              )
            }
          >
            {row.implementationJobID || "Not Started"}
          </Button>
        </TableCell>
        <TableCell>
          <Button color="secondary" variant="text">
            {row.changeRecordId || "Not Started"}
          </Button>
        </TableCell>
        <TableCell>{row.ntid}</TableCell>

        <TableCell>
          <StatusIcon status={row.requestStatus} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid
              container
              marginBottom={"20px"}
              paddingTop={"20px"}
              paddingLeft={"50px"}
              spacing={5}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography>Service Activities:</Typography>
                {parseServiceActivities(row).map((item) => {
                  return (
                    <Typography variant="subtitle" key={item}>
                      {`${item}, `}
                    </Typography>
                  );
                })}
              </Grid>
              <Grid item>
                <Typography>Errors:</Typography>
                {errors.map((error, i) => (
                  <Typography
                    key={i}
                    component="div"
                    fontSize="11px"
                    color="error"
                    variant="subtitle"
                  >
                    {error.errorMessage}
                  </Typography>
                ))}
              </Grid>

              <Grid item marginLeft="10px">
                {selectedRow != null && <JobHistory jobStatus={selectedRow} />}
                <Button
                  sx={{ marginTop: "10px" }}
                  onClick={() => handleRunJob(row)}
                  variant="contained"
                >
                  RE SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default Row;
