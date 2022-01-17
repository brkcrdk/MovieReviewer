import "Styles/globals.scss";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "themes/dark";

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
