# PowerShell script to remove publish directory from Netlify site settings
# This fixes the "Failed publishing static content" error

# You need to set your site ID and access token
# Get your site ID from: netlify status
# Get your access token from: https://app.netlify.com/user/applications

param(
    [string]$SiteId = "",
    [string]$AccessToken = ""
)

if (-not $SiteId -or -not $AccessToken) {
    Write-Host "Usage: .\fix-netlify-publish.ps1 -SiteId 'your-site-id' -AccessToken 'your-access-token'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your site ID, run: netlify status" -ForegroundColor Cyan
    Write-Host "To get your access token, visit: https://app.netlify.com/user/applications" -ForegroundColor Cyan
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

# Get current site build settings
Write-Host "Fetching current site settings..." -ForegroundColor Cyan
$siteUrl = "https://api.netlify.com/api/v1/sites/$SiteId"
$site = Invoke-RestMethod -Uri $siteUrl -Headers $headers -Method Get

Write-Host "Current build settings:" -ForegroundColor Yellow
Write-Host "  Build command: $($site.build_settings.cmd)" -ForegroundColor Gray
Write-Host "  Publish directory: $($site.build_settings.dir)" -ForegroundColor Gray

# Update build settings to remove publish directory
Write-Host ""
Write-Host "Updating build settings to remove publish directory..." -ForegroundColor Cyan

$updateData = @{
    build_settings = @{
        cmd = $site.build_settings.cmd
        dir = ""  # Empty string removes the publish directory
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $siteUrl -Headers $headers -Method Patch -Body $updateData
    Write-Host "✓ Successfully removed publish directory!" -ForegroundColor Green
    Write-Host ""
    Write-Host "New build settings:" -ForegroundColor Yellow
    Write-Host "  Build command: $($response.build_settings.cmd)" -ForegroundColor Gray
    Write-Host "  Publish directory: (empty)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "You can now deploy with: netlify deploy --prod" -ForegroundColor Green
} catch {
    Write-Host "✗ Error updating settings: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "You can also manually remove it from the Netlify UI:" -ForegroundColor Yellow
    Write-Host "  1. Go to Site settings → Build & deploy → Build settings" -ForegroundColor Cyan
    Write-Host "  2. Clear the 'Publish directory' field" -ForegroundColor Cyan
    Write-Host "  3. Click Save" -ForegroundColor Cyan
    exit 1
}

