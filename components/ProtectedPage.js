import React from "react";

// Msal imports
import { MsalAuthenticationTemplate } from "@azure/msal-react";

import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

import Loading from "./Loading";
import Error from "./Error";

const ProtectedPage = (props) => {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
      errorComponent={Error}
      loadingComponent={Loading}
    >
      {props.children}
    </MsalAuthenticationTemplate>
  );
};

export default ProtectedPage;
