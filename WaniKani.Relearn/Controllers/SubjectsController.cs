using WaniKani.Relearn.Api.Mappers;
using WaniKani.Relearn.Model.Assignments;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.Controllers;

[Route("api/subjects")]
[ApiController]
public class SubjectsController(
    SubjectsService subjectsService,
    KanjiMapper kanjiMapper,
    VocabularyMapper vocabularyMapper,
    RadicalMapper radicalMapper,
    KanaVocabularyMapper kanaVocabularyMapper) : ControllerBase
{
    [HttpGet("{type}")]
    public async Task<IActionResult> GetSubjects(
        [FromRoute] SubjectType type,
        [FromQuery] int? level = null
    )
    {
        object? result = type switch
        {
            SubjectType.Kanji => (await subjectsService.GetSubjects<Kanji>(type, level)).Select(kanjiMapper.Map),
            SubjectType.Vocabulary => (await subjectsService.GetSubjects<Vocabulary>(type, level)).Select(vocabularyMapper.Map),
            SubjectType.Radical => (await subjectsService.GetSubjects<Radical>(type, level)).Select(radicalMapper.Map),
            SubjectType.KanaVocabulary => (await subjectsService.GetSubjects<KanaVocabulary>(type, level)).Select(kanaVocabularyMapper.Map),
            _ => throw new ArgumentOutOfRangeException(nameof(type), "Invalid subject type")
        };

        return new JsonResult(result);
    }
}
