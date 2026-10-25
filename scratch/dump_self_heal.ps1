$r = (Invoke-WebRequest -Uri 'https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39752212821' -UseBasicParsing).Content
$r | Out-File -FilePath .\scratch\run_39752212821.json -Encoding utf8
