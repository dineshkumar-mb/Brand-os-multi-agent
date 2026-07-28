$runId = "30333734194"
$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$runId/logs"
$outputPath = "scratch/logs_$runId.zip"
$extractPath = "scratch/logs_$runId"

# Download the zip file
Invoke-WebRequest -Uri $url -OutFile $outputPath -Headers @{
    "Accept" = "application/vnd.github+json"
} -UseBasicParsing

# Extract it
if (Test-Path $extractPath) {
    Remove-Item -Recurse -Force $extractPath
}
Expand-Archive -Path $outputPath -DestinationPath $extractPath

# List the files inside
Get-ChildItem -Path $extractPath -Recurse | ForEach-Object {
    Write-Host $_.FullName
}
