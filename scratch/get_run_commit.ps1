$runId = "30333734194"
$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$runId"
$res = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
[PSCustomObject]@{
    id = $res.id
    commit_sha = $res.head_sha
    commit_message = $res.head_commit.message
    run_started_at = $res.run_started_at
    created_at = $res.created_at
    updated_at = $res.updated_at
} | Format-List
