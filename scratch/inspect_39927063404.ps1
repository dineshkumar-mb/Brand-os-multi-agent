$r = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39927063404' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Run 39927063404:"
Write-Host "Actor: $($r.actor.login)"
Write-Host "Triggering actor: $($r.triggering_actor.login)"
Write-Host "Event: $($r.event)"
Write-Host "Head SHA: $($r.head_sha)"
Write-Host "Conclusion: $($r.conclusion)"
Write-Host "Status: $($r.status)"
