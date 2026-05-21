import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/assignments", "./assignments/assignments.tsx"),
    route("/radicals", "./radicals/radicals.tsx"),
    route("/kanji", "./kanji/kanji.tsx"),
    route("/vocabulary", "./vocabulary/vocabulary.tsx"),
    route("/subject/:id", "./subject/subject.tsx"),
    route("/grammar/:id", "./grammar/grammar.tsx"),
    route("/grammar", "./grammar/grammar-index.tsx"),
    route("/reading-practice", "./reading-practice/reading-practice.tsx"),
    route("/search", "./search/search.tsx"),
    route("/settings", "./settings/settings.tsx"),
    route("/login", "./auth/login.tsx"),
    route("/register", "./auth/register.tsx"),
    route("/profile", "./profile/profile.tsx")
] satisfies RouteConfig;
