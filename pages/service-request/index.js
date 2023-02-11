import { Link as RouterLink } from "next/link";

import { Grid, Container, Typography, Link } from "@mui/material";

import PageHeader from "../../components/PageHeader";
import ActivitySelector from "./ActivitySelector";
import JobList from "./JobList";

const ServiceRequests = () => {
  return (
    <Container maxWidth={false}>
      <PageHeader title="Build a Service Request" divider />
      <Typography component="div">
        {" "}
        Add one or more service activities to your request.
      </Typography>
      <Grid marginTop="10px" container spacing={2}>
        <Grid item xs={12} md={3}>
          <ActivitySelector />
        </Grid>
        <Grid item xs={0} md={1}></Grid>
        <Grid item xs={12} md={7}>
          <JobList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceRequests;
