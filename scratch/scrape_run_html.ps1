$html = (Invoke-WebRequest -Uri 'https://github.com/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39945165641' -UseBasicParsing).Content
# Look for text in the main content
$lines = $html -split "`n" | Where-Object { $_ -match 'action|require|approval|disabled|limit|billing|fail|error|permission' } | Select-Object -First 30
foreach ($l in $lines) {
    Write-Host ($l.Trim())
}
