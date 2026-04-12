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
      <h1 className="text-cyan-500 text-center text-3xl font-bold my-8">Home Page</h1>
      
      <hr />
    </>
  );
}
