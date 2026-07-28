$json = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/workflows/ci.yml/runs?per_page=10' -UseBasicParsing).Content | ConvertFrom-Json
foreach ($run in $json.workflow_runs) {
    Write-Host "$($run.created_at) | $($run.id) | $($run.name) | $($run.status) | $($run.conclusion) | $($run.html_url)"
}
