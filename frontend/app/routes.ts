import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  // Points to /app/routes/home.tsx
  index("./routes/home.tsx"),

  // Simple routes
  route("kansanedustajat", "./routes/kansanedustajat.tsx"),
  route("puolueet", "./routes/puolueet.tsx"),
  route("info", "./routes/info.tsx"),
  route("puheenvuorot", "./routes/puheenvuorot.tsx"),

  // Prefix for /kansanedustaja routes
  ...prefix("kansanedustaja", [
    route(":personId", "./routes/$personId.tsx"),
    route(":personId/välihuudot", "./routes/$personId.välihuudot.tsx"),
    route(":personId/puheenvuorot", "./routes/$personId.puheenvuorot.tsx"), // ← ADD THIS
  ]),
] satisfies RouteConfig;
