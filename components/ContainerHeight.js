import PropTypes from "prop-types";

const ContainerHeight = (props) => {
  const { children } = props;

  return <div style={{ maxHeight: "50vh", overflowY: "auto" }}>{children}</div>;
};

ContainerHeight.propTypes = {
  children: PropTypes.node,
};

export default ContainerHeight;
