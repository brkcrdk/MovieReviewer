import "Styles/globals.scss";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "themes/dark";
import { SnackbarProvider } from "notistack";
import { supabaseClient } from "utils";
import { useEffect, useState } from "react";
import nookies from "nookies";
import App, { AppContext } from "next/app";
import { useRouter } from "next/router";
import Loader from "Components/Loader/Loader";
import { setUser, signIn, signOut } from "Services/auth";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const { push, asPath, pathname } = useRouter();

  useEffect(() => {
    if (asPath.match("access_token")) setLoading(true);
    else setLoading(false);
  }, [asPath]);
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const newUser = supabaseClient.auth.user();
      if (newUser) {
        await fetch("/api/auth/set", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        });

        setUser(newUser.id);

        if (!newUser) {
          await signIn();
        }
      }
    });
  }, [push]);

  useEffect(() => {}, []);

  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={darkTheme}>
        {loading ? <Loader open /> : <Component {...pageProps} />}
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const { ctx } = appContext;
  const cookies = nookies.get(ctx);

  if (!cookies["sb:token"]) {
    if (ctx.pathname !== "/") {
      ctx?.res?.writeHead(307, {
        location: "/",
      });
      ctx?.res?.end();
    }
  } else {
    if (ctx.pathname === "/") {
      ctx?.res?.writeHead(307, {
        location: "/lobby/groups",
      });
      ctx?.res?.end();
    }
  }

  return { ...appProps };
};
