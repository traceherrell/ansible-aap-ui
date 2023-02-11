import { useEffect, useState, useCallback } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Tabs,
  Tab,
  Container,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import PageHeader from "../../components/PageHeader";
import TabPanel from "../../components/TabPanel";
import PersonalTemplate from "./PersonalTemplate";
import GlobalTemplate from "./GlobalTemplate";
import { templates } from "./globalTemplates";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const GLOBAL = 0;
const PERSONAL = 1;

const JobTemplates = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [templateNameToRemove, setTemplateNameToRemove] = useState("");
  const [globalTemplates, setGlobalTemplates] = useState(templates);

  const [personalTemplates, setPersonalTemplates] = useState([]);
  const { get, post } = useFetchWithAuth();

  const handleRemoveTemplate = (name) => {
    setTemplateNameToRemove(name);
    setOpen(true);
  };

  const removeTemplate = () => {
    const newTemplates = personalTemplates.filter(
      (template) => template.name !== templateNameToRemove
    );
    setPersonalTemplates(newTemplates);

    post("userprofile/templates", newTemplates).then((response) => {
      if (response.ok) {
        console.log("Template removed");
      }
    });
    setOpen(false);
  };
  const getPersonalTemplates = useCallback(async () => {
    const response = await get("/userprofile");

    if (response.ok) {
      const data = await response.json();
      return data.templates;
    }
    return [];
  }, [get]);

  useEffect(() => {
    getPersonalTemplates().then((templates) => {
      // assign id to each template if null
      templates.forEach((template) => {
        if (!template.id) {
          template.id = Math.random().toString(36).substring(2, 15);
        }
      });
      setPersonalTemplates(templates);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const search = (e) => {
    const searchTerm = e.target.value;
    const filteredTemplates = templates.filter((template) => {
      return (
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setGlobalTemplates(filteredTemplates);
  };

  return (
    <Container maxWidth={false}>
      <PageHeader title="Service Request Templates" divider />
      <Stack
        sx={{ paddingBottom: "20px" }}
        direction="row"
        maxWidth="750px"
        justifyContent="space-between"
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="tabs"
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab label="Global Templates" aria-controls="tabpanel-0" />
          <Tab label="Personal Templates" aria-controls="tabpanel-1" />
        </Tabs>
        <TextField
          onChange={search}
          sx={{ marginRight: "35px", marginTop: "15px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Stack>

      <TabPanel value={tabValue} index={GLOBAL}>
        <Typography component="span" fontWeight="bold">
          Select a Global Template to load as a new request
        </Typography>
        <Stack marginTop="20px" maxWidth="700px" spacing={2}>
          {globalTemplates.map((template) => (
            <GlobalTemplate key={template.id} template={template} />
          ))}
        </Stack>
      </TabPanel>
      <TabPanel value={tabValue} index={PERSONAL}>
        <Typography component="span" fontWeight="bold">
          Select a Personal Template to load as a new request
        </Typography>
        <Stack marginTop="20px" maxWidth="700px" spacing={2}>
          {personalTemplates.map((template) => (
            <PersonalTemplate
              key={template.id}
              template={template}
              handleRemoveTemplate={handleRemoveTemplate}
            />
          ))}
        </Stack>
      </TabPanel>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Remove Service Request Template
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this template?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setOpen(false);
            }}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={removeTemplate}
            data-testid="button-remove"
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobTemplates;
