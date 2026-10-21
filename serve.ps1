# Minimal static file server for local preview (no Node/Python required).
# Run:  powershell -ExecutionPolicy Bypass -File serve.ps1            -> http://localhost:8080
#       powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 5500
param([int]$Port = 8080)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "application/javascript; charset=utf-8"; ".mjs" = "application/javascript; charset=utf-8"
  ".json" = "application/json"; ".svg" = "image/svg+xml"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".png" = "image/png"
  ".webp" = "image/webp"; ".avif" = "image/avif"; ".mp4" = "video/mp4"; ".webm" = "video/webm"; ".pdf" = "application/pdf"
  ".ico" = "image/x-icon"; ".woff2" = "font/woff2"; ".txt" = "text/plain; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "DANIELS portfolio running at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    try {
      $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
      if ($path -eq "" -or $path.EndsWith("/")) { $path += "index.html" }
      $file = [IO.Path]::GetFullPath((Join-Path $root $path))
      if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("404 - Not found")
      } else {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
        $bytes = [IO.File]::ReadAllBytes($file)
      }
      $res.ContentLength64 = $bytes.Length
      if ($req.HttpMethod -ne "HEAD") { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("{0} {1} {2}" -f $res.StatusCode, $req.HttpMethod, $req.Url.AbsolutePath)
    } catch {
      Write-Host "Error: $_"
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}
