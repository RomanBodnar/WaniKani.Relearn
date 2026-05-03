using WaniKani.Relearn.Api.Mappers;
using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.Controllers;

[Route("api/subjects")]
[ApiController]
public class SubjectsController(
    SubjectCache subjectCache,
    KanjiMapper kanjiMapper,
    VocabularyMapper vocabularyMapper,
    RadicalMapper radicalMapper) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetSubjects(
        [FromQuery] SubjectType[] types,
        [FromQuery] int? minLevel = null,
        [FromQuery] int? maxLevel = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null
    )
    {
        if (types is null || types.Length == 0)
        {
            return BadRequest("At least one subject type must be specified.");
        }
        var pageResult = subjectCache.GetSubjects(types, page, perPage, minLevel, maxLevel);

        var mapped = pageResult.Data.Select<SingleResource<Subject>, object>(resource => resource.Data switch
        {
            Kanji => kanjiMapper.Map(resource.CopyAs<Kanji>()),
            Radical => radicalMapper.Map(resource.CopyAs<Radical>()),
            Vocabulary => vocabularyMapper.Map(resource.CopyAs<Vocabulary>()),
            KanaVocabulary => vocabularyMapper.Map(resource.CopyAs<KanaVocabulary>()),
            _ => throw new InvalidOperationException($"Unknown subject type: {resource.Data.GetType().Name}")
        });
        return Ok(new PageResult<object>(mapped, pageResult.Page, pageResult.PerPage, pageResult.TotalCount));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSubjectById([FromRoute] int id)
    {
        if (subjectCache.TryGet(id, out var subject))
        {
            return Ok(subject!.Data switch
            {
                Kanji => kanjiMapper.Map(subject.CopyAs<Kanji>()),
                Radical => radicalMapper.Map(subject.CopyAs<Radical>()),
                Vocabulary => vocabularyMapper.Map(subject.CopyAs<Vocabulary>()),
                KanaVocabulary => vocabularyMapper.Map(subject.CopyAs<KanaVocabulary>()),
                _ => throw new InvalidOperationException("Unknown subject type")
            });
        }
        else
        {
            return NotFound();
        }
    }
}
