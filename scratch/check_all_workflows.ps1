$workflows = @('daily-automated-post.yml', 'watchdog-auto-heal.yml', 'self-healing-agent.yml', 'ci.yml')
foreach ($w in $workflows) {
    $url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/workflows/$w/runs?per_page=5"
    $res = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
    Write-Host "=== Workflow: $w ==="
    foreach ($r in $res.workflow_runs) {
        Write-Host "$($r.created_at) | ID: $($r.id) | Status: $($r.status) | Conclusion: $($r.conclusion) | Event: $($r.event) | Name: $($r.name)"
    }
}
