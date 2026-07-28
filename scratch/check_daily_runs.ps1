$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/workflows/daily-automated-post.yml/runs?per_page=10"
$json = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
$json.workflow_runs | ForEach-Object {
    Write-Host "$($_.created_at) | $($_.id) | $($_.status) | $($_.conclusion) | $($_.html_url)"
}
