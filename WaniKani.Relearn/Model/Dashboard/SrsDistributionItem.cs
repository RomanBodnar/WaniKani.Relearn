namespace WaniKani.Relearn.Model.Dashboard;

public class SrsDistributionItem(
    string stage,
    int radicals,
    int kanji,
    int vocabulary)
{
    public string Stage { get; set; } = stage;
    
    public int Radicals { get; set; } = radicals;
    
    public int Kanji { get; set; } = kanji;

    public int Vocabulary { get; set; } = vocabulary;
}
