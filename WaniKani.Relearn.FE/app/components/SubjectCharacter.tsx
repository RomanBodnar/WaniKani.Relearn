import type { Subject } from "~/hooks/Subject";

interface SubjectCharacterProps {
  subject: {
    Characters: string | null;
    CharacterImages?: Array<{ url: string; content_type: string; metadata: any }>;
    Slug: string;
  };
  className?: string;
}

export function SubjectCharacter({ subject, className }: SubjectCharacterProps) {
  const combinedClassName = `${className || ""}`.trim();
  
  if (subject.Characters) {
    return <span className={combinedClassName}>{subject.Characters}</span>;
  }
  
  const svgImage = subject.CharacterImages?.find(
    (img) => img.content_type === "image/svg+xml" && img.metadata?.inline_styles === true
  );

  if (svgImage) {
    return (
      <img
        src={svgImage.url}
        alt={subject.Slug}
        className={`${combinedClassName} subject-character-img subject-character-svg`}
        style={{
          filter: "invert(1) brightness(100)",
        }}
      />
    );
  }

  const pngImage = subject.CharacterImages?.find((img) => img.content_type === "image/png");
  if (pngImage) {
    return (
      <img
        src={pngImage.url}
        alt={subject.Slug}
        className={`${combinedClassName} subject-character-img subject-character-png`}
      />
    );
  }

  return <span className={combinedClassName}>?</span>;
}
