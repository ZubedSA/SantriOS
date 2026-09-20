# SantriOS — Workspace Development & Architecture Rules

## 1. Project Identity & Philosophy
- **Name**: SantriOS ("Operating System for Modern Pesantren").
- **Type**: Multi-tenant modular SaaS.
- **Tone & Aesthetic**: Mobile-first, modern, clean, premium, subtle Islamic touch without excessive ornamentation or heavy gradients. Must look and feel like a high-end modern SaaS platform.

## 2. Tech Stack Invariants
- **Monorepo**: Turborepo + pnpm + TypeScript.
- **Web App**: Next.js App Router (in `apps/web`), Server Components by default, Server Actions / API routes where appropriate.
- **Packages**:
  - `packages/ui`: Shared UI primitives and mobile/desktop design system.
  - `packages/database`: Prisma schema, Neon PostgreSQL client, migrations, seeds.
  - `packages/auth`: RBAC, permissions, session management.
  - `packages/types`: Shared TypeScript interfaces/types.
  - `packages/validators`: Zod schemas for all client and server inputs.
  - `packages/utils`: Shared utilities.
  - `packages/modules`: Module registry and feature-flag checkers.
- **Database**: PostgreSQL (Neon-compatible) via Prisma ORM. Prisma Client must be centralized (never instantiate multiple client instances).

## 3. Multi-Tenancy & Security Invariants
- **Architecture**: Shared Database + Shared Schema + mandatory `tenant_id` on all business entities.
- **Application Isolation**: Enforce tenant isolation at the service/repository layer via `getTenantContext()` and `tenantDb()` helper patterns. Never rely on developers manually remembering to add `where: { tenantId }`.
- **Cross-Tenant Access**: Zero tolerance for cross-tenant data leaks. Must have automated isolation tests.
- **RBAC & Permissions**: Granular permissions (e.g., `students.view`, `finance.create`). Role checks alone are insufficient for operational actions. Super Admin SaaS is strictly separated from Tenant Admin.
- **Validation**: Strict Zod validation on both client and server inputs.
- **Sensitive Data**: Never expose secrets (`DATABASE_URL`, `AUTH_SECRET`, etc.) to client code.

## 4. Layered Architecture & Modularity
- **Layers**: UI → Server Action / API → Service → Repository → Prisma.
  - Never put raw database queries or complex domain logic directly inside UI components.
- **Module Boundaries**: Modules (`CORE`, `SANTRI`, `KEUANGAN`, `ABSENSI`, `TAHFIZH`, `AKADEMIK`, `ASRAMA`, `PERIZINAN`, `WALI_SANTRI`, `PPDB`, `INVENTARIS`, `KOPERASI`, `ALUMNI`) are loosely coupled.
- **Feature Flags**: Modularity acts as feature flags. Verify `hasModule(tenantId, moduleKey)` on routes, server actions, and navigation.

## 5. UI & UX Standards
- **Mobile-First**: Design for 320px–430px screens first, with bottom navigation, drawers/sheets, and card lists. On desktop, use collapsible sidebar and data tables.
- **Empty States & Skeletons**: Every page must have a dedicated empty state with clear calls to action, plus skeleton loading states.
- **Language**: Default UI copy in Indonesian (Bahasa Indonesia).

## 6. Definition of Done
A feature is complete only if:
1. UI is mobile-responsive and desktop-optimized.
2. Server logic, Zod validation, and RBAC authorization are implemented.
3. Multi-tenant isolation is enforced and verified.
4. Loading states and empty states are present.
5. Error handling and audit logging are implemented.
6. TypeScript passes without `any` workarounds, linter passes, and tests pass.

## 7. Database & Connection Invariants (Neon)
- **SSL Only, No Channel Binding**: Always use `?sslmode=require` for Neon PostgreSQL. Never include `channel_binding=require` as it breaks Neon PgBouncer poolers and Prisma Rust engine.
- **Multi-Package Env Alignment**: In addition to root `.env`, ensure `packages/database/.env` and `apps/web/.env` are populated or aligned so local CLI tools and Next.js can resolve `DATABASE_URL` and `DIRECT_URL`.

## 8. Monorepo & Windows Tooling Invariants
- **Webpack & TSConfig Path Aliases**: When building in hoisted environments without symlinks (`symlink=false`), ensure `next.config.mjs` contains explicit Webpack `resolve.alias` pointing to `packages/*/src` for all internal `@santrios/*` packages.
- **Turbo Package Manager**: Always define exact `"packageManager"` in root `package.json` (e.g. `"pnpm@9.1.0"`) and set `package-manager-strict=false` in `.npmrc`.

