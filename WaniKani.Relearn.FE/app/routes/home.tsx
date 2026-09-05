import type { Route } from "./+types/home";
import "./home.css";
import {
  ReadingHeroHeader,
  CorePillarsHub,
  LiveSentenceDemo,
  QuickLevelSelector,
  FeatureShowcaseGrid,
  HomeDivider
} from "../components/home/HomeSections";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "bonpom | Japanese Study & Practice Companion" },
    { name: "description", content: "Interactive verb conjugation exercises, sentence reading practice with instant word breakdowns, and comprehensive WaniKani vocabulary decks." },
  ];
}

export default function Home() {
  return (
    <div className="home-page">
      <ReadingHeroHeader />
      <CorePillarsHub />
      <HomeDivider />
      <LiveSentenceDemo />
      <QuickLevelSelector />
      <FeatureShowcaseGrid />
    </div>
  );
}
