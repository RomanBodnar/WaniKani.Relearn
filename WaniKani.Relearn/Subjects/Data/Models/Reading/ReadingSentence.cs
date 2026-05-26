using Newtonsoft.Json;

namespace WaniKani.Relearn.Subjects.Data.Models.Reading;

public record ReadingSentence
{
    public required string Ja { get; init; }
    public required string En { get; init; }
    public int Level { get; init; }
    public required List<SubjectReference> SourceVocabulary { get; init; }
    public required List<SubjectReference> KanjiInSentence { get; init; }
    public List<Morpheme> Morphemes { get; init; }
}

public record Morpheme
{
    public int? SubjectId { get; set; }

    public string? CombinedForm { get; set; }

    [JsonProperty("surface")]
    public string Surface { get; init; }
    [JsonProperty("conjugation_type")]
    public string ConjugationType { get; init; }
    [JsonProperty("conjugation_form")]
    public string ConjugationForm { get; init; }
    [JsonProperty("lemma_reading")]
    public string LemmaReading { get; init; }
    [JsonProperty("lemma")]
    public string Lemma { get; init; }
    [JsonProperty("orth")]
    public string Orth { get; init; }
    [JsonProperty("pron")]
    public string Pron { get; init; }
    public PosPart Pos1 { get; init; }
    public bool ShouldSerializePos1() => !string.IsNullOrEmpty(Pos1.Ja) && Pos1.Ja != "*";
    public PosPart Pos2 { get; init; }
    public bool ShouldSerializePos2() => !string.IsNullOrEmpty(Pos2.Ja) && Pos2.Ja != "*";
    public PosPart Pos3 { get; init; }
    public bool ShouldSerializePos3() => !string.IsNullOrEmpty(Pos3.Ja) && Pos3.Ja != "*";
    public PosPart Pos4 { get; init; }
    public bool ShouldSerializePos4() => !string.IsNullOrEmpty(Pos4.Ja) && Pos4.Ja != "*";
}

public record PosPart
{
    public string Ja { get; init; }
    public string En { get; init; }
}