import { useAppSettings } from "~/hooks/useAppSettings";
import "./FloatingWatermarks.css";

const WATERMARK_CHARS = ["学", "日", "本", "語", "漢", "字", "読", "書"];

interface FloatingWatermarksProps {
  /** Which characters to show. Defaults to a curated set of kanji. */
  chars?: string[];
}

export const FloatingWatermarks = ({ chars = WATERMARK_CHARS }: FloatingWatermarksProps) => {
  const { settings } = useAppSettings();
  if (!settings.floatingWatermarks) return null;
  return (
    <div className="floating-watermarks" aria-hidden="true">
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="floating-char"
          style={{
            "--float-delay": `${i * -3.5}s`,
            "--float-x": `${12 + (i * 73 % 76)}%`,
            "--float-size": `${80 + (i * 37 % 60)}px`,
          } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
