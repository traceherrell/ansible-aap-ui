import "@/styles/globals.css";
import { useMemo } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppBarNetwork } from "../components/AppBarNetwork";

import { NotificationProvider } from "../context/NotificationContext";
import { JobProvider } from "../context/JobContext";
import Notifications from "../components/Notifications";

const lightTheme = (prefersDarkMode) => {
  return {
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: prefersDarkMode ? "#fff" : "inherit",
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: prefersDarkMode ? "#fff" : "inherit",
            },
          },
        },
      },
    },

    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: "#191919",
        contrastText: "#fff",
      },
      secondary: {
        main: "#e20074",
        contrastText: "#fff",
      },
      neutral: {
        main: "#EBEAEA",
        darker: "#D8D8D8",
        contrastText: "#191919",
      },
    },
    typography: {
      fontFamily: `BlinkMacSystemFont ,"-apple-system", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", Droid Sans, "Helvetica Neue", sans-serif`,
    },
  };
};

export default function App({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () => createTheme(lightTheme(prefersDarkMode)),

    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <JobProvider>
          <AppBarNetwork />
          <Component {...pageProps} />
          <Notifications />
        </JobProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
