import { useRef, useContext } from "react";

import { Button, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import { NotificationContext } from "../../../context/NotificationContext";
import { JobContext } from "../../../context/JobContext";

const ImportExport = ({ activityId }) => {
  const { addNotification } = useContext(NotificationContext);
  const { addParams, getJobParams } = useContext(JobContext);

  const inputFileRef = useRef();

  const handleImport = async () => {
    try {
      const file = inputFileRef.current.files[0];
      const data = await importXLSX(file);
      addParams(activityId, data);
      inputFileRef.current.value = "";
    } catch (error) {
      console.error(error);

      addNotification({
        severity: "error",
        message: "Please upload a valid file",
      });
    }
  };
  const importXLSX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const result = XLSX.utils.sheet_to_json(sheet);
        resolve(result);
      };
      reader.readAsBinaryString(file);
    });
  };
  const exportXLSX = (data, filename) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  };

  const handleExport = () => {
    const data = getJobParams(activityId);
    exportXLSX(data, `${activityId}.xlsx`);
  };
  return (
    <Stack spacing={2} direction="row">
      <form>
        <input
          style={{ display: "none" }}
          ref={inputFileRef}
          onChange={handleImport}
          id="import-file-input"
          type="file"
        />
      </form>

      <Button variant="contained" color="primary" onClick={handleExport}>
        DOWNLOAD
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          inputFileRef.current.click();
        }}
      >
        Import
      </Button>
    </Stack>
  );
};

export default ImportExport;
