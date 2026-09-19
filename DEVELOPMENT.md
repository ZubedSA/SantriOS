# SantriOS — Development Guide & Standards

Panduan standar penulisan kode, alur Git, dan proses pengujian untuk developer SantriOS.

---

## 1. Standar Penulisan Kode (Section 51 of Master Prompt)

- **Strict TypeScript**: Seluruh kode wajib TypeScript, tanpa menggunakan `any` secara sembarangan.
- **Validasi Zod**: Seluruh input dari client maupun server actions/API wajib divalidasi menggunakan skema Zod di `packages/validators`.
- **Tidak Ada Direct DB di UI**: Dilarang mengimpor atau memanggil `prisma` langsung dari file komponen UI (`page.tsx` atau client components). Gunakan server actions atau API routes terisolasi.
- **Copy Bahasa Indonesia**: Label, tombol, pesan validasi, dan feedback sistem menggunakan Bahasa Indonesia baku yang ringkas dan bersahabat.
- **Mobile-First UX**: Setiap antarmuka diuji pada resolusi mobile 320px–430px terlebih dahulu sebelum desktop.

---

## 2. Alur Git & Commit Messages

Format pesan commit mengikuti Conventional Commits:
- `feat: add tenant onboarding wizard`
- `fix: prevent cross-tenant data leakage in repository`
- `test: add tenant isolation test suite`
- `refactor: extract mobile navigation bar to ui package`
- `docs: update database indexing guidelines`

---

## 3. Menjalankan Perintah Monorepo

```bash
# Instalasi seluruh workspace
pnpm install

# Menjalankan development server (Next.js)
pnpm run dev

# Menjalankan typecheck seluruh paket
pnpm run typecheck

# Menjalankan linting
pnpm run lint

# Menjalankan test suite keamanan dan isolasi
pnpm run test

# Build bundle produksi
pnpm run build
```
