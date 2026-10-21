# Re-encodes JPEGs at a web-friendly quality and optional max width.
# Usage: powershell -ExecutionPolicy Bypass -File tools\optimize-images.ps1 -Src in.jpg -Dst out.jpg [-MaxWidth 1600] [-Quality 80] [-CropW 1200 -CropH 630]
param(
  [Parameter(Mandatory)] [string]$Src,
  [Parameter(Mandatory)] [string]$Dst,
  [int]$MaxWidth = 0,
  [int]$Quality = 80,
  [int]$CropW = 0,
  [int]$CropH = 0
)
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path $Src))
$w = $img.Width; $h = $img.Height

if ($CropW -gt 0 -and $CropH -gt 0) {
  # cover-crop to the target ratio, centred
  $scale = [Math]::Max($CropW / $w, $CropH / $h)
  $sw = $CropW / $scale; $sh = $CropH / $scale
  $sx = ($w - $sw) / 2; $sy = ($h - $sh) / 2
  $tw = $CropW; $th = $CropH
} else {
  $sx = 0; $sy = 0; $sw = $w; $sh = $h
  if ($MaxWidth -gt 0 -and $w -gt $MaxWidth) { $tw = $MaxWidth; $th = [int]($h * $MaxWidth / $w) } else { $tw = $w; $th = $h }
}

$bmp = New-Object System.Drawing.Bitmap $tw, $th
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $tw, $th), $sx, $sy, $sw, $sh, [System.Drawing.GraphicsUnit]::Pixel)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)
$out = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Dst))
$bmp.Save($out, $codec, $ep)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
"{0} -> {1}x{2}, {3:N0} KB" -f $Dst, $tw, $th, ((Get-Item $out).Length / 1KB)
