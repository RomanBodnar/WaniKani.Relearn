import { Link } from "react-router";
import type { Route } from "./+types/home";
import { fetchSubjects } from "../hooks/useSubjects";
import "./home.css";
import {
  SearchHero,
  NavigationHub,
  DailySpotlight,
  BrowseGrid,
  HomeDivider
} from "../components/home/HomeSections";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "bonpom | Learn Japanese" },
    { name: "description", content: "A modern way to learn Kanji, Vocabulary, and Grammar." },
  ];
}

export async function clientLoader() {
  // Fetch some diverse data for the home page
  const [kanji, vocab] = await Promise.all([
    fetchSubjects("kanji", 1, 50),
    fetchSubjects("vocabulary", 1, 50)
  ]);

  // Pick a random subject for the spotlight
  const allLoaded = [...kanji.data, ...vocab.data];
  const spotlightIndex = Math.floor(Math.random() * allLoaded.length);
  const spotlight = allLoaded[spotlightIndex];

  // Pick some subjects for the browse grid
  const browse = allLoaded.slice(0, 12).sort(() => Math.random() - 0.5);

  return {
    spotlight,
    browse
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { spotlight, browse } = loaderData;

  return (
    <div className="home-page">
      <SearchHero />


      <NavigationHub />



      <div className="mt-20 text-center opacity-50 text-sm">
        <p>© 2026 bonpom. All characters jump out.</p>
      </div>
    </div>
  );
}

