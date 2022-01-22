import "Styles/globals.scss";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "themes/dark";
import { SnackbarProvider } from "notistack";

function App({ Component, pageProps }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={darkTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
