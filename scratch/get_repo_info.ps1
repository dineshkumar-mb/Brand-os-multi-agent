$repo = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host "Repo: $($repo.full_name)"
Write-Host "Private: $($repo.private)"
Write-Host "Fork: $($repo.fork)"
Write-Host "Archived: $($repo.archived)"
Write-Host "Disabled: $($repo.disabled)"
Write-Host "Permissions: $($repo.permissions | ConvertTo-Json -Compress)"
Write-Host "Allow fork colab: $($repo.allow_forking)"
