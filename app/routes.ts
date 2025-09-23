import { 
    type RouteConfig, 
    route 
} from "@react-router/dev/routes";

export default [
    route("/", "routes/home.tsx"),
    route("/about/", "routes/about.tsx"),
    route("/write/", "routes/write.tsx"),
    route("/my_stories/", "routes/my_stories.tsx")
] satisfies RouteConfig;
