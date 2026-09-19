# SantriOS — Module System Guide

SantriOS dirancang sebagai **modular SaaS**. Setiap modul mewakili domain bisnis kepesantrenan yang dapat diaktifkan atau dinonaktifkan per tenant pesantren.

---

## Daftar 13 Modul SantriOS

| Modul | Kunci | Kategori | Keterangan |
|---|---|---|---|
| **Modul Inti & Dashboard** | `CORE` | Sistem | Fondasi sistem, multi-tenant, otentikasi, manajemen pengguna (Selalu Aktif). |
| **Data Santri** | `SANTRI` | Akademik | Biodata santri, NIS/NISN, data wali, penempatan kelas, dan riwayat. |
| **Keuangan & Tagihan** | `KEUANGAN` | Finansial | Pos tagihan SPP, pencatatan pembayaran, kas masuk/keluar, saldo audit. |
| **Absensi & Presensi** | `ABSENSI` | Operasional | Presensi harian cepat untuk shalat berjamaah, madrasah, dan asrama. |
| **Tahfizh Al-Qur'an** | `TAHFIZH` | Akademik | Setoran hafalan baru, muraja'ah, visualisasi progres juz 1–30, nilai. |
| **Akademik & Sekolah** | `AKADEMIK` | Akademik | Tahun ajaran, semester, jadwal pelajaran, penilaian, dan cetak raport. |
| **Manajemen Asrama** | `ASRAMA` | Operasional | Gedung, kamar santri, kapasitas, mutasi kamar, dan musyrif pembina. |
| **Perizinan Santri** | `PERIZINAN` | Operasional | Alur persetujuan izin keluar/pulang bertingkat (Wali → Musyrif → Pimpinan). |
| **Portal Wali Santri** | `WALI_SANTRI` | Komunikasi | Portal khusus orang tua: nilai anak, absensi, tahfizh, dan rincian SPP. |
| **PPDB Online** | `PPDB` | Penerimaan | Formulir pendaftaran calon santri baru, seleksi, dan konversi ke santri aktif. |
| **Inventaris Aset** | `INVENTARIS` | Fasilitas | Pencatatan aset barang pesantren, kondisi fisik, dan riwayat peminjaman. |
| **Koperasi & Kantin** | `KOPERASI` | Unit Bisnis | Point of Sales (kasir), stok barang kantin, dan batas belanja harian santri. |
| **Database Alumni** | `ALUMNI` | Ekosistem | Pendataan alumni santri, tahun lulus, riwayat studi lanjutan, dan profesi. |

---

## Menggunakan Feature Flags dalam Kode

### 1. Server-Side Guard
```ts
import { assertModuleEnabled } from "@santrios/modules";

export async function processTahfizhAction(activeModules: string[]) {
  // Melemparkan ModuleDisabledError (403) jika modul belum diaktifkan
  assertModuleEnabled(activeModules, "TAHFIZH");

  // Lanjutkan proses logika bisnis tahfizh...
}
```

### 2. UI Conditional Rendering
```tsx
import { hasModule } from "@santrios/modules";

export function NavigationMenu({ activeModules }: { activeModules: string[] }) {
  return (
    <div>
      {hasModule(activeModules, "KEUANGAN") && <FinanceNavTab />}
      {hasModule(activeModules, "TAHFIZH") && <TahfizhNavTab />}
    </div>
  );
}
```
