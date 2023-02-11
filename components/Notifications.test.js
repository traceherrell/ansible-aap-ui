import { render, screen } from "@testing-library/react";
import Notifications from "./Notifications";
import {
  NotificationContext,
} from "../context/NotificationContext";


test("Notifications", async () => {
  const providerProps = {
    notifications: [{ message: "test", severity: "error" }, { message: "test2", severity: "success" }],
    removeLastNotification: () => {},
    addNotification: () => {},
  };

  render(
    <NotificationContext.Provider value={providerProps}>
      <Notifications />
    </NotificationContext.Provider>
  );
  const element = await screen.findByRole("alert");
  expect(element).toBeInTheDocument();
});
