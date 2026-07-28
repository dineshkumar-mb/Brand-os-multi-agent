$runId = "30333734194"
$url = "https://api.github.com/repos/dineshkumar-mb/Brand-os-multi-agent/actions/runs/$runId"
$res = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
[PSCustomObject]@{
    id = $res.id
    name = $res.name
    event = $res.event
    status = $res.status
    conclusion = $res.conclusion
    head_branch = $res.head_branch
    triggering_actor = $res.triggering_actor.login
} | Format-List
