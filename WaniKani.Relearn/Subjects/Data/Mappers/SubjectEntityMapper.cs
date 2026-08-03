using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Data.Entities;
using Models = WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Data.Mappers;

public static class SubjectEntityMapper
{
    public static Models.Kanji ToKanjiModel(SubjectEntity entity)
    {
        return new Models.Kanji
        {
            Id = entity.Id,
            Object = entity.ObjectType,
            Characters = entity.Characters,
            MeaningMnemonic = entity.MeaningMnemonic,
            Meanings = entity.Meanings.Select(m => new MeaningObject
            {
                Meaning = m.Meaning,
                Primary = m.IsPrimary,
                AcceptedAnswer = m.AcceptedAnswer
            }).ToList(),
            AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning
            {
                Meaning = am.Meaning,
                Type = am.Type
            }).ToList(),
            Slug = entity.Slug,
            WaniKaniApiUrl = entity.WaniKaniApiUrl,
            WaniKaniDocumentUrl = entity.WaniKaniDocumentUrl,
            DataUpdatedAt = entity.DataUpdatedAt,
            CreatedAt = entity.CreatedAt,
            HiddenAt = entity.HiddenAt,
            Level = entity.Level,
            SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
            
            ReadingMnemonic = entity.KanjiDetails?.ReadingMnemonic ?? "",
            MeaningHint = entity.KanjiDetails?.MeaningHint,
            ReadingHint = entity.KanjiDetails?.ReadingHint,
            JlptLevel = entity.KanjiDetails?.JlptLevel,
            JoyoGrade = entity.KanjiDetails?.JoyoGrade,
            Readings = entity.KanjiReadings.Select(r => new KanjiReading
            {
                Reading = r.Reading,
                Type = r.Type,
                Primary = r.IsPrimary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList(),
            AmalgamationSubjectIds = entity.ParentRelationships
                .Where(r => r.RelationshipType == "amalgamation")
                .Select(r => r.ChildSubjectId)
                .ToList(),
            ComponentSubjectIds = entity.ParentRelationships
                .Where(r => r.RelationshipType == "component")
                .Select(r => r.ChildSubjectId)
                .ToList(),
            VisuallySimilarSubjectIds = entity.ParentRelationships
                .Where(r => r.RelationshipType == "visually_similar")
                .Select(r => r.ChildSubjectId)
                .ToList()
        };
    }

    public static Models.Radical ToRadicalModel(SubjectEntity entity)
    {
        return new Models.Radical
        {
            Id = entity.Id,
            Object = entity.ObjectType,
            Characters = entity.Characters,
            MeaningMnemonic = entity.MeaningMnemonic,
            Meanings = entity.Meanings.Select(m => new MeaningObject
            {
                Meaning = m.Meaning,
                Primary = m.IsPrimary,
                AcceptedAnswer = m.AcceptedAnswer
            }).ToList(),
            AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning
            {
                Meaning = am.Meaning,
                Type = am.Type
            }).ToList(),
            Slug = entity.Slug,
            WaniKaniApiUrl = entity.WaniKaniApiUrl,
            WaniKaniDocumentUrl = entity.WaniKaniDocumentUrl,
            DataUpdatedAt = entity.DataUpdatedAt,
            CreatedAt = entity.CreatedAt,
            HiddenAt = entity.HiddenAt,
            Level = entity.Level,
            SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
            
            AmalgamationSubjectIds = entity.ParentRelationships
                .Where(r => r.RelationshipType == "amalgamation")
                .Select(r => r.ChildSubjectId)
                .ToList(),
            CharacterImages = entity.RadicalCharacterImages.Select(img => new CharacterImage
            {
                Url = img.Url,
                ContentType = img.ContentType
            }).ToList()
        };
    }

