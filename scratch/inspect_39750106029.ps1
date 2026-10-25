$r = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39750106029' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Run 39750106029:"
Write-Host "Created at: $($r.created_at)"
Write-Host "Actor: $($r.actor.login)"
Write-Host "Head SHA: $($r.head_sha)"
Write-Host "Commit message: $($r.head_commit.message)"
Write-Host "Conclusion: $($r.conclusion)"
Write-Host "Status: $($r.status)"
