import { useContext, useEffect, useState } from "react";

import {
  Container,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PageHeader from "../../components/PageHeader";
import { NotificationContext } from "../../context/NotificationContext";

import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const ASC = 1;
const DESC = -1;

const ServiceActivityStatus = () => {
  const [activities, setActivities] = useState([]);
  const { get, post } = useFetchWithAuth();

  const { addNotification } = useContext(NotificationContext);
  const [sortedBy, setSortedBy] = useState({
    isActive: DESC,
    name: ASC,
    categoryName: ASC,
    serviceName: ASC,
    id: ASC,
  });

  const handleActivityStatusChange = (event, id) => {
    const activity = activities.find((activity) => activity.id === id);
    const newActivity = { ...activity, isActive: event.target.checked };
    setActivities(
      activities.map((activity) =>
        activity.id === id ? newActivity : activity
      )
    );

    post("/serviceactivity", newActivity).then((response) => {
      if (response.ok) {
        addNotification({
          severity: "success",
          message: "Saved Status",
        });
      } else {
        addNotification({
          severity: "error",
          message: "Error updating status",
        });
      }
    });
  };

  useEffect(() => {
    get("/serviceactivity").then((res) => {
      res.json().then((data) => {
        sortActivities(data, "isActive", DESC);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sort activities by name of column
  const sortActivities = (activities, column, direction) => {
    const sorted = activities.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1 * direction;
      }
      if (a[column] > b[column]) {
        return direction;
      }
      return 0;
    });
    setActivities(sorted);
  };
  const handleSort = (column) => {
    if (sortedBy[column] === ASC) {
      sortActivities(activities, column, DESC);
      setSortedBy({ ...sortedBy, [column]: DESC });
    } else {
      sortActivities(activities, column, ASC);
      setSortedBy({ ...sortedBy, [column]: ASC });
    }
  };

  return (
    <Container maxWidth={false}>
      <PageHeader title="Service Activity Status" divider />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="activities table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => handleSort("id")}
              >
                ID
              </TableCell>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => handleSort("name")}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => handleSort("categoryName")}
              >
                Category
              </TableCell>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => handleSort("serviceName")}
              >
                Service
              </TableCell>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => handleSort("isActive")}
              >
                Active
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.serviceName}</TableCell>
                <TableCell>
                  <Switch
                    onChange={(e) => handleActivityStatusChange(e, row.id)}
                    checked={!!row.isActive}
                    color="secondary"
                  ></Switch>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ServiceActivityStatus;
