import { useState, useEffect, useCallback } from "react";

import { Container, Box, Grid } from "@mui/material";

import PageHeader from "../../components/PageHeader";
import PermissionsTable from "./PermissionsTable";
import RequestPermissions from "./RequestPermissions";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const UserProfile = () => {
  const { get } = useFetchWithAuth();

  const [user, setUser] = useState({
    fisrtName: "",
    lastName: "",
    email: "",
    teamName: "",
    ntid: "",
    managerNtid: "",
    groups: [],
  });

  const handleGetUserProfile = useCallback(async () => {
    const response = await get("/userprofile");

    if (response.ok) {
      const data = await response.json();
      setUser({
        ntid: data.ntid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        teamName: data.teamName,
        groups: data.groups,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  return (
    <Container maxWidth={false}>
      <PageHeader title="User Profile - Permissions" divider />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Box m={2}>
            <PermissionsTable groups={user.groups} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box m={2}>
            <RequestPermissions />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
