import type { Subject } from "~/hooks/Subject";

interface SubjectCharacterProps {
  subject: {
    Characters: string | null;
    CharacterImages?: Array<{ url: string; content_type: string; metadata: any }>;
  };
  className?: string;
}

export function SubjectCharacter({ subject, className }: SubjectCharacterProps) {
  if (subject.Characters) {
    return <span className={className}>{subject.Characters}</span>;
  }

  const svgImage = subject.CharacterImages?.find(
    (img) => img.content_type === "image/svg+xml" && img.metadata?.inline_styles === true
  );

  if (svgImage) {
    return (
      <img
        src={svgImage.url}
        alt="Radical character"
        className={className}
        style={{ 
          filter: "invert(1) brightness(100)",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain"
        }}
      />
    );
  }

  const pngImage = subject.CharacterImages?.find((img) => img.content_type === "image/png");
  if (pngImage) {
    return (
      <img
        src={pngImage.url}
        alt="Radical character"
        className={className}
        style={{ 
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain"
        }}
      />
    );
  }

  return <span className={className}>?</span>;
}
