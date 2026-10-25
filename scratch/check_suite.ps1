$cs = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/check-suites/108267240901' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Check suite status: $($cs.status) | conclusion: $($cs.conclusion)"
Write-Host "App: $($cs.app.name) | slug: $($cs.app.slug)"

$cr = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/check-suites/108267240901/check-runs' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Check runs count: $($cr.total_count)"
foreach ($run in $cr.check_runs) {
    Write-Host "  Check run: $($run.name) | Status: $($run.status) | Conclusion: $($run.conclusion)"
    Write-Host "  HTML: $($run.html_url)"
    Write-Host "  Output title: $($run.output.title)"
    Write-Host "  Output summary: $($run.output.summary)"
    Write-Host "  Output text: $($run.output.text)"
}
