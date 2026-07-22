import type { Route } from "./+types/home";
import "./home.css";
import {
  ReadingHeroHeader,
  LiveSentenceDemo,
  QuickLevelSelector,
  FeatureShowcaseGrid,
  HomeDivider
} from "../components/home/HomeSections";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "bonpom | Japanese Reading Practice" },
    { name: "description", content: "Master Japanese reading comprehension with real WaniKani context sentences, interactive breakdowns, and instant item lookup." },
  ];
}

export default function Home() {
  return (
    <div className="home-page">
      <ReadingHeroHeader />
      <LiveSentenceDemo />
      <HomeDivider />
      <QuickLevelSelector />
      <FeatureShowcaseGrid />
    </div>
  );
}