    public static Models.Vocabulary ToVocabularyModel(SubjectEntity entity)
    {
        return new Models.Vocabulary
        {
            Id = entity.Id,
            Object = entity.ObjectType,
            Characters = entity.Characters,
            MeaningMnemonic = entity.MeaningMnemonic,
            Meanings = entity.Meanings.Select(m => new MeaningObject
            {
                Meaning = m.Meaning,
                Primary = m.IsPrimary,
                AcceptedAnswer = m.AcceptedAnswer
            }).ToList(),
            AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning
            {
                Meaning = am.Meaning,
                Type = am.Type
            }).ToList(),
            Slug = entity.Slug,
            WaniKaniApiUrl = entity.WaniKaniApiUrl,
            WaniKaniDocumentUrl = entity.WaniKaniDocumentUrl,
            DataUpdatedAt = entity.DataUpdatedAt,
            CreatedAt = entity.CreatedAt,
            HiddenAt = entity.HiddenAt,
            Level = entity.Level,
            SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
            
            ReadingMnemonic = entity.VocabularyDetails?.ReadingMnemonic,
            ComponentSubjectIds = entity.ParentRelationships
                .Where(r => r.RelationshipType == "component")
                .Select(r => r.ChildSubjectId)
                .ToList(),
            PartsOfSpeech = entity.PartsOfSpeech.Select(pos => pos.PartOfSpeech).ToList(),
            Readings = entity.VocabularyReadings.Select(r => new Models.VocabularyReading
            {
                Reading = r.Reading,
                Primary = r.IsPrimary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList(),
            ContextSentences = entity.ContextSentences.Select(cs => new Models.ContextSentence
            {
                En = cs.En,
                Ja = cs.Ja
            }).ToList(),
            PronunciationAudios = entity.PronunciationAudios.Select(pa => new Models.PronunciationAudio
            {
                Url = pa.Url,
                ContentType = pa.ContentType,
                Metadata = new Models.PronunciationAudioMetadata
                {
                    Gender = pa.Gender,
                    SourceId = pa.SourceId,
                    Pronunciation = pa.Pronunciation,
                    VoiceActorId = pa.VoiceActorId ?? "",
                    VoiceActorName = pa.VoiceActorName ?? "",
                    VoiceDescription = pa.VoiceDescription ?? ""
                }
            }).ToList()
        };
    }

    public static SingleResource<T> ToSingleResource<T>(SubjectEntity entity) where T : Subject
    {
        if (typeof(T) == typeof(Kanji))
        {
            var kanji = new Kanji
            {
                AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning { Meaning = am.Meaning, Type = am.Type }).ToList(),
                Characters = entity.Characters,
                CreatedAt = entity.CreatedAt,
                DocumentUrl = entity.WaniKaniDocumentUrl,
                HiddenAt = entity.HiddenAt,
                Level = entity.Level,
                MeaningMnemonic = entity.MeaningMnemonic,
                Meanings = entity.Meanings.Select(m => new MeaningObject { Meaning = m.Meaning, Primary = m.IsPrimary, AcceptedAnswer = m.AcceptedAnswer }).ToList(),
                Slug = entity.Slug,
                SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
                AmalgamationSubjectIds = entity.ParentRelationships.Where(r => r.RelationshipType == "amalgamation").Select(r => r.ChildSubjectId).ToList(),
                ComponentSubjectIds = entity.ParentRelationships.Where(r => r.RelationshipType == "component").Select(r => r.ChildSubjectId).ToList(),
                MeaningHint = entity.KanjiDetails?.MeaningHint,
                ReadingHint = entity.KanjiDetails?.ReadingHint,
                ReadingMnemonic = entity.KanjiDetails?.ReadingMnemonic ?? "",
                Readings = entity.KanjiReadings.Select(r => new KanjiReading { Reading = r.Reading, Type = r.Type, Primary = r.IsPrimary, AcceptedAnswer = r.AcceptedAnswer }).ToList(),
                VisuallySimilarSubjectIds = entity.ParentRelationships.Where(r => r.RelationshipType == "visually_similar").Select(r => r.ChildSubjectId).ToList()
            };

            return new SingleResource<T>
            {
                Id = entity.Id,
                Object = entity.ObjectType,
                Url = entity.WaniKaniApiUrl ?? "",
                DataUpdatedAt = entity.DataUpdatedAt,
                Data = (T)(object)kanji
            };
        }
        else if (typeof(T) == typeof(Radical))
        {
            var radical = new Radical
            {
                AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning { Meaning = am.Meaning, Type = am.Type }).ToList(),
                Characters = entity.Characters,
                CreatedAt = entity.CreatedAt,
                DocumentUrl = entity.WaniKaniDocumentUrl,
                HiddenAt = entity.HiddenAt,
                Level = entity.Level,
                MeaningMnemonic = entity.MeaningMnemonic,
                Meanings = entity.Meanings.Select(m => new MeaningObject { Meaning = m.Meaning, Primary = m.IsPrimary, AcceptedAnswer = m.AcceptedAnswer }).ToList(),
                Slug = entity.Slug,
                SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
                AmalgamationSubjectIds = entity.ParentRelationships.Where(r => r.RelationshipType == "amalgamation").Select(r => r.ChildSubjectId).ToList(),
                CharacterImages = entity.RadicalCharacterImages.Select(img => new CharacterImage { Url = img.Url, ContentType = img.ContentType }).ToList()
            };

            return new SingleResource<T>
            {
                Id = entity.Id,
                Object = entity.ObjectType,
                Url = entity.WaniKaniApiUrl ?? "",
                DataUpdatedAt = entity.DataUpdatedAt,
                Data = (T)(object)radical
            };
        }
        else if (typeof(T) == typeof(Vocabulary))
        {
            var vocab = new Vocabulary
            {
                AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning { Meaning = am.Meaning, Type = am.Type }).ToList(),
                Characters = entity.Characters,
                CreatedAt = entity.CreatedAt,
                DocumentUrl = entity.WaniKaniDocumentUrl,
                HiddenAt = entity.HiddenAt,
                Level = entity.Level,
                MeaningMnemonic = entity.MeaningMnemonic,
                Meanings = entity.Meanings.Select(m => new MeaningObject { Meaning = m.Meaning, Primary = m.IsPrimary, AcceptedAnswer = m.AcceptedAnswer }).ToList(),
                Slug = entity.Slug,
                SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
                ComponentSubjectIds = entity.ParentRelationships.Where(r => r.RelationshipType == "component").Select(r => r.ChildSubjectId).ToList(),
                ContextSentences = entity.ContextSentences.Select(cs => new ContextSentence { En = cs.En, Ja = cs.Ja }).ToList(),
                PartsOfSpeech = entity.PartsOfSpeech.Select(pos => pos.PartOfSpeech).ToList(),
                PronunciationAudios = entity.PronunciationAudios.Select(pa => new PronunciationAudio
                {
                    Url = pa.Url,
                    ContentType = pa.ContentType,
                    Metadata = new PronunciationAudioMetadata
                    {
                        Gender = pa.Gender,
                        SourceId = pa.SourceId,
                        Pronunciation = pa.Pronunciation,
                        VoiceActorId = pa.VoiceActorId ?? "",
                        VoiceActorName = pa.VoiceActorName ?? "",
                        VoiceDescription = pa.VoiceDescription ?? ""
                    }
                }).ToList(),
                Readings = entity.VocabularyReadings.Select(r => new VocabularyReading { Reading = r.Reading, Primary = r.IsPrimary, AcceptedAnswer = r.AcceptedAnswer }).ToList(),
                ReadingMnemonic = entity.VocabularyDetails?.ReadingMnemonic ?? ""
            };

