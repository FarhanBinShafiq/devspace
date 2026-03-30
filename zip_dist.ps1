$source = "dist"
$dest = "devspace-multibrowser-v1.1.0.zip"
If (Test-Path $dest) { Remove-Item $dest }
Add-Type -AssemblyName "System.IO.Compression"
Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$zip = [System.IO.Compression.ZipFile]::Open($dest, [System.IO.Compression.ZipArchiveMode]::Create)
$files = Get-ChildItem -Path $source -Recurse | Where-Object { !$_.PSIsContainer }
foreach ($file in $files) {
    # Replace backslashes with forward slashes for the archive entry
    $relativePath = $file.FullName.Substring((Get-Item $source).FullName.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relativePath)
}
$zip.Dispose()
