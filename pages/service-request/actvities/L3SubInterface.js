import { useContext, useState } from "react";

import {
  Stack,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddRemoveCopy from "./AddRemoveCopy";
import { JobContext } from "../../../context/JobContext";
import PrevNextStep from "./PrevNextStep";
import Accordion from "../../../components/Accordion";
import ContainerHeight from "../../../components/ContainerHeight";

const L3SubInterface = ({ activityId }) => {
  const { getJobParams, updateJobParam } = useContext(JobContext);

  const params = getJobParams(activityId);

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };

  const handleCheckBoxChange = (rowId, event) => {
    const { name, checked } = event.target;
    updateJobParam(activityId, rowId, name, checked);
  };

  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState({ 1: true });

  const toggleExpanded = (rowId) => {
    let copy = { ...expanded };
    copy[rowId] = !copy[rowId];
    setExpanded(copy);
  };

  const isValid = () => {
    let errors = {};
    let hostnames = {};
    params.forEach((row) => {
      let key = row.hostname.toLowerCase() + row.name.toLowerCase();
      if (hostnames[key]) {
        hostnames[key]++;
      } else {
        hostnames[key] = 1;
      }
    });
    params.forEach((row) => {
      if (!row.hostname) {
        errors[`hostname${row.rowId}`] = "Required";
      } else if (
        hostnames[row.hostname.toLowerCase() + row.name.toLowerCase()] > 1
      ) {
        errors[`hostname${row.rowId}`] = "Duplicate";
        errors[`name${row.rowId}`] = "Duplicate";
      }
      if (!row.name) {
        errors[`name${row.rowId}`] = "Required";
      }

      if (!row.description) {
        errors[`description${row.rowId}`] = "Required";
      }
      if (row.acl_inbound || row.acl_outbound) {
        if (!row.acl_afi) {
          errors[`acl_afi${row.rowId}`] = "Required";
        }
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <ContainerHeight>
        {params.map((activity) => {
          return (
            <Accordion
              key={activity.rowId}
              expanded={expanded[activity.rowId] || false}
              onChange={(e) => {
                // ignore event from child
                if (e.target.tagName !== "INPUT") {
                  toggleExpanded(activity.rowId);
                }
              }}
              summary={
                <Stack spacing={1} direction="row" key={activity.rowId}>
                  <TextField
                    label="Hostname"
                    name="hostname"
                    error={!!errors[`hostname${activity.rowId}`]}
                    helperText={errors[`hostname${activity.rowId}`]}
                    placeholder="Ex. ARGKCY93"
                    required
                    value={activity.hostname}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-hostname`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  />

                  <TextField
                    label="Name"
                    name="name"
                    required
                    error={!!errors[`name${activity.rowId}`]}
                    helperText={errors[`name${activity.rowId}`]}
                    placeholder="Bundle-Ether335.10"
                    value={activity.name}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-name`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>

                  <TextField
                    label="Description"
                    name="description"
                    placeholder="POD1_LF1_VRF_Global"
                    error={!!errors[`description${activity.rowId}`]}
                    helperText={errors[`description${activity.rowId}`]}
                    required
                    value={activity.description}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-description`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>
                  <FormGroup sx={{ paddingLeft: "5px" }}>
                    <FormControlLabel
                      label="Enabled"
                      control={
                        <Checkbox
                          name="enabled"
                          inputProps={{
                            "data-testid": `${activity.rowId}-input-summary-only`,
                          }}
                          onChange={(e) =>
                            handleCheckBoxChange(activity.rowId, e)
                          }
                          checked={activity.enabled}
                        />
                      }
                    />
                  </FormGroup>

                  <AddRemoveCopy
                    activityId={activityId}
                    rowId={activity.rowId}
                  />
                </Stack>
              }
              details={
                <div>
                  <Stack direction={"row"} marginTop={"15px"} spacing={1}>
                    <TextField
                      label="MTU"
                      name="mtu"
                      error={!!errors[`mtu${activity.rowId}`]}
                      helperText={errors[`mtu${activity.rowId}`]}
                      required
                      value={activity.mtu || ""}
                      select
                      sx={{ width: "150px" }}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-mtu`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                    >
                      <MenuItem value="1500">1500</MenuItem>
                      <MenuItem value="9216">9216</MenuItem>
                    </TextField>

                    <TextField
                      label="IP4 Address"
                      name="ipv4_address"
                      error={!!errors[`ipv4_address${activity.rowId}`]}
                      helperText={errors[`ipv4_address${activity.rowId}`]}
                      value={activity.ipv4_address}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-ipv4_address`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                      placeholder="192.168.20.10"
                    ></TextField>
                    <TextField
                      label="IP6 Address"
                      name="ipv6_address"
                      error={!!errors[`ipv6_address${activity.rowId}`]}
                      helperText={errors[`ipv6_address${activity.rowId}`]}
                      value={activity.ipv6_address}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-ipv6_address`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                      placeholder="fd02:976a::8/127"
                    ></TextField>

                    <TextField
                      label="ACL Inbound"
                      name="acl_inbound"
                      error={!!errors[`inbound${activity.rowId}`]}
                      helperText={errors[`inbound${activity.rowId}`]}
                      value={activity.inbound}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-inbound`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      placeholder="inbound"
                      variant="outlined"
                    ></TextField>

                    <TextField
                      label="ACL Outbound"
                      name="acl_outbound"
                      placeholder=""
                      error={!!errors[`outbound${activity.rowId}`]}
                      helperText={errors[`outbound${activity.rowId}`]}
                      value={activity.outbound}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-outbound`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                    ></TextField>
                    <TextField
                      label="ACL AFI"
                      name="acl_afi"
                      error={!!errors[`acl_afi${activity.rowId}`]}
                      helperText={errors[`acl_afi${activity.rowId}`]}
                      value={activity.acl_afi || ""}
                      select
                      sx={{ width: "150px" }}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-acl_afi`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                    >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="IPv4">IPv4</MenuItem>
                      <MenuItem value="IPv6">IPv6</MenuItem>
                    </TextField>
                    <TextField
                      label="VRF"
                      name="vrf"
                      placeholder="GI-IPV6"
                      error={!!errors[`vrf${activity.rowId}`]}
                      helperText={errors[`vrf${activity.rowId}`]}
                      value={activity.vrf}
                      inputProps={{
                        "data-testid": `${activity.rowId}-input-vrf`,
                      }}
                      onChange={(e) => handleInputChange(activity.rowId, e)}
                      variant="outlined"
                    ></TextField>

                    <FormGroup sx={{ paddingLeft: "5px" }}>
                      <FormControlLabel
                        label="BFD"
                        control={
                          <Checkbox
                            name="bfd"
                            inputProps={{
                              "data-testid": `${activity.rowId}-input-bfd`,
                            }}
                            onChange={(e) =>
                              handleCheckBoxChange(activity.rowId, e)
                            }
                            checked={activity.bfd}
                          />
                        }
                      />
                    </FormGroup>
                  </Stack>
                </div>
              }
            />
          );
        })}
      </ContainerHeight>
      <PrevNextStep isValid={isValid} />
    </div>
  );
};

export default L3SubInterface;
