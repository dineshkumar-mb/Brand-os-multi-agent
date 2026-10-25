$runs = @('39945165641', '39752212821')
foreach ($id in $runs) {
    Write-Host "=== RUN $id ==="
    $r = (Invoke-WebRequest -Uri "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$id" -UseBasicParsing).Content | ConvertFrom-Json
    Write-Host "Run Name: $($r.name)"
    Write-Host "Event: $($r.event)"
    Write-Host "Status: $($r.status)"
    Write-Host "Conclusion: $($r.conclusion)"
    Write-Host "HTML URL: $($r.html_url)"
    Write-Host "Created At: $($r.created_at)"
    Write-Host "Updated At: $($r.updated_at)"
    Write-Host "Run Attempt: $($r.run_attempt)"
    
    $jobs = (Invoke-WebRequest -Uri "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$id/jobs" -UseBasicParsing).Content | ConvertFrom-Json
    Write-Host "Jobs count: $($jobs.total_count)"
    foreach ($j in $jobs.jobs) {
        Write-Host "  Job: $($j.name) | Status: $($j.status) | Conclusion: $($j.conclusion)"
        foreach ($s in $j.steps) {
            Write-Host "    Step: $($s.name) | Status: $($s.status) | Conclusion: $($s.conclusion)"
        }
    }
}
