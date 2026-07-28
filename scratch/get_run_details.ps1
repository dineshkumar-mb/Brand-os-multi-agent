$runId = "30395833736"
$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$runId/jobs"
$json = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
foreach ($job in $json.jobs) {
    Write-Host "Job: $($job.name) | Status: $($job.status) | Conclusion: $($job.conclusion)"
    foreach ($step in $job.steps) {
        Write-Host "  Step: $($step.name) | Status: $($step.status) | Conclusion: $($step.conclusion)"
    }
}
