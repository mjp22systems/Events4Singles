$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$images = (Resolve-Path (Join-Path $root "public\images")).Path
$site = Join-Path $images "site"
$junk = Join-Path $images "junk"
$old = Join-Path $junk "old-site-assets"

foreach ($path in @($images, $site, $junk)) {
  $resolved = (Resolve-Path -LiteralPath $path).Path
  if (-not $resolved.StartsWith($root)) {
    throw "Path outside workspace: $resolved"
  }
}

New-Item -ItemType Directory -Force -Path $old | Out-Null

function Move-OneFile {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$DestinationDirectory
  )

  $sourcePath = (Resolve-Path -LiteralPath $Source).Path
  if (-not $sourcePath.StartsWith($images)) {
    throw "Source outside image tree: $sourcePath"
  }

  New-Item -ItemType Directory -Force -Path $DestinationDirectory | Out-Null
  $destinationRoot = (Resolve-Path -LiteralPath $DestinationDirectory).Path
  if (-not $destinationRoot.StartsWith($junk)) {
    throw "Destination outside junk tree: $destinationRoot"
  }

  $destinationPath = Join-Path $destinationRoot (Split-Path -Leaf $sourcePath)
  if (Test-Path -LiteralPath $destinationPath) {
    $sourceHash = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
    $destinationHash = (Get-FileHash -LiteralPath $destinationPath -Algorithm SHA256).Hash
    if ($sourceHash -eq $destinationHash) {
      Remove-Item -LiteralPath $sourcePath
      return "deduped"
    }

    $baseName = [IO.Path]::GetFileNameWithoutExtension($sourcePath)
    $extension = [IO.Path]::GetExtension($sourcePath)
    $index = 2
    do {
      $destinationPath = Join-Path $destinationRoot "$baseName-dup$index$extension"
      $index++
    } while (Test-Path -LiteralPath $destinationPath)
  }

  Move-Item -LiteralPath $sourcePath -Destination $destinationPath
  return "moved"
}

function Get-BucketForName {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][int64]$Length
  )

  $nameLower = $Name.ToLowerInvariant()

  if ($Length -eq 0) {
    return "corrupt-or-empty"
  }

  if (
    $nameLower -match "^(spacer|space|shim|dot_|dot\.|dashedline|greyline|barbg|pollbar|red_[bpt]bg|fon_)" -or
    ($Length -le 100 -and $nameLower -match "^(e\d\d|.*_l2?|.*_r2?)\.gif$")
  ) {
    return "spacers-and-lines"
  }

  if ($nameLower -match "(button|nav|menu|left|right|top|bottom|down|arrow|icon_|hostels_|hotels_|makehomepage|submit|stop|b_login|speciality_pages|datingnavbar|dinner4six_|dinnerparties_|social_clubs1_|othernav_|other_|index_|evcalendar)") {
    return "navigation-and-buttons"
  }

  if ($nameLower -match "^(dance_\d+|dance_classes_b|spacer_dance)") {
    return "dance-page-chrome"
  }

  if ($nameLower -match "^(e4s|logo1a_e4s|logo_e4s|personalse4s|logo\.gif)") {
    return "e4s-brand"
  }

  return "page-art"
}

$moved = 0
$deduped = 0

$legacyGenerated = Join-Path $site "legacy-generated"
if (Test-Path -LiteralPath $legacyGenerated) {
  Get-ChildItem -LiteralPath $legacyGenerated -Recurse -File | ForEach-Object {
    $relativeDirectory = $_.DirectoryName.Substring($legacyGenerated.Length).TrimStart("\")
    $destinationDirectory = Join-Path (Join-Path $old "generated-site-images") $relativeDirectory
    $result = Move-OneFile -Source $_.FullName -DestinationDirectory $destinationDirectory
    if ($result -eq "deduped") { $script:deduped++ } else { $script:moved++ }
  }
}

$folderMap = @{
  "e4s-old-site-assets" = "e4s-brand"
  "legacy-icons-and-nav" = "navigation-and-buttons"
  "legacy-numbered-logos" = "numbered-logos"
  "legacy-page-art" = "page-art"
  "low-quality-or-generic-business-candidates" = "low-quality-or-generic-business-candidates"
}

foreach ($sourceFolder in $folderMap.Keys) {
  $sourceDirectory = Join-Path $junk $sourceFolder
  if (Test-Path -LiteralPath $sourceDirectory) {
    Get-ChildItem -LiteralPath $sourceDirectory -Recurse -File | ForEach-Object {
      $relativeDirectory = $_.DirectoryName.Substring($sourceDirectory.Length).TrimStart("\")
      $destinationDirectory = Join-Path (Join-Path $old $folderMap[$sourceFolder]) $relativeDirectory
      $result = Move-OneFile -Source $_.FullName -DestinationDirectory $destinationDirectory
      if ($result -eq "deduped") { $script:deduped++ } else { $script:moved++ }
    }
  }
}

foreach ($looseRoot in @($junk, $old)) {
  Get-ChildItem -LiteralPath $looseRoot -File | ForEach-Object {
    $bucket = Get-BucketForName -Name $_.Name -Length $_.Length
    $destinationDirectory = Join-Path $old $bucket
    $result = Move-OneFile -Source $_.FullName -DestinationDirectory $destinationDirectory
    if ($result -eq "deduped") { $script:deduped++ } else { $script:moved++ }
  }
}

foreach ($base in @($legacyGenerated) + ($folderMap.Keys | ForEach-Object { Join-Path $junk $_ })) {
  if (Test-Path -LiteralPath $base) {
    Get-ChildItem -LiteralPath $base -Recurse -Directory | Sort-Object FullName -Descending | ForEach-Object {
      if (-not (Get-ChildItem -LiteralPath $_.FullName -Force | Select-Object -First 1)) {
        Remove-Item -LiteralPath $_.FullName
      }
    }

    if (-not (Get-ChildItem -LiteralPath $base -Force | Select-Object -First 1)) {
      Remove-Item -LiteralPath $base
    }
  }
}

"moved=$moved deduped=$deduped"
