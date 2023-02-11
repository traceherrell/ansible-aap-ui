import * as comps from "./actvities";

const activities = {
  nessie_ns_portDefault: {
    category: "IP",
    service: "Interface",
    activity: "Port Default",
    tag: "Auto Execute",
    id: "nessie_ns_portDefault",
    params: [
      {
        rowId: 1,
        hostname: "",
        interface: "",
      },
    ],
    component: comps.PortDefault,
  },
  nessie_ns_portTurnUp: {
    category: "IP",
    service: "Interface",
    activity: "Port Turn Up",
    tag: "Auto Execute",
    id: "nessie_ns_portTurnUp",
    params: [
      {
        rowId: 1,
        aSideHostname: "",
        aSidePort: "",
        aSideSlot: "",
        hostname: "",
        interface: "",
        speed: "",
        duplex: "",
        type: "",
        vlan: "",
        native: "",
        mtu: "",
      },
    ],
    component: comps.PortTurnUp,
  },
  nessie_ns_cableTest: {
    category: "IP",
    service: "Interface",
    activity: "Cable Testing",
    tag: "Auto Execute",
    id: "nessie_ns_cableTest",
    component: comps.CableTesting,
    params: [
      {
        rowId: 1,
        hostname: "",
        interface: "",
        ip: "",
        speed: "",
        duplex: "",
        mtu: "",
      },
    ],
  },
  nessie_ns_bgpAddressFamilyAdd: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Add",
    tag: "",
    id: "nessie_ns_bgpAddressFamilyAdd",
    component: comps.BGPAddressFamily,
    params: [
      {
        rowId: 1,
        hostname: "",
        vrf: "",
        afi: "",
        safi: "",
        as_number: "",
        aggregate_address: [{ network: "", summary_only: false }],
        operation: "add",
      },
    ],
  },
  nessie_ns_bgpAddressFamilyModify: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Modify",
    tag: "Auto Execute",
    id: "nessie_ns_bgpAddressFamilyModify",
    component: comps.BGPAddressFamily,
    params: [
      {
        rowId: 1,
        hostname: "",
        vrf: "",
        afi: "",
        safi: "",
        as_number: "",
        aggregate_address: [{ network: "", summary_only: false }],
        operation: "modify",
      },
    ],
  },
  nessie_ns_bgpAddressFamilyDelete: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Delete",
    tag: "Auto Execute",
    id: "nessie_ns_bgpAddressFamilyDelete",
    component: comps.BGPAddressFamily,
    params: [
      {
        rowId: 1,
        hostname: "",
        vrf: "",
        afi: "",
        safi: "",
        as_number: "",
        aggregate_address: [{ network: "", summary_only: false }],
        operation: "delete",
      },
    ],
  },
  nessie_ns_vlanAdd: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Add",
    id: "nessie_ns_vlanAdd",
    params: [
      {
        rowId: 1,
        hostname: "",
        vlan_id: "",
        vlan_name: "",
        operation: "add",
      },
    ],
    component: comps.Vlan,
  },
  nessie_ns_vlanModify: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Modify",
    id: "nessie_ns_vlanModify",
    params: [
      {
        rowId: 1,
        hostname: "",
        vlan_id: "",
        vlan_name: "",
        operation: "modify",
      },
    ],
    component: comps.Vlan,
  },
  nessie_ns_vlanDelete: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Delete",
    id: "nessie_ns_vlanDelete",
    params: [
      {
        rowId: 1,
        hostname: "",
        vlan_id: "",
        vlan_name: "",
        operation: "delete",
      },
    ],
    component: comps.VlanDelete,
  },

  nessie_ns_routeMapAdd: {
    category: "IP",
    service: "Route Map",
    activity: "Route Map Add",
    id: "nessie_ns_routeMapAdd",
    params: [
      {
        rowId: 1,
        hostname: "",
        route_map: "",
        sequence: "",
        action: "",
        description: "",
        match_as_path: [],
        match_community_list: [],
        match_community_exact_match: "",
        match_interfaces: [],
        match_ip_next_hop_prefix_lists: [],
        match_ip_route_source_prefix_lists: [],
        match_ipv6_address_access_list: "",
        match_ipv6_address_prefix_lists: [],
        match_ipv6_next_hop_prefix_lists: [],
        match_ipv6_route_source_prefix_lists: [],
        set_ip_precedence: "",
        set_ipv6_address_prefix_list: "",
        set_metric_bandwidth: "",
        set_metric_igrp_delay_metric: "",
        set_metric_igrp_effective_bandwidth_metric: "",
        set_metric_igrp_mtu: "",
        set_metric_igrp_reliability_metric: "",
      },
    ],
    component: comps.RouteMapAdd,
  },
  nessie_ns_routeMapDelete: {
    category: "IP",
    service: "Route Map",
    activity: "Route Map Delete",
    id: "nessie_ns_routeMapDelete",
    params: [
      {
        rowId: 1,
        hostname: "",
        route_map: "",
      },
    ],
    component: comps.RouteMapDelete,
  },

  nessie_ns_l3SubInterface: {
    category: "IP",
    service: "Interface",
    activity: "L3 Sub Interface",
    tag: "Auto Execute",
    id: "nessie_ns_l3SubInterface",
    params: [
      {
        rowId: 1,
        hostname: "",
        name: "",
        description: "",
        enabled: true,
        mtu: "",
        ipv4_address: "",
        ipv6_address: "",
        acl_inbound: "",
        acl_outbound: "",
        acl_afi: "",
        vrf: "",
        bfd: false,
      },
    ],
    component: comps.L3SubInterface,
  },
  nessie_ns_AsPathSet: {
    category: "IP",
    service: "Route Map",
    activity: "AS Path Set",
    tag: "Auto Execute",
    id: "nessie_ns_AsPathSet",
    params: [
      {
        rowId: 1,
        hostname: "",
        name: "",
        entries: [],
      },
    ],
    component: comps.ASPathSet,
  },
};

const getCategories = () => {
  let hash = {};
  Object.keys(activities).forEach((key) => {
    hash[activities[key].category] = true;
  });
  return Object.keys(hash);
};

const getServices = (category) => {
  let hash = {};
  Object.keys(activities)
    .filter((key) => activities[key].category === category)
    .forEach((key) => {
      hash[activities[key].service] = true;
    });
  return Object.keys(hash).sort((a, b) => a.localeCompare(b));
};
const getActivities = (category, service) => {
  let query = Object.keys(activities)
    .filter(
      (id) =>
        activities[id].category === category &&
        activities[id].service === service
    )
    .sort((a, b) => a.localeCompare(b));

  return query.map((id) => activities[id]);
};

export { getCategories, getServices, getActivities, activities };
