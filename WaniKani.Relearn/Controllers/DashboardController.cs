using WaniKani.Relearn.Model.Reviews;

namespace WaniKani.Relearn.Controllers
{
    [Route("dashboard")]
    [ApiController]
    public class DashboardController(
        IDashboardService dashboardService) : ControllerBase
    {
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var stagesDistributions = await dashboardService.GetDashboardSummary();
            return Ok(stagesDistributions);
        }
    }
}