## 9. Role-Specific Dashboard & UX Invariant (Section 40)
- **Zero One-Size-Fits-All Dashboards**: Never display a generic dashboard across different user roles.
  - **OWNER**: Executive KPIs (total santri, cash flow, attendance rate, hifz overview, pending approvals).
  - **ADMIN**: Operational management (student records, staff, dormitory, modules, audit).
  - **BENDAHARA**: Financial command center (SPP dues, daily cash collection, expenses, unpaid bills, receipt quick-action).
  - **GURU**: Teaching & academic hub (today's class schedule, classroom attendance, grading, tahfizh halaqah).
  - **MUSYRIF**: Dormitory & student life (room inspection, prayer attendance, night check, outing permissions).
  - **WALI_SANTRI**: Parent/Guardian portal (individual child progress, Quran recitation milestone, tuition bills & payment history, health/leave permits).
  - **SUPER_ADMIN**: SaaS multi-tenant governance (tenant registry, subscription tiers, platform audit, system health).
- **Contextual Navigation**: Desktop sidebar and mobile bottom bar must adapt links based on active user role and active tenant modules.

## 10. Invarian Struktur Role & Navigasi (Sesuai SantriOS_Role_Fitur_Halaman.md)
Setiap tampilan dan navigasi harus merujuk pada hierarki resmi 5 area utama:
1. **Kiai / Pengasuh (Executive Mode)**:
   - Fokus: Monitor → Review → Approve → Decide → Evaluate.
   - Menu: Dashboard, Kondisi Pesantren (Radar), Santri (360), Akademik, Tahfizh, Keuangan, Kesantrian, Persetujuan, Laporan, Notifikasi, Pengaturan.
   - Mobile: Dashboard | Kondisi | Persetujuan | Laporan | Pengaturan.
2. **Admin / TU / Sekretaris (Administration Mode)**:
   - Fokus: Input → Kelola → Verifikasi → Arsipkan → Laporkan.
   - Menu Terkelompok:
     - Data (Santri, Wali Santri, Guru & Staff, Master Data)
     - Administrasi (Surat, Dokumen, Perizinan, Disposisi)
     - Akademik (Kelas, Jadwal, Absensi)
     - PPDB
     - Keuangan (Tagihan, Pembayaran)
     - Kegiatan & Pengumuman
     - Laporan & Pengaturan
3. **Guru / Ustadz (Teaching Mode)**:
   - Fokus: Mengajar → Memantau → Menilai → Membina → Berkomunikasi.
   - Menu: Dashboard, Jadwal Saya, Kelas Saya, Absensi, Nilai, Tugas, Perkembangan Santri.
   - Assignment Tahfizh (bukan role terpisah): Mengaktifkan submenu Tahfizh (Halaqah Saya, Setoran, Murajaah, Target Hafalan, Ujian, Perkembangan Santri, Laporan).
   - Data finansial dan data sensitif keluarga tidak boleh tampil untuk role Guru.
4. **Bendahara (Finance Mode)**:
   - Fokus: Tagihan → Pembayaran → Pemasukan → Pengeluaran → Rekonsiliasi → Laporan.
   - Menu Terkelompok: Keuangan (Kas, Bank, Transfer), Tagihan (Massal, Tunggakan), Pembayaran (Verifikasi, Kwitansi), Pengajuan (Approval Kiai), Rekonsiliasi, Anggaran, Laporan.
5. **Kesantrian (Student Development & Discipline)**:
   - Nama bagian adalah **Kesantrian** (bukan Musyrif).
   - Menu Terkelompok: Kedisiplinan (Pelanggaran, Poin Konfigurasi, Prestasi, Pembinaan, Tindakan), Perizinan (Pengajuan, Persetujuan, Belum Kembali), Asrama (Gedung, Kamar, Mutasi), Kegiatan Santri, Laporan.

## 11. Invarian Dedicated Route & Fitur Khusus (Anti-Query-Tab Fallacy)
- **Setiap Item Navigasi Wajib Memiliki Halaman Rute Khusus**: Dilarang mengarahkan menu utama sidebar atau bottom navbar hanya ke query string tab (`/dashboard?tab=...`).
- **Rute Mandiri**: Setiap tombol harus memiliki subhalaman resmi di App Router (contoh: `/dashboard/surat`, `/dashboard/dokumen`, `/dashboard/perizinan`, `/dashboard/disposisi`, `/dashboard/ppdb`, `/dashboard/guru-staf`, `/dashboard/wali-santri`, `/dashboard/master`, `/dashboard/kelas`, `/dashboard/jadwal`, `/dashboard/nilai`, `/dashboard/tugas`, `/dashboard/tahfizh`, `/dashboard/pelanggaran`, `/dashboard/prestasi`, `/dashboard/pembinaan`, `/dashboard/tindakan`, `/dashboard/asrama`, `/dashboard/kegiatan`, `/dashboard/pengumuman`, `/dashboard/laporan`, `/dashboard/kondisi`, `/dashboard/persetujuan`, `/dashboard/notifikasi`, `/dashboard/finance/pengajuan`, `/dashboard/finance/rekonsiliasi`, `/dashboard/finance/anggaran`, `/dashboard/finance/pengaturan`).
- **Kelengkapan Fitur & Interaktivitas**: Setiap halaman rute wajib menyediakan fitur fungsional, filter pencarian, tabel data, aksi operasional, dan dialog preview dokumen yang siap digunakan oleh pengguna.

## 12. Invarian Fitur CRUD Lengkap pada Sub-Halaman Entitas
- **Full CRUD Requirement**: Setiap sub-halaman pengelolaan entitas wajib mendukung 4 operasi lengkap:
  1. **Create**: Tombol tambah di header atau form terdedikasi + modal input dengan validasi dan penambahan instan ke state.
  2. **Read**: Tampilan tabel / card responsive dengan live real-time search dan filter status/kategori.
  3. **Update**: Tombol edit ikon `Edit3` pada tiap baris/kartu + modal pre-populated form untuk memperbarui data di state.
  4. **Delete**: Tombol hapus ikon `Trash2` dengan konfirmasi dialog aman (`confirm`) dan pembersihan item dari state.
  5. **Feedback Toast**: Setiap mutasi (Create, Update, Delete) wajib memicu visual feedback berupa banner notifikasi toast yang otomatis hilang atau bisa ditutup manual.

