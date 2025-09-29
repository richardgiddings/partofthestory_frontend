import { 
    type RouteConfig, 
    route,
    index
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    //route("/", "routes/home.tsx"),
    route("/about/", "routes/about.tsx"),
    route("/write/", "routes/write.tsx"),
    route("/my_stories/", "routes/my_stories.tsx")
] satisfies RouteConfig;
