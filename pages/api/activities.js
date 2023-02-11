let comps = {};
let activities = {
  portDefault: {
    category: "IP",
    service: "Interface",
    activity: "Port Default",
    tag: "Auto Execute",
    id: "portDefault",
    params: [
      {
        rowId: 1,
        hostname: "",
        interface: "",
      },
    ],
    component: comps.PortDefault,
  },
  portTurnUp: {
    category: "IP",
    service: "Interface",
    activity: "Port Turn Up",
    tag: "Auto Execute",
    id: "portTurnUp",
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
  cableTest: {
    category: "IP",
    service: "Interface",
    activity: "Cable Testing",
    tag: "Auto Execute",
    id: "cableTest",
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
  bgpAddressFamilyAdd: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Add",
    tag: "",
    id: "bgpAddressFamilyAdd",
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
  bgpAddressFamilyModify: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Modify",
    tag: "Auto Execute",
    id: "bgpAddressFamilyModify",
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
  bgpAddressFamilyDelete: {
    category: "IP",
    service: "BGP",
    activity: "Address Family Delete",
    tag: "Auto Execute",
    id: "bgpAddressFamilyDelete",
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
  vlanAdd: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Add",
    id: "vlanAdd",
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
  vlanModify: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Modify",
    id: "vlanModify",
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
  vlanDelete: {
    category: "IP",
    service: "Vlan",
    activity: "Vlan Delete",
    id: "vlanDelete",
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

  routeMapAdd: {
    category: "IP",
    service: "Route Map",
    activity: "Route Map Add",
    id: "routeMapAdd",
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
  routeMapDelete: {
    category: "IP",
    service: "Route Map",
    activity: "Route Map Delete",
    id: "routeMapDelete",
    params: [
      {
        rowId: 1,
        hostname: "",
        route_map: "",
      },
    ],
    component: comps.RouteMapDelete,
  },

  l3SubInterface: {
    category: "IP",
    service: "Interface",
    activity: "L3 Sub Interface",
    tag: "Auto Execute",
    id: "l3SubInterface",
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
  AsPathSet: {
    category: "IP",
    service: "Route Map",
    activity: "AS Path Set",
    tag: "Auto Execute",
    id: "AsPathSet",
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

const getActivityStatus = () => {
  return Object.keys(activities).map((id) => {
    return {
      id: id,
      isActive: true,
      categoryName: activities[id].category,
      serviceName: activities[id].service,
      name: activities[id].activity,
      tag: activities[id].tag,
    };
  });
};

export {
  getCategories,
  getServices,
  getActivities,
  getActivityStatus,
  activities,
};
