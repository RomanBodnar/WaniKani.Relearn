import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "WaniKani:Relearn" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <h1 style={{ color: "cyan", textAlign: "center" }}>Home Page</h1>
      
      <hr />
    </>
  );
}
