using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WaniKani.Relearn.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SubjectsController(
    ISubjectsApi subjectsApi) : ControllerBase
{
    
}
