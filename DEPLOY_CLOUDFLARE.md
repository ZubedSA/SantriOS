# Panduan Deployment SantriOS ke Cloudflare Pages (Serverless Edge)

Panduan ini berisi langkah-langkah lengkap untuk mendeploy aplikasi **SantriOS** ke **Cloudflare Pages** menggunakan arsitektur serverless modern berbasis **Next.js 14 App Router** dan `@opennextjs/cloudflare`.

---

## 📑 Daftar Isi
1. [Prasyarat](#1-prasyarat)
2. [Variabel Lingkungan (Environment Variables)](#2-variabel-lingkungan-environment-variables)
3. [Metode A: Deployment via Cloudflare Dashboard (Git Integration)](#3-metode-a-deployment-via-cloudflare-dashboard-git-integration)
4. [Metode B: Deployment via Wrangler CLI](#4-metode-b-deployment-via-wrangler-cli)
5. [Konfigurasi Custom Domain & Wildcard Subdomain Multi-Tenant](#5-konfigurasi-custom-domain--wildcard-subdomain-multi-tenant)
6. [Akselerasi Database dengan Cloudflare Hyperdrive (Opsional)](#6-akselerasi-database-dengan-cloudflare-hyperdrive-opsional)
7. [Checklist Verifikasi Pasca-Deploy](#7-checklist-verifikasi-pasca-deploy)

---

## 1. Prasyarat

Sebelum memulai proses deploy, pastikan Anda memiliki:
1. **Akun Cloudflare**: [dash.cloudflare.com](https://dash.cloudflare.com/).
2. **Domain Aktif di Cloudflare**: Nameserver domain (misal: `santrios.id`) sudah terhubung ke Cloudflare.
3. **Database Neon PostgreSQL**: Memiliki connection string aktif dengan SSL (`DATABASE_URL` dan `DIRECT_URL`).
4. **Repository Git**: Kode proyek sudah ter-push ke GitHub atau GitLab.

---

## 2. Variabel Lingkungan (Environment Variables)

Daftarkan variabel berikut pada **Cloudflare Dashboard > Workers & Pages > [Nama Project] > Settings > Environment variables**:

| Nama Variabel | Contoh Nilai | Deskripsi & Catatan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@ep-pooler.neon.tech/santrios?sslmode=require` | URL koneksi pooled Neon PostgreSQL (Wajib Secret). |
| `DIRECT_URL` | `postgresql://user:pass@ep-direct.neon.tech/santrios?sslmode=require` | URL direct Neon PostgreSQL untuk migrasi Prisma (Wajib Secret). |
| `AUTH_SECRET` | `string-acak-rahasia-minimal-32-karakter-sangat-aman` | Kunci enkripsi JWT token otentikasi sesi (Wajib Secret). |
| `NEXT_PUBLIC_APP_URL` | `https://santrios.id` | Domain publik utama aplikasi SantriOS. |
| `NODE_ENV` | `production` | Mode eksekusi aplikasi production. |
| `NODE_VERSION` | `20` | Versi Node.js runtime untuk build container Cloudflare. |

---

## 3. Metode A: Deployment via Cloudflare Dashboard (Git Integration)

Metode ini adalah yang paling direkomendasikan karena otomatis melakukan rebuild setiap ada commit baru ke branch `main`.

### Langkah-langkah:
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) lalu pilih **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
2. Pilih repository **SantriOS** Anda di GitHub / GitLab.
3. Pada halaman **Set up builds and deployments**, atur konfigurasi berikut:
   - **Project name**: `santrios-web`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**:
     ```bash
     pnpm --filter @santrios/database db:generate && pnpm --filter @santrios/web run build:cloudflare
     ```
   - **Build output directory**:
     ```
     apps/web/.open-next/assets
     ```
   - **Root directory**: `/` (biarkan root monorepo agar `pnpm` workspace terdeteksi).
4. Klik **Environment variables (advanced)** dan tambahkan variabel lingkungan dari tabel di atas.
5. Klik **Save and Deploy**.
6. Cloudflare akan memulai proses clone, generate Prisma client, kompilasi OpenNext, dan menyebarkan asset ke ratusan PoP edge secara global.

---

## 4. Metode B: Deployment via Wrangler CLI

Jika Anda ingin mendeploy langsung dari terminal lokal komputer:

### 1. Login ke Cloudflare
```bash
npx wrangler login
```
Browser akan terbuka untuk mengonfirmasi otorisasi akun Cloudflare Anda.

### 2. Generate Prisma Client
```bash
pnpm db:generate
```

### 3. Build Proyek untuk Cloudflare Pages
```bash
pnpm --filter @santrios/web run build:cloudflare
```

### 4. Deploy ke Cloudflare Pages
```bash
npx wrangler pages deploy apps/web/.open-next/assets --project-name=santrios-web
```

Setelah proses selesai, Wrangler akan menampilkan URL preview deployment (misal: `https://santrios-web.pages.dev`).

---

## 5. Konfigurasi Custom Domain & Wildcard Subdomain Multi-Tenant

SantriOS dirancang dengan fitur multi-tenant di mana setiap pondok pesantren dapat memiliki subdomain khusus (misal: `al-hikmah.santrios.id`, `darussalam.santrios.id`).

### 1. Pasang Custom Domain Utama
1. Di halaman project Pages Anda, buka tab **Custom domains**.
2. Klik **Set up a custom domain**.
3. Masukkan domain utama Anda: `santrios.id`.
4. Cloudflare akan otomatis membuat CNAME DNS record ke project Pages Anda.

### 2. Pasang Wildcard Subdomain (`*.santrios.id`)
1. Buka tab **DNS > Records** di domain `santrios.id` pada Cloudflare Dashboard.
2. Tambahkan DNS Record baru:
   - **Type**: `CNAME`
   - **Name**: `*`
   - **Target**: `santrios-web.pages.dev`
   - **Proxy status**: `Proxied` (Awan oranye aktif)
   - **TTL**: `Auto`
3. Simpan. Sekarang seluruh request subdomain (seperti `pesantren-a.santrios.id`) akan otomatis dirutekan ke SantriOS!

### 3. Konfigurasi SSL/TLS
1. Masuk ke menu **SSL/TLS > Overview**.
2. Pilih mode **Full (strict)**.
3. Masuk ke **Edge Certificates**, pastikan opsi berikut aktif:
   - **Always Use HTTPS**: `ON`
   - **Automatic HTTPS Rewrites**: `ON`
   - **Minimum TLS Version**: `TLS 1.2`

---

## 6. Akselerasi Database dengan Cloudflare Hyperdrive (Opsional)

Cloudflare Hyperdrive memungkinkan worker edge melakukan pooling koneksi PostgreSQL secara global dengan latensi sub-milidetik:

1. Di Cloudflare Dashboard, buka **Storage & Databases > Hyperdrive**.
2. Klik **Create configuration**.
3. Masukkan connection string database Neon PostgreSQL Anda.
4. Salin **Hyperdrive ID** yang dihasilkan.
5. Buka `apps/web/wrangler.toml` dan aktifkan binding:
   ```toml
   [[hyperdrive]]
   binding = "HYPERDRIVE"
   id = "masukkan-hyperdrive-id-anda"
   ```

---

## 7. Checklist Verifikasi Pasca-Deploy

Setelah deployment sukses, lakukan pengecekan berikut:
- [ ] Buka `https://santrios.id/login` dan pastikan halaman login termuat dalam waktu < 1 detik.
- [ ] Login menggunakan akun demo atau akun riil pondok pesantren.
- [ ] Coba beralih peran menggunakan **Role Switcher** di header (Owner, Admin, Bendahara, Guru, Musyrif, Wali Santri).
- [ ] Buka modul SPP Kasir (`/dashboard/finance`) dan pastikan query transaksi PostgreSQL berjalan normal.
- [ ] Akses salah satu tenant slug subdomain (misal: `al-hikmah.santrios.id`) dan pastikan tenant context terdeteksi secara otomatis.
