# SantriOS Auto Repair Script (DNS + Dependencies + DB Sync)

Write-Host "=== 1. Memperbaiki DNS Windows ke Google DNS (8.8.8.8) ===" -ForegroundColor Cyan
try {
    # Minta akses admin untuk ubah DNS jika belum admin
    Start-Process powershell -Verb runAs -Wait -ArgumentList 'Get-NetAdapter | Where-Object Status -eq "Up" | Set-DnsClientServerAddress -ServerAddresses ("8.8.8.8","1.1.1.1"); ipconfig /flushdns; Write-Host "DNS Berhasil diubah ke 8.8.8.8 & 1.1.1.1!" -ForegroundColor Green'
    Write-Host "✅ DNS Windows berhasil diperbarui ke Public DNS." -ForegroundColor Green
} catch {
    Write-Host "⚠️ Gagal mengubah DNS otomatis: $_" -ForegroundColor Yellow
}

Write-Host "`n=== 2. Memulihkan Dependencies yang Terhapus (pnpm install) ===" -ForegroundColor Cyan
Write-Host "Menghentikan background process node yang mengunci file..."
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

Write-Host "Menjalankan pnpm install..."
& .\pnpm.exe install

Write-Host "`n=== 3. Menguji Koneksi ke Neon ===" -ForegroundColor Cyan
node test-conn.cjs

Write-Host "`nJika koneksi berhasil, Anda siap menjalankan: npm run db:push" -ForegroundColor Magenta
