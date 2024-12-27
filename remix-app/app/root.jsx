import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./app.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta() {
  return [
    { charset: "utf-8" },
    { title: "Remix App" },
    { name: "viewport", content: "width=device-width,initial-scale=1" }
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>Välihuuto</header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
