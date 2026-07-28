$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/secrets"
$res = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
$res.secrets | ForEach-Object {
    Write-Host $_.name
}
