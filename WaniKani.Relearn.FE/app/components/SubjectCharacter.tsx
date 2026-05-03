import type { Subject } from "~/hooks/Subject";

interface SubjectCharacterProps {
  subject: {
    Characters: string | null;
    CharacterImages?: Array<{ url: string; content_type: string; metadata: any }>;
    Slug?: string;
  };
  className?: string;
}

// Load all radical images from the assets folder
const localRadicalImages = import.meta.glob("../assets/radical-images/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Create a mapping from slug (filename) to the imported URL
const slugToLocalUrl: Record<string, string> = {};
Object.entries(localRadicalImages).forEach(([path, url]) => {
  const filename = path.split("/").pop()?.replace(".svg", "");
  if (filename) {
    slugToLocalUrl[filename] = url;
  }
});

export function SubjectCharacter({ subject, className }: SubjectCharacterProps) {
  const combinedClassName = `${className || ""}`.trim();
  
  if (subject.Characters) {
    return <span className={combinedClassName}>{subject.Characters}</span>;
  }
  
  // Check if we have a local image for this slug
  if (subject.Slug && slugToLocalUrl[subject.Slug]) {
    return (
      <img
        src={slugToLocalUrl[subject.Slug]}
        alt={subject.Slug}
        className={`${combinedClassName} subject-character-img subject-character-svg local-radical-img`.trim()}
        style={{
          filter: "brightness(0) invert(1)",
        }}
      />
    );
  }
  
  const svgImage = subject.CharacterImages?.find(
    (img) => img.content_type === "image/svg+xml" && img.metadata?.inline_styles === true
  );

  if (svgImage) {
    return (
      <img
        src={svgImage.url}
        alt={subject.Slug || "radical"}
        className={`${combinedClassName} subject-character-img subject-character-svg`.trim()}
        style={{
          filter: "brightness(0) invert(1)",
        }}
      />
    );
  }

  const pngImage = subject.CharacterImages?.find((img) => img.content_type === "image/png");
  if (pngImage) {
    return (
      <img
        src={pngImage.url}
        alt={subject.Slug || "radical"}
        className={`${combinedClassName} subject-character-img subject-character-png`}
      />
    );
  }

  return <span className={combinedClassName}>?</span>;
}
