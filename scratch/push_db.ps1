Get-Content .env | Foreach-Object {
    if ($_ -match "=" -and -not $_.StartsWith("#")) {
        $parts = $_.Split("=", 2)
        $key = $parts[0].Trim()
        $val = $parts[1].Trim().Trim('"').Trim("'")
        [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
    }
}
npx pnpm --filter @brand-os/database db:push
