import { useState, useContext } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { activities } from "../service-request/activities";
import { JobContext } from "../../context/JobContext";

const GlobalTemplate = ({ template }) => {
  const [expanded, setExpanded] = useState(false);
  const { addJobs } = useContext(JobContext);

  const handleStart = () => {
    addJobs(template.activities);
  };

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography paddingLeft="5px">{`${template.name}`}</Typography>
          {/* <Chip label={`${template.tag}`} /> */}
          <div>
            <Button
              sx={{ marginRight: "15px" }}
              data-testid="button-start"
              onClick={handleStart}
              variant="contained"
            >
              LAUNCH
            </Button>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography marginBottom="15px">
          {template.description || "Service activities: "}
        </Typography>
        <Stack direction="row" spacing={2}>
          {template.activities.map((activity, index) => {
            return (
              <Chip key={index} label={`${activities[activity]?.activity}`} />
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default GlobalTemplate;
