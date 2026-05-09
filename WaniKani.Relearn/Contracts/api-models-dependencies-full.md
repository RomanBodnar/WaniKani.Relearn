classDiagram
    class IResource~T~ {
        <<interface>>
    }
    class CollectionResource~T~ {
        +Data: IReadOnlyCollection~SingleResource~T~~
        +Pages: Pagination
    }
    class SingleResource~T~ {
        +Data: T
    }
    class Pagination
    class Assignment
    class Review
    class ReviewStatistic
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

    IResource~T~ <|.. CollectionResource~T~
    IResource~T~ <|.. SingleResource~T~
    CollectionResource~T~ --> Pagination
    CollectionResource~T~ --> SingleResource~T~
    SingleResource~T~ --> Assignment : T
    SingleResource~T~ --> Review : T
    SingleResource~T~ --> ReviewStatistic : T
    SingleResource~T~ --> Subject : T

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