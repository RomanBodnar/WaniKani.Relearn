import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/assignments", "./assignments/assignments.tsx"),
    route("/kanji", "./kanji/kanji.tsx"),
    route("/vocabulary", "./vocabulary/vocabulary.tsx"),
    route("/kana-vocabulary", "./kana-vocabulary/kana-vocabulary.tsx")
] satisfies RouteConfig;
