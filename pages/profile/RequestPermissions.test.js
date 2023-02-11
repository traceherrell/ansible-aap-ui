import { render, screen, fireEvent } from "@testing-library/react";

import RequestPermissions from "./RequestPermissions";

test("RequestPermissions", () => {
  render(<RequestPermissions />);
  const el = screen.getByTestId("button-request-permission");
  expect(el).toBeInTheDocument();

  fireEvent.change(screen.getByTestId("select-category"), {
    target: { value: "Security" },
  });
  fireEvent.change(screen.getByTestId("select-service"), {
    target: { value: "VPN" },
  });
  fireEvent.change(screen.getByTestId("select-activity"), {
    target: { value: "GTM Pool Member Status" },
  });

  fireEvent.click(el);
});
