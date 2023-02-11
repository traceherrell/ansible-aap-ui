import { useState, useEffect, useContext } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NotificationContext } from "../context/NotificationContext";

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const { notifications, removeLastNotification } =
    useContext(NotificationContext);

  useEffect(() => {

    if (notifications.length && !messageInfo) {
      // Set a new notification when we don't have an active one
      setMessageInfo({ ...notifications[0] });
      removeLastNotification();
      setOpen(true);
    } else if (notifications.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [notifications, removeLastNotification, messageInfo, open]);

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        {messageInfo && (
          <Alert data-testid="alert-notification" role="alert"  severity={messageInfo.severity}>{messageInfo.message}</Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default Notifications;
