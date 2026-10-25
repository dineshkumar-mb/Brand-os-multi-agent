$posts = Get-Content .\post_history.json -Raw | ConvertFrom-Json
Write-Host "Total posts: $($posts.Count)"
$latest = $posts | Select-Object -First 5
foreach ($p in $latest) {
    Write-Host "$($p.publishedAt) | $($p.platform) | $($p.title)"
}
