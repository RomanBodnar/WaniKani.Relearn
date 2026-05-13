import type { Route } from "./+types/home";
import "./home.css";
import {
  SearchHero,
  NavigationHub
} from "../components/home/HomeSections";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "bonpom | Learn Japanese" },
    { name: "description", content: "A modern way to learn Kanji, Vocabulary, and Grammar." },
  ];
}

export default function Home() {


  return (
    <div className="home-page">
      <SearchHero />


      <NavigationHub />



    </div>
  );
}

