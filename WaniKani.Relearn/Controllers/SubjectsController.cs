using WaniKani.Relearn.Api.Mappers;
using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.Controllers;

[Route("api/subjects")]
[ApiController]
public class SubjectsController(
    SubjectCache subjectCache,
    ISubjectsApi subjectsApi,
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

        var mapped = pageResult.Data.Select<DataAccess.Models.Subject, object>(resource => resource switch
        {
            DataAccess.Models.Kanji => kanjiMapper.Map(resource as DataAccess.Models.Kanji),
            DataAccess.Models.Radical => radicalMapper.Map(resource as DataAccess.Models.Radical),
            DataAccess.Models.Vocabulary => vocabularyMapper.Map(resource as DataAccess.Models.Vocabulary),
            _ => throw new InvalidOperationException($"Unknown subject type: {resource.GetType().Name}")
        });
        return Ok(new PageResult<object>(mapped, pageResult.Page, pageResult.PerPage, pageResult.TotalCount));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSubjectById([FromRoute] int id)
    {
        if (subjectCache.TryGet(id, out var subject))
        {
            return Ok(subject switch
            {
                DataAccess.Models.Kanji => kanjiMapper.Map(subject as DataAccess.Models.Kanji),
                DataAccess.Models.Radical => radicalMapper.Map(subject as DataAccess.Models.Radical),
                DataAccess.Models.Vocabulary => vocabularyMapper.Map(subject as DataAccess.Models.Vocabulary),
                _ => throw new InvalidOperationException("Unknown subject type")
            });
        }
        else
        {
            return NotFound();
        }
    }
}
