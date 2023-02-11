import { useEffect, useState } from "react";

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TablePagination,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import PageHeader from "../../components/PageHeader";
import Row from "./Row";

import useInterval from "../../hooks/useInterval";

const RequestLog = ({ fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [activityRows, setActivityRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [onlyMine, setOnlyMine] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData(page, rowsPerPage, onlyMine).then((data) => {
      setActivityRows(data.srrList || []);
      setTotalRows(data.totalSize || 0);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, onlyMine]);

  useInterval(() => {
    if (autoRefresh) {
      setLoading(true);
      fetchData(page, rowsPerPage, onlyMine).then((data) => {
        setActivityRows(data.srrList);
        setTotalRows(data.totalSize);
        setLoading(false);
      });
    }
  }, 15011);

  const handleAutoRefresh = (event) => {
    setAutoRefresh(event.target.checked);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const updateSeviceRequestData = (activityLog) => {
    // find the activity log in the activityRows array and update the data
    const index = activityRows.findIndex((row) => row.id === activityLog.id);
    if (index !== -1) {
      activityRows[index] = activityLog;
      setActivityRows([...activityRows]);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleCheckBoxChange = (event) => {
    setOnlyMine(event.target.checked);
  };
  return (
    <Container maxWidth={false}>
      <PageHeader title="Request log" divider>
        <Stack direction="row" spacing={2} sx={{ float: "right" }}>
          {loading && (
            <CircularProgress
              sx={{ marginTop: "9px" }}
              size={25}
              color="secondary"
            />
          )}

          <FormGroup sx={{ paddingLeft: "5px" }}>
            <FormControlLabel
              label="Only My Requests"
              control={
                <Checkbox
                  name="myRequests"
                  inputProps={{
                    "data-testid": `input-check-my-request`,
                  }}
                  onChange={(e) => handleCheckBoxChange(e)}
                  checked={onlyMine}
                />
              }
            />
          </FormGroup>
          <FormGroup sx={{ paddingLeft: "5px" }}>
            <Tooltip title="Auto refresh every 15 seconds, you can also expand an individual request to see updates every 3 seconds">
              <FormControlLabel
                label="Auto Refresh"
                control={
                  <Checkbox
                    name="autoRefresh"
                    inputProps={{
                      "data-testid": `input-check-auto-refresh`,
                    }}
                    onChange={(e) => handleAutoRefresh(e)}
                    checked={autoRefresh}
                  />
                }
              />
            </Tooltip>
          </FormGroup>
        </Stack>
      </PageHeader>
      <TableContainer sx={{ marginTop: "40px" }} component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Submitted on</TableCell>
              <TableCell>Tech Review Job ID</TableCell>
              <TableCell>Implementation Job ID</TableCell>
              <TableCell>Change Record</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityRows.map((row, i) => (
              <Row
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                updateSeviceRequestData={updateSeviceRequestData}
                key={`${row.id}${i}`}
                row={row}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        nextIconButtonProps={{ disabled: loading }}
        backIconButtonProps={{ disabled: loading }}
        SelectProps={{ disabled: loading }}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};
export default RequestLog;
