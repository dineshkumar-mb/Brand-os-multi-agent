$p1 = (Invoke-WebRequest -Uri 'https://github.com/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39945165641/navigation_partial?attempt=1&selected_tab=summary' -UseBasicParsing).Content
Write-Host "--- NAVIGATION PARTIAL ---"
Write-Host $p1

$p2 = (Invoke-WebRequest -Uri 'https://github.com/dineshkumar-mb/Brand-os-multi-agent/actions/runs/39945165641/header_partial' -UseBasicParsing).Content
Write-Host "--- HEADER PARTIAL ---"
Write-Host $p2
