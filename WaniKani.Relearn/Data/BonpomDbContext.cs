using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Data.Entities;

namespace WaniKani.Relearn.Data;

public class BonpomDbContext : DbContext
{
    public BonpomDbContext(DbContextOptions<BonpomDbContext> options) : base(options)
    {
    }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<UserCredentialsEntity> UserCredentials => Set<UserCredentialsEntity>();
    public DbSet<SubjectEntity> Subjects => Set<SubjectEntity>();
    public DbSet<SubjectMeaningEntity> SubjectMeanings => Set<SubjectMeaningEntity>();
    public DbSet<SubjectAuxiliaryMeaningEntity> SubjectAuxiliaryMeanings => Set<SubjectAuxiliaryMeaningEntity>();
    public DbSet<KanjiDetailsEntity> KanjiDetails => Set<KanjiDetailsEntity>();
    public DbSet<KanjiReadingEntity> KanjiReadings => Set<KanjiReadingEntity>();
    public DbSet<VocabularyDetailsEntity> VocabularyDetails => Set<VocabularyDetailsEntity>();
    public DbSet<VocabularyReadingEntity> VocabularyReadings => Set<VocabularyReadingEntity>();
    public DbSet<VocabularyPartOfSpeechEntity> VocabularyPartsOfSpeech => Set<VocabularyPartOfSpeechEntity>();
    public DbSet<VocabularyPronunciationAudioEntity> VocabularyPronunciationAudios => Set<VocabularyPronunciationAudioEntity>();
    public DbSet<RadicalCharacterImageEntity> RadicalCharacterImages => Set<RadicalCharacterImageEntity>();
    public DbSet<SubjectRelationshipEntity> SubjectRelationships => Set<SubjectRelationshipEntity>();
    public DbSet<ContextSentenceEntity> ContextSentences => Set<ContextSentenceEntity>();
    public DbSet<SentenceSubjectReferenceEntity> SentenceSubjectReferences => Set<SentenceSubjectReferenceEntity>();
    public DbSet<SentenceMorphemeEntity> SentenceMorphemes => Set<SentenceMorphemeEntity>();
    public DbSet<UserMyBoxEntity> UserMyBoxItems => Set<UserMyBoxEntity>();
    public DbSet<UserPracticedSentenceEntity> UserPracticedSentences => Set<UserPracticedSentenceEntity>();
    public DbSet<UserTranslationAttemptEntity> UserTranslationAttempts => Set<UserTranslationAttemptEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Auth & Users
        modelBuilder.Entity<UserEntity>(b =>
        {
            b.ToTable("users");
            b.HasKey(u => u.Id);
            b.Property(u => u.Id).HasColumnName("id").HasMaxLength(36);
            b.Property(u => u.Username).HasColumnName("username").HasMaxLength(100).IsRequired();
            b.Property(u => u.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            b.Property(u => u.CreatedAt).HasColumnName("created_at");

            b.HasIndex(u => u.Username).IsUnique();
            b.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<UserCredentialsEntity>(b =>
        {
            b.ToTable("user_credentials");
            b.HasKey(uc => uc.UserId);
            b.Property(uc => uc.UserId).HasColumnName("user_id").HasMaxLength(36);
            b.Property(uc => uc.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            b.Property(uc => uc.PasswordHash).HasColumnName("password_hash").IsRequired();
            b.Property(uc => uc.CreatedAt).HasColumnName("created_at");
            b.Property(uc => uc.PasswordLastChanged).HasColumnName("password_last_changed");

            b.HasOne(uc => uc.User)
                .WithOne(u => u.Credentials)
                .HasForeignKey<UserCredentialsEntity>(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 2. Core Subjects
        modelBuilder.Entity<SubjectEntity>(b =>
        {
            b.ToTable("subjects");
            b.HasKey(s => s.Id);
            b.Property(s => s.Id).HasColumnName("id").ValueGeneratedNever();
            b.Property(s => s.ObjectType).HasColumnName("object_type").HasMaxLength(32).IsRequired();
            b.Property(s => s.Slug).HasColumnName("slug").HasMaxLength(255).IsRequired();
            b.Property(s => s.Characters).HasColumnName("characters").HasMaxLength(255);
            b.Property(s => s.MeaningMnemonic).HasColumnName("meaning_mnemonic").IsRequired();
            b.Property(s => s.WaniKaniApiUrl).HasColumnName("wanikani_api_url");
            b.Property(s => s.WaniKaniDocumentUrl).HasColumnName("wanikani_document_url").IsRequired();
            b.Property(s => s.Level).HasColumnName("level");
            b.Property(s => s.SpacedRepetitionSystemId).HasColumnName("spaced_repetition_system_id");
            b.Property(s => s.CreatedAt).HasColumnName("created_at");
            b.Property(s => s.HiddenAt).HasColumnName("hidden_at");
            b.Property(s => s.DataUpdatedAt).HasColumnName("data_updated_at");

            b.HasIndex(s => s.ObjectType);
            b.HasIndex(s => s.Level);
            b.HasIndex(s => s.Slug);
        });

        modelBuilder.Entity<SubjectMeaningEntity>(b =>
        {
            b.ToTable("subject_meanings");
            b.HasKey(sm => sm.Id);
            b.Property(sm => sm.Id).HasColumnName("id");
            b.Property(sm => sm.SubjectId).HasColumnName("subject_id");
            b.Property(sm => sm.Meaning).HasColumnName("meaning").HasMaxLength(255).IsRequired();
            b.Property(sm => sm.IsPrimary).HasColumnName("is_primary");
            b.Property(sm => sm.AcceptedAnswer).HasColumnName("accepted_answer");

            b.HasOne(sm => sm.Subject)
                .WithMany(s => s.Meanings)
                .HasForeignKey(sm => sm.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SubjectAuxiliaryMeaningEntity>(b =>
        {
            b.ToTable("subject_auxiliary_meanings");
            b.HasKey(sam => sam.Id);
            b.Property(sam => sam.Id).HasColumnName("id");
            b.Property(sam => sam.SubjectId).HasColumnName("subject_id");
            b.Property(sam => sam.Meaning).HasColumnName("meaning").HasMaxLength(255).IsRequired();
            b.Property(sam => sam.Type).HasColumnName("type").HasMaxLength(32).IsRequired();

            b.HasOne(sam => sam.Subject)
                .WithMany(s => s.AuxiliaryMeanings)
                .HasForeignKey(sam => sam.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 3. Kanji Details & Readings
        modelBuilder.Entity<KanjiDetailsEntity>(b =>
        {
            b.ToTable("kanji_details");
            b.HasKey(kd => kd.SubjectId);
            b.Property(kd => kd.SubjectId).HasColumnName("subject_id").ValueGeneratedNever();
            b.Property(kd => kd.MeaningHint).HasColumnName("meaning_hint");
            b.Property(kd => kd.ReadingHint).HasColumnName("reading_hint");
            b.Property(kd => kd.ReadingMnemonic).HasColumnName("reading_mnemonic").IsRequired();
            b.Property(kd => kd.JlptLevel).HasColumnName("jlpt_level").HasMaxLength(10);
            b.Property(kd => kd.JoyoGrade).HasColumnName("joyo_grade").HasMaxLength(10);

            b.HasOne(kd => kd.Subject)
                .WithOne(s => s.KanjiDetails)
                .HasForeignKey<KanjiDetailsEntity>(kd => kd.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<KanjiReadingEntity>(b =>
        {
            b.ToTable("kanji_readings");
            b.HasKey(kr => kr.Id);
            b.Property(kr => kr.Id).HasColumnName("id");
            b.Property(kr => kr.SubjectId).HasColumnName("subject_id");
            b.Property(kr => kr.Reading).HasColumnName("reading").HasMaxLength(255).IsRequired();
            b.Property(kr => kr.Type).HasColumnName("type").HasMaxLength(32).IsRequired();
            b.Property(kr => kr.IsPrimary).HasColumnName("is_primary");
            b.Property(kr => kr.AcceptedAnswer).HasColumnName("accepted_answer");

            b.HasOne(kr => kr.Subject)
                .WithMany(s => s.KanjiReadings)
                .HasForeignKey(kr => kr.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 4. Vocabulary Details, Readings, POS & Audio
        modelBuilder.Entity<VocabularyDetailsEntity>(b =>
        {
            b.ToTable("vocabulary_details");
            b.HasKey(vd => vd.SubjectId);
            b.Property(vd => vd.SubjectId).HasColumnName("subject_id").ValueGeneratedNever();
            b.Property(vd => vd.ReadingMnemonic).HasColumnName("reading_mnemonic");

            b.HasOne(vd => vd.Subject)
                .WithOne(s => s.VocabularyDetails)
                .HasForeignKey<VocabularyDetailsEntity>(vd => vd.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VocabularyReadingEntity>(b =>
        {
            b.ToTable("vocabulary_readings");
            b.HasKey(vr => vr.Id);
            b.Property(vr => vr.Id).HasColumnName("id");
            b.Property(vr => vr.SubjectId).HasColumnName("subject_id");
            b.Property(vr => vr.Reading).HasColumnName("reading").HasMaxLength(255).IsRequired();
            b.Property(vr => vr.IsPrimary).HasColumnName("is_primary");
            b.Property(vr => vr.AcceptedAnswer).HasColumnName("accepted_answer");

            b.HasOne(vr => vr.Subject)
                .WithMany(s => s.VocabularyReadings)
                .HasForeignKey(vr => vr.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VocabularyPartOfSpeechEntity>(b =>
        {
            b.ToTable("vocabulary_parts_of_speech");
            b.HasKey(vpos => new { vpos.SubjectId, vpos.PartOfSpeech });
            b.Property(vpos => vpos.SubjectId).HasColumnName("subject_id");
            b.Property(vpos => vpos.PartOfSpeech).HasColumnName("part_of_speech").HasMaxLength(100);

            b.HasOne(vpos => vpos.Subject)
                .WithMany(s => s.PartsOfSpeech)
                .HasForeignKey(vpos => vpos.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VocabularyPronunciationAudioEntity>(b =>
        {
            b.ToTable("vocabulary_pronunciation_audios");
            b.HasKey(vpa => vpa.Id);
            b.Property(vpa => vpa.Id).HasColumnName("id");
            b.Property(vpa => vpa.SubjectId).HasColumnName("subject_id");
            b.Property(vpa => vpa.Url).HasColumnName("url").IsRequired();
            b.Property(vpa => vpa.ContentType).HasColumnName("content_type").HasMaxLength(100).IsRequired();
            b.Property(vpa => vpa.Gender).HasColumnName("gender").HasMaxLength(20).IsRequired();
            b.Property(vpa => vpa.SourceId).HasColumnName("source_id");
            b.Property(vpa => vpa.Pronunciation).HasColumnName("pronunciation").HasMaxLength(255).IsRequired();
            b.Property(vpa => vpa.VoiceActorId).HasColumnName("voice_actor_id").HasMaxLength(100);
            b.Property(vpa => vpa.VoiceActorName).HasColumnName("voice_actor_name").HasMaxLength(255);
            b.Property(vpa => vpa.VoiceDescription).HasColumnName("voice_description");

            b.HasOne(vpa => vpa.Subject)
                .WithMany(s => s.PronunciationAudios)
                .HasForeignKey(vpa => vpa.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 5. Radical Images
        modelBuilder.Entity<RadicalCharacterImageEntity>(b =>
        {
            b.ToTable("radical_character_images");
            b.HasKey(rci => rci.Id);
            b.Property(rci => rci.Id).HasColumnName("id");
            b.Property(rci => rci.SubjectId).HasColumnName("subject_id");
            b.Property(rci => rci.Url).HasColumnName("url").IsRequired();
            b.Property(rci => rci.ContentType).HasColumnName("content_type").HasMaxLength(100).IsRequired();
            b.Property(rci => rci.MetadataJson).HasColumnName("metadata_json").HasColumnType("jsonb");

            b.HasOne(rci => rci.Subject)
                .WithMany(s => s.RadicalCharacterImages)
                .HasForeignKey(rci => rci.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 6. Subject Relationships
        modelBuilder.Entity<SubjectRelationshipEntity>(b =>
        {
            b.ToTable("subject_relationships");
            b.HasKey(sr => new { sr.ParentSubjectId, sr.ChildSubjectId, sr.RelationshipType });
            b.Property(sr => sr.ParentSubjectId).HasColumnName("parent_subject_id");
            b.Property(sr => sr.ChildSubjectId).HasColumnName("child_subject_id");
            b.Property(sr => sr.RelationshipType).HasColumnName("relationship_type").HasMaxLength(32);

            b.HasOne(sr => sr.ParentSubject)
                .WithMany(s => s.ParentRelationships)
                .HasForeignKey(sr => sr.ParentSubjectId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(sr => sr.ChildSubject)
                .WithMany(s => s.ChildRelationships)
                .HasForeignKey(sr => sr.ChildSubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 7. Context Sentences & Morphemes
        modelBuilder.Entity<ContextSentenceEntity>(b =>
        {
            b.ToTable("context_sentences");
            b.HasKey(cs => cs.Id);
            b.Property(cs => cs.Id).HasColumnName("id");
            b.Property(cs => cs.SubjectId).HasColumnName("subject_id");
            b.Property(cs => cs.Ja).HasColumnName("ja").IsRequired();
            b.Property(cs => cs.En).HasColumnName("en").IsRequired();
            b.Property(cs => cs.Level).HasColumnName("level");

            b.HasOne(cs => cs.Subject)
                .WithMany(s => s.ContextSentences)
                .HasForeignKey(cs => cs.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SentenceSubjectReferenceEntity>(b =>
        {
            b.ToTable("sentence_subject_references");
            b.HasKey(ssr => new { ssr.SentenceId, ssr.SubjectId, ssr.ReferenceType });
            b.Property(ssr => ssr.SentenceId).HasColumnName("sentence_id");
            b.Property(ssr => ssr.SubjectId).HasColumnName("subject_id");
            b.Property(ssr => ssr.ReferenceType).HasColumnName("reference_type").HasMaxLength(32);

            b.HasOne(ssr => ssr.Sentence)
                .WithMany(cs => cs.SubjectReferences)
                .HasForeignKey(ssr => ssr.SentenceId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(ssr => ssr.Subject)
                .WithMany()
                .HasForeignKey(ssr => ssr.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SentenceMorphemeEntity>(b =>
        {
            b.ToTable("sentence_morphemes");
            b.HasKey(sm => sm.Id);
            b.Property(sm => sm.Id).HasColumnName("id");
            b.Property(sm => sm.SentenceId).HasColumnName("sentence_id");
            b.Property(sm => sm.SequenceOrder).HasColumnName("sequence_order");
            b.Property(sm => sm.SubjectId).HasColumnName("subject_id");
            b.Property(sm => sm.Surface).HasColumnName("surface").HasMaxLength(255).IsRequired();
            b.Property(sm => sm.Lemma).HasColumnName("lemma").HasMaxLength(255);
            b.Property(sm => sm.LemmaReading).HasColumnName("lemma_reading").HasMaxLength(255);
            b.Property(sm => sm.Orth).HasColumnName("orth").HasMaxLength(255);
            b.Property(sm => sm.Pron).HasColumnName("pron").HasMaxLength(255);
            b.Property(sm => sm.ConjugationType).HasColumnName("conjugation_type").HasMaxLength(100);
            b.Property(sm => sm.ConjugationForm).HasColumnName("conjugation_form").HasMaxLength(100);
            b.Property(sm => sm.Pos1Ja).HasColumnName("pos1_ja").HasMaxLength(100);
            b.Property(sm => sm.Pos1En).HasColumnName("pos1_en").HasMaxLength(100);
            b.Property(sm => sm.Pos2Ja).HasColumnName("pos2_ja").HasMaxLength(100);
            b.Property(sm => sm.Pos2En).HasColumnName("pos2_en").HasMaxLength(100);
            b.Property(sm => sm.Pos3Ja).HasColumnName("pos3_ja").HasMaxLength(100);
            b.Property(sm => sm.Pos3En).HasColumnName("pos3_en").HasMaxLength(100);
            b.Property(sm => sm.Pos4Ja).HasColumnName("pos4_ja").HasMaxLength(100);
            b.Property(sm => sm.Pos4En).HasColumnName("pos4_en").HasMaxLength(100);

            b.HasOne(sm => sm.Sentence)
                .WithMany(cs => cs.Morphemes)
                .HasForeignKey(sm => sm.SentenceId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(sm => sm.Subject)
                .WithMany()
                .HasForeignKey(sm => sm.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // 8. User Features: My Box, Practiced Sentences & Translation Attempts
        modelBuilder.Entity<UserMyBoxEntity>(b =>
        {
            b.ToTable("user_my_box");
            b.HasKey(mb => new { mb.UserId, mb.SubjectId });
            b.Property(mb => mb.UserId).HasColumnName("user_id").HasMaxLength(36);
            b.Property(mb => mb.SubjectId).HasColumnName("subject_id");
            b.Property(mb => mb.BookmarkedAt).HasColumnName("bookmarked_at");
            b.Property(mb => mb.Notes).HasColumnName("notes");

            b.HasOne(mb => mb.User)
                .WithMany(u => u.MyBoxItems)
                .HasForeignKey(mb => mb.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(mb => mb.Subject)
                .WithMany()
                .HasForeignKey(mb => mb.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserPracticedSentenceEntity>(b =>
        {
            b.ToTable("user_practiced_sentences");
            b.HasKey(ps => new { ps.UserId, ps.SentenceId });
            b.Property(ps => ps.UserId).HasColumnName("user_id").HasMaxLength(36);
            b.Property(ps => ps.SentenceId).HasColumnName("sentence_id");
            b.Property(ps => ps.MarkedAt).HasColumnName("marked_at");
            b.Property(ps => ps.PracticeCount).HasColumnName("practice_count");
            b.Property(ps => ps.LastPracticedAt).HasColumnName("last_practiced_at");

            b.HasOne(ps => ps.User)
                .WithMany(u => u.PracticedSentences)
                .HasForeignKey(ps => ps.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(ps => ps.Sentence)
                .WithMany(cs => cs.PracticedByUsers)
                .HasForeignKey(ps => ps.SentenceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserTranslationAttemptEntity>(b =>
        {
            b.ToTable("user_translation_attempts");
            b.HasKey(ta => ta.Id);
            b.Property(ta => ta.Id).HasColumnName("id");
            b.Property(ta => ta.UserId).HasColumnName("user_id").HasMaxLength(36);
            b.Property(ta => ta.SentenceId).HasColumnName("sentence_id");
            b.Property(ta => ta.UserTranslation).HasColumnName("user_translation").IsRequired();
            b.Property(ta => ta.ReferenceTranslation).HasColumnName("reference_translation");
            b.Property(ta => ta.IsCorrect).HasColumnName("is_correct");
            b.Property(ta => ta.SimilarityScore).HasColumnName("similarity_score").HasPrecision(5, 2);
            b.Property(ta => ta.Feedback).HasColumnName("feedback");
            b.Property(ta => ta.AttemptedAt).HasColumnName("attempted_at");

            b.HasOne(ta => ta.User)
                .WithMany(u => u.TranslationAttempts)
                .HasForeignKey(ta => ta.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(ta => ta.Sentence)
                .WithMany(cs => cs.TranslationAttempts)
                .HasForeignKey(ta => ta.SentenceId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
