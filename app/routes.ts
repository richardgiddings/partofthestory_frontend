import { 
    type RouteConfig, 
    route,
    index 
} from "@react-router/dev/routes";

export default [
    index("routes/about.tsx"),
    route("home", "routes/home.tsx"),
    route("getting_started", "routes/getting_started.tsx"),
    route("write", "routes/write.tsx"),
    route("my_stories", "routes/my_stories.tsx")
] satisfies RouteConfig;
