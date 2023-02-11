// converts a string of ranges to an array of numbers
//"0-11,22, 30-40" --> 0,1...11,22,30,31...40
const stringRangesToArray = (input) => {
  return input.split(",").flatMap((item) => {
    // handle negative single values
    if (item.startsWith("-") || item.endsWith("-")) {
      return [item];
    }
    let range = item.split("-").map((i) => parseInt(i));
    if (range.length === 1) {
      return range[0];
    } else {
      let start = range[0];
      let size = range[1] - start + 1;

      return Array(size)
        .fill()
        .map((_, i) => start + i);
    }
  });
};

// inclusive range check
const isBetween = (value, min, max) => {
  return isNumeric(value) && value >= min && value <= max;
};

//Valid vlan id's are between the range of 2-4095
const isValidVlanId = (vlan_id) => {
  return isBetween(vlan_id, 2, 4095);
};

const isValidRange = (input) => {
  if (!input || input.length === 0) return false;
  return stringRangesToArray(input).every(isValidVlanId);
};

//Supports standard 16 & 32 bit as numbers
//Supports standard 32 bit asdot ranges
const isValidASNumber = (as_number) => {
  let as_number_parts = as_number?.split(".") || [];

  //standard 16/32 bit ranges
  if (as_number_parts.length === 1) {
    return (
      isBetween(as_number, 4200000000, 4294967294) ||
      isBetween(as_number, 64512, 65535)
    );
  }
  //standard 32 bit asdot ranges
  if (as_number_parts.length === 2) {
    return (
      isBetween(as_number_parts[0], 64086, 65535) &&
      isBetween(as_number_parts[1], 59904, 65534)
    );
  }
  return false;
};

const isValidEmail = (value) => {
  return /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/.test(value);
};

const isValidInterfaceName = (value) => {
  return /^[a-zA-Z]+\d+\/\d+/.test(value);
};

const isValidIpAddress = (value) => {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    value
  );
};

const isValidIpAddressWithMask = (value) => {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(\d){1,3}$/.test(
    value
  );
};

const isValidMacAddress = (value) => {
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value);
};

const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

const hasWhiteSpace = (s) => {
  return /\s/g.test(s);
};

export {
  isBetween,
  isValidRange,
  isNumeric,
  isValidEmail,
  hasWhiteSpace,
  isValidInterfaceName,
  isValidIpAddress,
  isValidIpAddressWithMask,
  isValidMacAddress,
  isValidASNumber,
  isValidVlanId,
};
