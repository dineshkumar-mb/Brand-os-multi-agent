$runId = "30333734194"
$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$runId"
$json = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
Write-Host $json
