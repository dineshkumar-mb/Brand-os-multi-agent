$r = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39945165641' -UseBasicParsing).Content
$r | Out-File -FilePath .\scratch\run_39945165641.json -Encoding utf8
