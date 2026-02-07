import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/assignments", "./assignments/assignments.tsx")
    
] satisfies RouteConfig;