            return new SingleResource<T>
            {
                Id = entity.Id,
                Object = entity.ObjectType,
                Url = entity.WaniKaniApiUrl ?? "",
                DataUpdatedAt = entity.DataUpdatedAt,
                Data = (T)(object)vocab
            };
        }
        else if (typeof(T) == typeof(KanaVocabulary))
        {
            var kanaVocab = new KanaVocabulary
            {
                AuxiliaryMeanings = entity.AuxiliaryMeanings.Select(am => new AuxiliaryMeaning { Meaning = am.Meaning, Type = am.Type }).ToList(),
                Characters = entity.Characters,
                CreatedAt = entity.CreatedAt,
                DocumentUrl = entity.WaniKaniDocumentUrl,
                HiddenAt = entity.HiddenAt,
                Level = entity.Level,
                MeaningMnemonic = entity.MeaningMnemonic,
                Meanings = entity.Meanings.Select(m => new MeaningObject { Meaning = m.Meaning, Primary = m.IsPrimary, AcceptedAnswer = m.AcceptedAnswer }).ToList(),
                Slug = entity.Slug,
                SpacedRepetitionSystemId = entity.SpacedRepetitionSystemId,
                ContextSentences = entity.ContextSentences.Select(cs => new ContextSentence { En = cs.En, Ja = cs.Ja }).ToList(),
                PartsOfSpeech = entity.PartsOfSpeech.Select(pos => pos.PartOfSpeech).ToList(),
                PronunciationAudios = entity.PronunciationAudios.Select(pa => new PronunciationAudio
                {
                    Url = pa.Url,
                    ContentType = pa.ContentType,
                    Metadata = new PronunciationAudioMetadata
                    {
                        Gender = pa.Gender,
                        SourceId = pa.SourceId,
                        Pronunciation = pa.Pronunciation,
                        VoiceActorId = pa.VoiceActorId ?? "",
                        VoiceActorName = pa.VoiceActorName ?? "",
                        VoiceDescription = pa.VoiceDescription ?? ""
                    }
                }).ToList()
            };

            return new SingleResource<T>
            {
                Id = entity.Id,
                Object = entity.ObjectType,
                Url = entity.WaniKaniApiUrl ?? "",
                DataUpdatedAt = entity.DataUpdatedAt,
                Data = (T)(object)kanaVocab
            };
        }

        throw new ArgumentException($"Unsupported subject type: {typeof(T)}");
    }

    public static SubjectEntity ToEntity(Models.Subject model)
    {
        var entity = new SubjectEntity
        {
            Id = model.Id,
            ObjectType = model.Object,
            Slug = model.Slug,
            Characters = model.Characters,
            MeaningMnemonic = model.MeaningMnemonic,
            WaniKaniApiUrl = model.WaniKaniApiUrl,
            WaniKaniDocumentUrl = model.WaniKaniDocumentUrl,
            Level = model.Level,
            SpacedRepetitionSystemId = model.SpacedRepetitionSystemId,
            CreatedAt = model.CreatedAt,
            HiddenAt = model.HiddenAt,
            DataUpdatedAt = model.DataUpdatedAt,
            Meanings = model.Meanings.Select(m => new SubjectMeaningEntity
            {
                SubjectId = model.Id,
                Meaning = m.Meaning,
                IsPrimary = m.Primary,
                AcceptedAnswer = m.AcceptedAnswer
            }).ToList(),
            AuxiliaryMeanings = model.AuxiliaryMeanings.Select(am => new SubjectAuxiliaryMeaningEntity
            {
                SubjectId = model.Id,
                Meaning = am.Meaning,
                Type = am.Type
            }).ToList()
        };

        if (model is Models.Kanji kanji)
        {
            entity.KanjiDetails = new KanjiDetailsEntity
            {
                SubjectId = model.Id,
                MeaningHint = kanji.MeaningHint,
                ReadingHint = kanji.ReadingHint,
                ReadingMnemonic = kanji.ReadingMnemonic,
                JlptLevel = kanji.JlptLevel,
                JoyoGrade = kanji.JoyoGrade
            };
            entity.KanjiReadings = kanji.Readings.Select(r => new KanjiReadingEntity
            {
                SubjectId = model.Id,
                Reading = r.Reading,
                Type = r.Type,
                IsPrimary = r.Primary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList();
            entity.ParentRelationships = kanji.AmalgamationSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = model.Id,
                ChildSubjectId = childId,
                RelationshipType = "amalgamation"
            }).Concat(kanji.ComponentSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = model.Id,
                ChildSubjectId = childId,
                RelationshipType = "component"
            })).Concat(kanji.VisuallySimilarSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = model.Id,
                ChildSubjectId = childId,
                RelationshipType = "visually_similar"
            })).ToList();
        }
        else if (model is Models.Radical radical)
        {
            entity.RadicalCharacterImages = radical.CharacterImages.Select(img => new RadicalCharacterImageEntity
            {
                SubjectId = model.Id,
                Url = img.Url,
                ContentType = img.ContentType
            }).ToList();
            entity.ParentRelationships = radical.AmalgamationSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = model.Id,
                ChildSubjectId = childId,
                RelationshipType = "amalgamation"
            }).ToList();
        }
        else if (model is Models.Vocabulary vocab)
        {
            entity.VocabularyDetails = new VocabularyDetailsEntity
            {
                SubjectId = model.Id,
                ReadingMnemonic = vocab.ReadingMnemonic
            };
            entity.VocabularyReadings = vocab.Readings.Select(r => new VocabularyReadingEntity
            {
                SubjectId = model.Id,
                Reading = r.Reading,
                IsPrimary = r.Primary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList();
            entity.PartsOfSpeech = vocab.PartsOfSpeech.Select(pos => new VocabularyPartOfSpeechEntity
            {
                SubjectId = model.Id,
                PartOfSpeech = pos
            }).ToList();
            entity.ContextSentences = vocab.ContextSentences.Select(cs => new ContextSentenceEntity
            {
                SubjectId = model.Id,
                En = cs.En,
                Ja = cs.Ja
            }).ToList();
            entity.PronunciationAudios = vocab.PronunciationAudios.Select(pa => new VocabularyPronunciationAudioEntity
            {
                SubjectId = model.Id,
                Url = pa.Url,
                ContentType = pa.ContentType,
                Gender = pa.Metadata?.Gender ?? "",
                SourceId = pa.Metadata?.SourceId ?? 0,
                Pronunciation = pa.Metadata?.Pronunciation ?? "",
                VoiceActorId = pa.Metadata?.VoiceActorId,
                VoiceActorName = pa.Metadata?.VoiceActorName,
                VoiceDescription = pa.Metadata?.VoiceDescription
            }).ToList();
            entity.ParentRelationships = vocab.ComponentSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = model.Id,
                ChildSubjectId = childId,
                RelationshipType = "component"
            }).ToList();
        }

        return entity;
    }

    public static SubjectEntity ToEntity<T>(SingleResource<T> resource) where T : Subject
    {
        var data = resource.Data;
        var entity = new SubjectEntity
        {
            Id = resource.Id,
            ObjectType = resource.Object,
            Slug = data.Slug,
            Characters = data.Characters,
            MeaningMnemonic = data.MeaningMnemonic,
            WaniKaniApiUrl = resource.Url,
            WaniKaniDocumentUrl = data.DocumentUrl,
            Level = data.Level,
            SpacedRepetitionSystemId = data.SpacedRepetitionSystemId,
            CreatedAt = data.CreatedAt,
            HiddenAt = data.HiddenAt,
            DataUpdatedAt = resource.DataUpdatedAt ?? DateTime.UtcNow,
            Meanings = data.Meanings.Select(m => new SubjectMeaningEntity
            {
                SubjectId = resource.Id,
                Meaning = m.Meaning,
                IsPrimary = m.Primary,
                AcceptedAnswer = m.AcceptedAnswer
            }).ToList(),
            AuxiliaryMeanings = data.AuxiliaryMeanings.Select(am => new SubjectAuxiliaryMeaningEntity
            {
                SubjectId = resource.Id,
                Meaning = am.Meaning,
                Type = am.Type
            }).ToList()
        };

        if (data is Kanji kanji)
        {
            entity.KanjiDetails = new KanjiDetailsEntity
            {
                SubjectId = resource.Id,
                MeaningHint = kanji.MeaningHint,
                ReadingHint = kanji.ReadingHint,
                ReadingMnemonic = kanji.ReadingMnemonic
            };
            entity.KanjiReadings = kanji.Readings.Select(r => new KanjiReadingEntity
            {
                SubjectId = resource.Id,
                Reading = r.Reading,
                Type = r.Type,
                IsPrimary = r.Primary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList();
            entity.ParentRelationships = kanji.AmalgamationSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = resource.Id,
                ChildSubjectId = childId,
                RelationshipType = "amalgamation"
            }).Concat(kanji.ComponentSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = resource.Id,
                ChildSubjectId = childId,
                RelationshipType = "component"
            })).Concat(kanji.VisuallySimilarSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = resource.Id,
                ChildSubjectId = childId,
                RelationshipType = "visually_similar"
            })).ToList();
        }
        else if (data is Radical radical)
        {
            entity.RadicalCharacterImages = radical.CharacterImages.Select(img => new RadicalCharacterImageEntity
            {
                SubjectId = resource.Id,
                Url = img.Url,
                ContentType = img.ContentType
            }).ToList();
            entity.ParentRelationships = radical.AmalgamationSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = resource.Id,
                ChildSubjectId = childId,
                RelationshipType = "amalgamation"
            }).ToList();
        }
        else if (data is Vocabulary vocab)
        {
            entity.VocabularyDetails = new VocabularyDetailsEntity
            {
                SubjectId = resource.Id,
                ReadingMnemonic = vocab.ReadingMnemonic
            };
            entity.VocabularyReadings = vocab.Readings.Select(r => new VocabularyReadingEntity
            {
                SubjectId = resource.Id,
                Reading = r.Reading,
                IsPrimary = r.Primary,
                AcceptedAnswer = r.AcceptedAnswer
            }).ToList();
            entity.PartsOfSpeech = vocab.PartsOfSpeech.Select(pos => new VocabularyPartOfSpeechEntity
            {
                SubjectId = resource.Id,
                PartOfSpeech = pos
            }).ToList();
            entity.ContextSentences = vocab.ContextSentences.Select(cs => new ContextSentenceEntity
            {
                SubjectId = resource.Id,
                En = cs.En,
                Ja = cs.Ja
            }).ToList();
            entity.PronunciationAudios = vocab.PronunciationAudios.Select(pa => new VocabularyPronunciationAudioEntity
            {
                SubjectId = resource.Id,
                Url = pa.Url,
                ContentType = pa.ContentType,
                Gender = pa.Metadata?.Gender ?? "",
                SourceId = pa.Metadata?.SourceId ?? 0,
                Pronunciation = pa.Metadata?.Pronunciation ?? "",
                VoiceActorId = pa.Metadata?.VoiceActorId,
                VoiceActorName = pa.Metadata?.VoiceActorName,
                VoiceDescription = pa.Metadata?.VoiceDescription
            }).ToList();
            entity.ParentRelationships = vocab.ComponentSubjectIds.Select(childId => new SubjectRelationshipEntity
            {
                ParentSubjectId = resource.Id,
                ChildSubjectId = childId,
                RelationshipType = "component"
            }).ToList();
        }
        else if (data is KanaVocabulary kanaVocab)
        {
            entity.PartsOfSpeech = kanaVocab.PartsOfSpeech.Select(pos => new VocabularyPartOfSpeechEntity
            {
                SubjectId = resource.Id,
                PartOfSpeech = pos
            }).ToList();
            entity.ContextSentences = kanaVocab.ContextSentences.Select(cs => new ContextSentenceEntity
            {
                SubjectId = resource.Id,
                En = cs.En,
                Ja = cs.Ja
            }).ToList();
            entity.PronunciationAudios = kanaVocab.PronunciationAudios.Select(pa => new VocabularyPronunciationAudioEntity
            {
                SubjectId = resource.Id,
                Url = pa.Url,
                ContentType = pa.ContentType,
                Gender = pa.Metadata?.Gender ?? "",
                SourceId = pa.Metadata?.SourceId ?? 0,
                Pronunciation = pa.Metadata?.Pronunciation ?? "",
                VoiceActorId = pa.Metadata?.VoiceActorId,
                VoiceActorName = pa.Metadata?.VoiceActorName,
                VoiceDescription = pa.Metadata?.VoiceDescription
            }).ToList();
        }

        return entity;
    }
}
