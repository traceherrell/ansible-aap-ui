import React, { useContext, useState } from "react";

import { Stack, TextField, Tab, Tabs, MenuItem } from "@mui/material";
import Accordion from "../../../components/Accordion";
import { JobContext } from "../../../context/JobContext";
import AddRemoveCopy from "./AddRemoveCopy";
import TabPanel from "../../../components/TabPanel";
import PrevNextStep from "./PrevNextStep";
import ContainerHeight from "../../../components/ContainerHeight";

const RouteMapAdd = ({ activityId }) => {
  const { getJobParams, updateJobParam } = useContext(JobContext);

  const params = getJobParams(activityId);

  const handleInputChange = (rowId, event) => {
    const { name, value } = event.target;
    updateJobParam(activityId, rowId, name, value);
  };
  const handleInputArrayChange = (rowId, event) => {
    const { name, value } = event.target;
    const array = value.split(",");
    //remove whitespace
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i].trim();
    }
    updateJobParam(activityId, rowId, name, array);
  };

  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState({ 1: true });
  const [tabValue, setTabValue] = useState({ 1: 0 });

  const toggleExpanded = (rowId) => {
    let copy = { ...expanded };
    copy[rowId] = !copy[rowId];
    setExpanded(copy);
  };
  const handleTabChange = (event, rowId, newValue) => {
    let copy = { ...tabValue };
    copy[rowId] = newValue;
    setTabValue(copy);
  };

  const isValid = () => {
    let errors = {};
    let hostnames = {};
    params.forEach((row) => {
      let key = row.hostname.toLowerCase() + row.route_map.toLowerCase();
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
        hostnames[row.hostname.toLowerCase() + row.route_map.toLowerCase()] > 1
      ) {
        errors[`hostname${row.rowId}`] = "Duplicate";
        errors[`route_map${row.rowId}`] = "Duplicate";
      }
      if (!row.route_map) {
        errors[`route_map${row.rowId}`] = "Required";
      }
      if (!row.sequence) {
        errors[`sequence${row.rowId}`] = "Required";
      }
      if (!row.action) {
        errors[`action${row.rowId}`] = "Required";
      }
      if (!row.description) {
        errors[`description${row.rowId}`] = "Required";
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
                    label="Route Map"
                    name="route_map"
                    required
                    error={!!errors[`route_map${activity.rowId}`]}
                    helperText={errors[`route_map${activity.rowId}`]}
                    placeholder="Ex. CISCO-VNF-IPV4EBGP-REC-IN"
                    value={activity.route_map}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-route_map`,
                    }}
                    sx={{ width: "150px" }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>
                  <TextField
                    label="Sequence"
                    name="sequence"
                    error={!!errors[`sequence${activity.rowId}`]}
                    helperText={errors[`sequence${activity.rowId}`]}
                    placeholder="Ex. 10"
                    required
                    value={activity.sequence}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-sequence`,
                    }}
                    sx={{ width: "150px" }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>
                  <TextField
                    label="Action"
                    name="action"
                    placeholder="Ex. permit/deny"
                    error={!!errors[`action${activity.rowId}`]}
                    helperText={errors[`action${activity.rowId}`]}
                    required
                    value={activity.action}
                    sx={{ width: "150px" }}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-action`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>
                  <TextField
                    label="Description"
                    name="description"
                    placeholder="Cisco VNF IPv4 inBound"
                    error={!!errors[`description${activity.rowId}`]}
                    helperText={errors[`description${activity.rowId}`]}
                    required
                    value={activity.description}
                    sx={{ width: "200px" }}
                    inputProps={{
                      "data-testid": `${activity.rowId}-input-description`,
                    }}
                    onChange={(e) => handleInputChange(activity.rowId, e)}
                    variant="outlined"
                  ></TextField>

                  <AddRemoveCopy
                    activityId={activityId}
                    rowId={activity.rowId}
                  />
                </Stack>
              }
              details={
                <div>
                  <Tabs
                    value={tabValue[activity.rowId] || 0}
                    onChange={(e, newValue) =>
                      handleTabChange(e, activity.rowId, newValue)
                    }
                    aria-label="tabs"
                    indicatorColor="secondary"
                    textColor="inherit"
                  >
                    <Tab label="Match" />
                    <Tab label="Set" />
                  </Tabs>
                  <TabPanel
                    style={{ padding: "0px" }}
                    value={tabValue[activity.rowId] || 0}
                    index={0}
                  >
                    <Stack marginTop={"15px"} spacing={1}>
                      <TextField
                        label="AS Path"
                        name="match_as_path"
                        error={!!errors[`match_as_path${activity.rowId}`]}
                        helperText={errors[`match_as_path${activity.rowId}`]}
                        placeholder="10,SPRINT-3651"
                        value={activity.match_as_path.join(",")}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_as_path`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      />

                      <TextField
                        label="Community List"
                        name="match_community_list"
                        placeholder="BGPCommunity1,BGPCoomunity2"
                        error={
                          !!errors[`match_community_list${activity.rowId}`]
                        }
                        helperText={
                          errors[`match_community_list${activity.rowId}`]
                        }
                        value={activity.match_community_list.join(",")}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_community_list`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="Community Exact Match"
                        name="match_community_exact_match"
                        select
                        sx={{ width: "250px" }}
                        error={
                          !!errors[
                            `match_community_exact_match${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[`match_community_exact_match${activity.rowId}`]
                        }
                        value={activity.match_community_exact_match}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_community_exact_match`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      >
                        <MenuItem value="yes">yes</MenuItem>
                        <MenuItem value="no">no</MenuItem>
                      </TextField>

                      <TextField
                        label="Interfaces"
                        name="match_interfaces"
                        error={!!errors[`match_interfaces${activity.rowId}`]}
                        helperText={errors[`match_interfaces${activity.rowId}`]}
                        value={activity.match_interfaces.join(",")}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_interfaces`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                        placeholder="ethernet1/11,ethernet1/12"
                      ></TextField>

                      <TextField
                        label="IP Next Hop Prefix Lists"
                        name="match_ip_next_hop_prefix_lists"
                        error={
                          !!errors[
                            `match_ip_next_hop_prefix_lists${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ip_next_hop_prefix_lists${activity.rowId}`
                          ]
                        }
                        value={activity.match_ip_next_hop_prefix_lists.join(
                          ","
                        )}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ip_next_hop_prefix_lists`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        placeholder="CISCO-VNF-INTERNAL-IPV4,SPRINT-eNB-S1"
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="IP Route Source Prefix Lists"
                        name="match_ip_route_source_prefix_lists"
                        placeholder="CISCO-VNF-INTERNAL-IPV4,LTE-S1U-AGG-TO-CORE"
                        error={
                          !!errors[
                            `match_ip_route_source_prefix_lists${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ip_route_source_prefix_lists${activity.rowId}`
                          ]
                        }
                        value={activity.match_ip_route_source_prefix_lists.join(
                          ","
                        )}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ip_route_source_prefix_lists`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="IPv6 Address Access List"
                        name="match_ipv6_address_access_list"
                        placeholder="GI-IPV6"
                        sx={{ width: "250px" }}
                        error={
                          !!errors[
                            `match_ipv6_address_access_list${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ipv6_address_access_list${activity.rowId}`
                          ]
                        }
                        value={activity.match_ipv6_address_access_list}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ipv6_address_access_list`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="IPv6 Address Prefix Lists"
                        name="match_ipv6_address_prefix_lists"
                        placeholder="DRC-GI-IPV6-IN,DRC-GI-IPV6-OUT"
                        error={
                          !!errors[
                            `match_ipv6_address_prefix_lists${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ipv6_address_prefix_lists${activity.rowId}`
                          ]
                        }
                        value={activity.match_ipv6_address_prefix_lists.join(
                          ","
                        )}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ipv6_address_prefix_lists`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="IPv6 Next Hop Prefix Lists"
                        name="match_ipv6_next_hop_prefix_lists"
                        placeholder="GI-IPV6-AGG-TO-CORE,GI-IPV6-AGG-TO-PE"
                        error={
                          !!errors[
                            `match_ipv6_next_hop_prefix_lists${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ipv6_next_hop_prefix_lists${activity.rowId}`
                          ]
                        }
                        value={activity.match_ipv6_next_hop_prefix_lists.join(
                          ","
                        )}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ipv6_next_hop_prefix_lists`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      ></TextField>

                      <TextField
                        label="IPv6 Route Source Prefix Lists"
                        name="match_ipv6_route_source_prefix_lists"
                        placeholder="DRC-GI-IPV6-IN,DEFAULT-IPV6-ROUTE"
                        error={
                          !!errors[
                            `match_ipv6_route_source_prefix_lists${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `match_ipv6_route_source_prefix_lists${activity.rowId}`
                          ]
                        }
                        value={activity.match_ipv6_route_source_prefix_lists.join(
                          ","
                        )}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-match_ipv6_route_source_prefix_lists`,
                        }}
                        onChange={(e) =>
                          handleInputArrayChange(activity.rowId, e)
                        }
                        variant="outlined"
                      ></TextField>
                    </Stack>
                  </TabPanel>

                  <TabPanel value={tabValue[activity.rowId]} index={1}>
                    <Stack marginTop={"15px"} width={"300px"} spacing={1}>
                      <TextField
                        label="IP Precedence"
                        name="set_ip_precedence"
                        error={!!errors[`set_ip_precedence${activity.rowId}`]}
                        helperText={
                          errors[`set_ip_precedence${activity.rowId}`]
                        }
                        select
                        value={activity.set_ip_precedence}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_ip_precedence`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      >
                        {[
                          "critical",
                          "flash",
                          "flash-override",
                          "internet",
                          "network",
                          "priority",
                          "routine",
                        ].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="IPv6 Address Prefix List"
                        name="set_ipv6_address_prefix_list"
                        error={
                          !!errors[
                            `set_ipv6_address_prefix_list${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `set_ipv6_address_prefix_list${activity.rowId}`
                          ]
                        }
                        placeholder="DRC-GI-IPV6-IN"
                        value={activity.set_ipv6_address_prefix_list}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_ipv6_address_prefix_list`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                      <TextField
                        label="Metric Bandwidth"
                        name="set_metric_bandwidth"
                        error={
                          !!errors[`set_metric_bandwidth${activity.rowId}`]
                        }
                        helperText={
                          errors[`set_metric_bandwidth${activity.rowId}`]
                        }
                        placeholder="0"
                        value={activity.set_metric_bandwidth}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_metric_bandwidth`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                      <TextField
                        label="Metric IGRP Delay Metric"
                        name="set_metric_igrp_delay_metric"
                        error={
                          !!errors[
                            `set_metric_igrp_delay_metric${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `set_metric_igrp_delay_metric${activity.rowId}`
                          ]
                        }
                        placeholder="0"
                        value={activity.set_metric_igrp_delay_metric}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_metric_igrp_delay_metric`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                      <TextField
                        label="Metric IGRP Effective Bandwidth Metric"
                        name="set_metric_igrp_effective_bandwidth_metric"
                        error={
                          !!errors[
                            `set_metric_igrp_effective_bandwidth_metric${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `set_metric_igrp_effective_bandwidth_metric${activity.rowId}`
                          ]
                        }
                        placeholder="0"
                        value={
                          activity.set_metric_igrp_effective_bandwidth_metric
                        }
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_metric_igrp_effective_bandwidth_metric`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                      <TextField
                        label="Metric IGRP MTU"
                        name="set_metric_igrp_mtu"
                        error={!!errors[`set_metric_igrp_mtu${activity.rowId}`]}
                        helperText={
                          errors[`set_metric_igrp_mtu${activity.rowId}`]
                        }
                        placeholder="0"
                        value={activity.set_metric_igrp_mtu}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_metric_igrp_mtu`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                      <TextField
                        label="Metric IGRP Reliability Metric"
                        name="set_metric_igrp_reliability_metric"
                        error={
                          !!errors[
                            `set_metric_igrp_reliability_metric${activity.rowId}`
                          ]
                        }
                        helperText={
                          errors[
                            `set_metric_igrp_reliability_metric${activity.rowId}`
                          ]
                        }
                        placeholder="0"
                        value={activity.set_metric_igrp_reliability_metric}
                        inputProps={{
                          "data-testid": `${activity.rowId}-input-set_metric_igrp_reliability_metric`,
                        }}
                        onChange={(e) => handleInputChange(activity.rowId, e)}
                        variant="outlined"
                      />
                    </Stack>
                  </TabPanel>
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

export default RouteMapAdd;
