import { Fragment } from "react";

import { Grid, Typography } from "@mui/material";
import StatusIcon from "./StatusIcon";

const JobHistory = ({ jobStatus }) => {
  return (
    <Fragment>
      <Grid container justifyContent="left">
        <Grid item>
          <StatusIcon status={jobStatus.validationStatus} />
        </Grid>
        <Grid marginLeft="10px" item align={"left"}>
          <Typography marginBottom={"-7px"} variant="subtitle1">
            Request Validation
          </Typography>
        </Grid>
      </Grid>
      <Grid marginTop="20px" container justifyContent="left">
        <Grid item>
          <StatusIcon status={jobStatus?.techReviewStatus} />
        </Grid>
        <Grid marginLeft="10px" item align={"left"}>
          <Typography marginBottom={"-7px"} variant="subtitle1">
            Tech Review
          </Typography>
        </Grid>
      </Grid>
      <Grid marginTop="20px" container justifyContent="left">
        <Grid item>
          <StatusIcon status={jobStatus?.createChangeRecordStatus} />
        </Grid>
        <Grid marginLeft="10px" item align={"left"}>
          <Typography marginBottom={"-7px"} variant="subtitle1">
            Create CR
          </Typography>
        </Grid>
      </Grid>
      <Grid marginTop="10px" container justifyContent="left">
        <Grid item>
          <StatusIcon status={jobStatus?.createInventoryStatus} />
        </Grid>
        <Grid marginLeft="10px" item align={"left"}>
          <Typography marginBottom={"-7px"} variant="subtitle1">
            Inventory Creation
          </Typography>
        </Grid>
      </Grid>

      <Grid marginTop="10px" container justifyContent="left">
        <Grid item>
          <StatusIcon status={jobStatus?.implementationStatus} />
        </Grid>
        <Grid marginLeft="10px" item align={"left"}>
          <Typography marginBottom={"-7px"} variant="subtitle1">
            CR Implementation
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default JobHistory;
