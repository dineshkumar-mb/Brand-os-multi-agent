$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/workflows/self-healing-agent.yml/runs?per_page=30"
$res = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Total runs for self-healing-agent: $($res.workflow_runs.Count)"
foreach ($r in $res.workflow_runs) {
    Write-Host "$($r.created_at) | ID: $($r.id) | Status: $($r.status) | Conclusion: $($r.conclusion) | Event: $($r.event)"
}
