# API Models Dependencies (Subjects Only)

```mermaid
classDiagram
    class Subject {
        +AuxiliaryMeanings: IReadOnlyCollection~AuxiliaryMeaning~
        +Meanings: IReadOnlyCollection~MeaningObject~
    }
    class Radical {
        +CharacterImages: IReadOnlyCollection~CharacterImage~
    }
    class Kanji {
        +Readings: IReadOnlyCollection~KanjiReading~
    }
    class Vocabulary {
        +ContextSentences: IReadOnlyCollection~ContextSentence~
        +PronunciationAudios: IReadOnlyCollection~PronunciationAudio~
        +Readings: IReadOnlyCollection~VocabularyReading~
    }
    class KanaVocabulary {
        +ContextSentences: IReadOnlyCollection~ContextSentence~
        +PronunciationAudios: IReadOnlyCollection~PronunciationAudio~
    }
    class AuxiliaryMeaning
    class MeaningObject
    class CharacterImage {
        +Metadata: object
    }
    class ImageSvgXmlMetadata
    class KanjiReading
    class ContextSentence
    class PronunciationAudio {
        +Metadata: PronunciationAudioMetadata
    }
    class PronunciationAudioMetadata
    class VocabularyReading

    Subject <|-- Radical
    Subject <|-- Kanji
    Subject <|-- Vocabulary
    Subject <|-- KanaVocabulary

    Subject --> AuxiliaryMeaning
    Subject --> MeaningObject
    Radical --> CharacterImage
    Kanji --> KanjiReading
    Vocabulary --> ContextSentence
    Vocabulary --> PronunciationAudio
    Vocabulary --> VocabularyReading
    KanaVocabulary --> ContextSentence
    KanaVocabulary --> PronunciationAudio
    PronunciationAudio --> PronunciationAudioMetadata
    CharacterImage --> ImageSvgXmlMetadata