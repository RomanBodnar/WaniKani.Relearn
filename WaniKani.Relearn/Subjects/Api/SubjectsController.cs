using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Subjects.Api.Mappers;
using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Data.Models;
using WaniKani.Relearn.Subjects.Services;
using KanjiMapper = WaniKani.Relearn.Subjects.Api.Mappers.KanjiMapper;

namespace WaniKani.Relearn.Subjects.Api;

[Route("api/subjects")]
[ApiController]
public class SubjectsController(
    SubjectCache subjectCache,
    SubjectSearchService searchService,
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
        if (types.Length == 0)
        {
            return BadRequest("At least one subject type must be specified.");
        }
        var pageResult = subjectCache.GetSubjects(types, page, perPage, minLevel, maxLevel);

        var mapped = pageResult.Data.Select<Subject, object>(resource => resource switch
        {
            Kanji => kanjiMapper.Map((Kanji)resource),
            Radical => radicalMapper.Map((Radical)resource),
            Vocabulary => vocabularyMapper.Map((Vocabulary)resource),
            _ => throw new InvalidOperationException($"Unknown subject type: {resource.GetType().Name}")
        });
        return Ok(new PageResult<object>(mapped, pageResult.Page, pageResult.PerPage, pageResult.TotalCount));
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] SubjectType[]? types = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null
    )
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return Ok(new PageResult<object>([], page ?? 1, perPage ?? 100, 0));
        }

        var results = searchService.Search(q, types);
        var list = results.ToList();
        var totalCount = list.Count;

        int p = page ?? 1;
        int take = perPage ?? 100;
        var pagedResults = list.Skip((p - 1) * take).Take(take);

        var mapped = pagedResults.Select<Subject, object>(resource => resource switch
        {
            Kanji => kanjiMapper.Map((Kanji)resource),
            Radical => radicalMapper.Map((Radical)resource),
            Vocabulary => vocabularyMapper.Map((Vocabulary)resource),
            _ => throw new InvalidOperationException($"Unknown subject type: {resource.GetType().Name}")
        });

        return Ok(new PageResult<object>(mapped, p, take, totalCount));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSubjectById([FromRoute] int id)
    {
        if (subjectCache.TryGet(id, out var subject))
        {
            return Ok(subject switch
            {
                Kanji kanji => kanjiMapper.Map(kanji),
                Radical radical => radicalMapper.Map(radical),
                Vocabulary vocabulary => vocabularyMapper.Map(vocabulary),
                _ => throw new InvalidOperationException("Unknown subject type")
            });
        }
        else
        {
            return NotFound();
        }
    }
}
