$cs = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/check-suites/107732949131' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Check suite status: $($cs.status) | conclusion: $($cs.conclusion)"

$cr = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/check-suites/107732949131/check-runs' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Check runs count: $($cr.total_count)"
foreach ($run in $cr.check_runs) {
    Write-Host "  Check run: $($run.name) | Status: $($run.status) | Conclusion: $($run.conclusion)"
}
