
export interface Subject {
    Id: number;
    Object: string;
    Url: string;
    DataUpdatedAt: string;
    Data: {
        Characters: string;
        Meanings: Array<{
            Meaning: string;
            Primary: boolean;
            AcceptedAnswer: boolean;
        }>;
        Readings?: Array<{
            Reading: string;
            Primary: boolean;
            AcceptedAnswer: boolean;
            Type: string;
        }>;
        Level?: number;
        LessonPosition?: number;
        MeaningMnemonic?: string;
        ReadingMnemonic?: string;
        PartOfSpeech?: string[];
        [key: string]: any;
    };
}
