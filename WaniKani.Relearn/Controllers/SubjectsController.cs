using Microsoft.AspNetCore.Mvc.RazorPages;
using WaniKani.Relearn.Api.Mappers;
using WaniKani.Relearn.Api.Response;
using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Model.Assignments;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.Controllers;

[Route("api/subjects")]
[ApiController]
public class SubjectsController(
    SubjectsService subjectsService,
    SubjectCache subjectCache,
    KanjiMapper kanjiMapper,
    VocabularyMapper vocabularyMapper,
    RadicalMapper radicalMapper,
    KanaVocabularyMapper kanaVocabularyMapper) : ControllerBase
{
    [HttpGet("{type}")]
    public async Task<IActionResult> GetSubjects(
        [FromRoute] SubjectType type,
        [FromQuery] int? minLevel = null,
        [FromQuery] int? maxLevel = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null
    )
    {
        var pageResult = subjectCache.GetSubjects(type, page, perPage, minLevel, maxLevel);

        return type switch
        {
            SubjectType.Kanji => Ok(new PageResult<KanjiResponse>(
                pageResult.Data.Select(x => x.CopyAs<Kanji>()).Select(x => kanjiMapper.Map(x)),
                pageResult.Page, pageResult.PerPage, pageResult.TotalCount)),
            
            SubjectType.Vocabulary => Ok(new PageResult<VocabularyResponse>(
                pageResult.Data.Select(x => x.CopyAs<Vocabulary>()).Select(x => vocabularyMapper.Map(x)),
                pageResult.Page, pageResult.PerPage, pageResult.TotalCount)),
            
            SubjectType.Radical => Ok(new PageResult<RadicalResponse>(
                pageResult.Data.Select(x => x.CopyAs<Radical>()).Select(x => radicalMapper.Map(x)),
                pageResult.Page, pageResult.PerPage, pageResult.TotalCount)),
            
            SubjectType.KanaVocabulary => Ok(new PageResult<VocabularyResponse>(
                pageResult.Data.Select(x => x.CopyAs<KanaVocabulary>()).Select(x => vocabularyMapper.Map(x)),
                pageResult.Page, pageResult.PerPage, pageResult.TotalCount)),
            
            _ => BadRequest("Invalid subject type")
        };
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSubjectById([FromRoute] int id)
    {
        if(subjectCache.TryGet(id, out var subject))
        {
            return Ok(subject!.Data switch
            {
                Kanji => kanjiMapper.Map(subject.CopyAs<Kanji>()),
                Radical => radicalMapper.Map(subject.CopyAs<Radical>()),
                Vocabulary  => vocabularyMapper.Map(subject.CopyAs<Vocabulary>()),
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
