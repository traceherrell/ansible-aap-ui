import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";

const STATUS = {
  error: "FAIL",
  pending: "PENDING",
  completed: "SUCCESS",
  inProgress: "INPROGRESS",
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case STATUS.error:
      return <CancelIcon color="error" />;
    case STATUS.pending:
      return <CircleIcon color="neutral" />;
    case STATUS.completed:
      return <DoneIcon color="success" />;
    case STATUS.inProgress:
      return <AccessTimeIcon color="success" />;
    default:
      return <CircleIcon color="neutral" />;
  }
};

export default StatusIcon;
