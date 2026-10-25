$jobs = (Invoke-WebRequest -Uri "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39750106029/jobs" -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Jobs count: $($jobs.total_count)"
foreach ($j in $jobs.jobs) {
    Write-Host "Job: $($j.name) | Status: $($j.status) | Conclusion: $($j.conclusion)"
    foreach ($s in $j.steps) {
        Write-Host "  Step: $($s.name) | Status: $($s.status) | Conclusion: $($s.conclusion)"
    }
}
