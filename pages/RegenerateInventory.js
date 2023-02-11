import { useState, useContext } from "react";

import {
  Container,
  Stack,
  Grid,
  Button,
  Typography,
  TextField,
} from "@mui/material";

import PageHeader from "../components/PageHeader";
import { NotificationContext } from "../context/NotificationContext";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";

const RegenerateInventory = () => {
  const { addNotification } = useContext(NotificationContext);
  const { post } = useFetchWithAuth();
  const [crId, setCrId] = useState("");
  const handleInputChange = (event) => {
    const { value } = event.target;
    setCrId(value);
  };
  const handleClick = async () => {
    const response = await post(`/recreateinventory/${crId}`);
    if (response.ok) {
      addNotification({
        severity: "success",
        message: "Inventory regenerated successfully",
      });
    } else if (response.status === 404) {
      addNotification({
        severity: "error",
        message: "CR Number not found.",
      });
    } else {
      addNotification({
        severity: "error",
        message: "Error regenerating inventory.",
      });
    }
  };

  return (
    <Container maxWidth={false}>
      <PageHeader title="Regenerate Inventory" divider />
      <Typography component="div">
        {" "}
        Input the change record id to regenerate ansible inventory.
      </Typography>
      <Grid marginTop="10px" container spacing={2}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <TextField
              placeholder="CR123456789"
              name="crId"
              label="CR Number"
              required
              value={crId}
              inputProps={{ "data-testid": `input-crId` }}
              onChange={handleInputChange}
            />
            <Button
              disabled={!crId}
              onClick={handleClick}
              variant="contained"
              color="primary"
              data-testid="button-regenerate"
              sx={{ marginLeft: "1rem", marginTop: "1rem" }}
            >
              Regenerate Inventory
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={0} md={1}></Grid>
      </Grid>
    </Container>
  );
};

export default RegenerateInventory;
