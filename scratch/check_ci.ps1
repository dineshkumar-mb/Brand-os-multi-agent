$json = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs?per_page=2' -UseBasicParsing).Content | ConvertFrom-Json
foreach ($run in $json.workflow_runs) {
    Write-Host "$($run.head_sha.Substring(0,7)) | $($run.name) | $($run.status) | $($run.conclusion)"
}
