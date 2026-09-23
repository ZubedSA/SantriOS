import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as dns from "dns";

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Load environment variables if not present
if (!process.env.DATABASE_URL) {
  const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../../.env"),
  ];
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
      break;
    }
  }
}

// Prefer direct URL for reset/seed scripts to prevent PgBouncer prepared statement drops
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function resetAndSeed() {
  console.log("=============================================================");
  console.log("🔄 SantriOS: PEMBERSIHAN & PENGISIAN ULANG DATABASE (RESET & SEED)");
  console.log("=============================================================");
  console.log("📡 Menghubungkan ke database:", dbUrl ? dbUrl.replace(/:[^:@]+@/, ":***@") : "N/A");

  // -------------------------------------------------------------
  // LANGKAH 1: PENGHAPUSAN SEMUA DATA LAMA (CASCADE SAFE ORDER)
  // -------------------------------------------------------------
  console.log("\n🗑️  [1/4] Menghapus seluruh data lama di database...");
  
  try {
    const deletedAudit = await prisma.auditLog.deleteMany({});
    console.log(`   - Dihapus ${deletedAudit.count} Audit Logs`);

    const deletedNotifications = await prisma.notification.deleteMany({});
    console.log(`   - Dihapus ${deletedNotifications.count} Notifikasi`);

    const deletedPermits = await prisma.permit.deleteMany({});
    console.log(`   - Dihapus ${deletedPermits.count} Perizinan Santri`);

    const deletedHafalan = await prisma.hafalanRecord.deleteMany({});
    console.log(`   - Dihapus ${deletedHafalan.count} Catatan Tahfizh`);

    const deletedAttendance = await prisma.attendanceRecord.deleteMany({});
    console.log(`   - Dihapus ${deletedAttendance.count} Catatan Absensi`);

    const deletedTransactions = await prisma.transaction.deleteMany({});
    console.log(`   - Dihapus ${deletedTransactions.count} Transaksi Keuangan`);

    const deletedInvoices = await prisma.invoice.deleteMany({});
    console.log(`   - Dihapus ${deletedInvoices.count} Tagihan SPP & Pembayaran`);

    const deletedStudents = await prisma.student.deleteMany({});
    console.log(`   - Dihapus ${deletedStudents.count} Data Santri`);

    const deletedRooms = await prisma.dormitoryRoom.deleteMany({});
    console.log(`   - Dihapus ${deletedRooms.count} Kamar Asrama`);

    const deletedClassrooms = await prisma.classroom.deleteMany({});
    console.log(`   - Dihapus ${deletedClassrooms.count} Rombel / Kelas`);

    const deletedUserRoles = await prisma.userRole.deleteMany({});
    console.log(`   - Dihapus ${deletedUserRoles.count} Hubungan User-Role`);

    const deletedRolePermissions = await prisma.rolePermission.deleteMany({});
    console.log(`   - Dihapus ${deletedRolePermissions.count} Pemetaan Izin Role`);

    const deletedSubscriptions = await prisma.subscription.deleteMany({});
    console.log(`   - Dihapus ${deletedSubscriptions.count} Langganan Tenant`);

    const deletedTenantModules = await prisma.tenantModule.deleteMany({});
    console.log(`   - Dihapus ${deletedTenantModules.count} Modul Tenant Aktif`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`   - Dihapus ${deletedUsers.count} Akun Pengguna`);

    const deletedRoles = await prisma.role.deleteMany({});
    console.log(`   - Dihapus ${deletedRoles.count} Peran (Roles)`);

    const deletedTenants = await prisma.tenant.deleteMany({});
    console.log(`   - Dihapus ${deletedTenants.count} Organisasi Pesantren (Tenants)`);

    const deletedPerms = await prisma.permission.deleteMany({});
    console.log(`   - Dihapus ${deletedPerms.count} Permissions Master`);

    const deletedModules = await prisma.module.deleteMany({});
    console.log(`   - Dihapus ${deletedModules.count} Modul Master`);

    const deletedPlans = await prisma.plan.deleteMany({});
    console.log(`   - Dihapus ${deletedPlans.count} Paket Langganan SaaS`);

    console.log("✅ Seluruh tabel berhasil dikosongkan secara bersih 100%!");
  } catch (err: any) {
    console.error("❌ Gagal saat membersihkan database:", err.message);
    throw err;
  }

  // -------------------------------------------------------------
  // LANGKAH 2: SEEDING MASTER DATA (MODUL, PERMISSION, PLAN)
  // -------------------------------------------------------------
  console.log("\n🌱 [2/4] Menanam data master sistem (Modul, Permission, Paket SaaS)...");

  // 1. Modul SantriOS
  const modules = [
    { key: "CORE", name: "Modul Inti & Dashboard", description: "Fondasi sistem multi-tenant dan dashboard per peran", icon: "LayoutDashboard", isCore: true },
    { key: "SANTRI", name: "Data Santri", description: "Buku induk santri, biodata lengkap, dan wali", icon: "Users", isCore: false },
    { key: "KEUANGAN", name: "Keuangan & Tagihan", description: "Kasir SPP syahriyah, cetak kuitansi, buku kas, dan laporan", icon: "CreditCard", isCore: false },
    { key: "ABSENSI", name: "Absensi & Presensi", description: "Presensi harian santri, sholat berjamaah, dan kegiatan", icon: "CalendarCheck", isCore: false },
    { key: "TAHFIZH", name: "Tahfizh Al-Qur'an", description: "Setoran ziyadah, murajaah, target juz, dan syahadah", icon: "BookOpen", isCore: false },
    { key: "AKADEMIK", name: "Akademik Madrasah", description: "Tahun ajaran, kelas/rombel, jadwal mapel, dan raport", icon: "GraduationCap", isCore: false },
    { key: "ASRAMA", name: "Manajemen Asrama", description: "Gedung, kamar asrama, kapasitas kasur, dan musyrif", icon: "Home", isCore: false },
    { key: "PERIZINAN", name: "Perizinan Santri", description: "Surat izin pulang, sambang keluarga, dan persetujuan", icon: "FileCheck", isCore: false },
    { key: "WALI_SANTRI", name: "Portal Wali Santri", description: "Portal transparansi progres anak untuk orang tua santri", icon: "UserCheck", isCore: false },
    { key: "PPDB", name: "PPDB Online", description: "Penerimaan santri baru terintegrasi", icon: "UserPlus", isCore: false },
    { key: "INVENTARIS", name: "Inventaris Aset", description: "Aset barang, perlengkapan madrasah, dan sarana pondok", icon: "Package", isCore: false },
    { key: "KOPERASI", name: "Koperasi & Kantin", description: "POS kasir minimarket dan dompet digital santri", icon: "ShoppingCart", isCore: false },
    { key: "ALUMNI", name: "Database Alumni", description: "Direktori lulusan dan jaringan alumni pesantren", icon: "Award", isCore: false },
  ];

  for (const m of modules) {
    await prisma.module.create({ data: m });
  }
  console.log(`   ✅ Dibuat ${modules.length} Modul Master`);

  // 2. Permissions Master
  const permissions = [
    // Core
    { key: "core.view", name: "Lihat Dashboard", moduleKey: "CORE" },
    { key: "core.settings", name: "Kelola Pengaturan Pondok", moduleKey: "CORE" },
    { key: "settings.view", name: "Lihat Konfigurasi Sistem", moduleKey: "CORE" },
    { key: "settings.edit", name: "Edit Konfigurasi Sistem", moduleKey: "CORE" },
    // Santri
    { key: "students.view", name: "Lihat Data Santri", moduleKey: "SANTRI" },
    { key: "students.create", name: "Pendaftaran Santri Baru", moduleKey: "SANTRI" },
    { key: "students.edit", name: "Edit Biodata Santri", moduleKey: "SANTRI" },
    { key: "students.delete", name: "Hapus Data Santri", moduleKey: "SANTRI" },
    // Keuangan
    { key: "finance.view", name: "Lihat Keuangan & Tagihan", moduleKey: "KEUANGAN" },
    { key: "finance.create", name: "Input Pembayaran & Pengeluaran", moduleKey: "KEUANGAN" },
    { key: "finance.export", name: "Export Laporan Keuangan", moduleKey: "KEUANGAN" },
    { key: "finance.approve", name: "Approval Pengajuan Anggaran", moduleKey: "KEUANGAN" },
    // Absensi
    { key: "attendance.view", name: "Lihat Rekap Absensi", moduleKey: "ABSENSI" },
    { key: "attendance.mark", name: "Input & Verifikasi Presensi", moduleKey: "ABSENSI" },
    // Tahfizh
    { key: "tahfizh.view", name: "Lihat Progres Tahfizh", moduleKey: "TAHFIZH" },
    { key: "tahfizh.input", name: "Catat Setoran & Muraja'ah", moduleKey: "TAHFIZH" },
    { key: "hafalan.view", name: "Monitoring Hafalan Santri", moduleKey: "TAHFIZH" },
    { key: "hafalan.create", name: "Input Ziyadah Hafalan", moduleKey: "TAHFIZH" },
    // Perizinan
    { key: "permits.view", name: "Lihat Surat Izin Santri", moduleKey: "PERIZINAN" },
    { key: "permits.create", name: "Pengajuan Izin Keluar/Pulang", moduleKey: "PERIZINAN" },
    { key: "permits.approve", name: "Otorisasi & Approval Surat Izin", moduleKey: "PERIZINAN" },
    // Asrama
    { key: "dormitory.view", name: "Lihat Kamar & Penempatan", moduleKey: "ASRAMA" },
    { key: "dormitory.manage", name: "Atur Pembagian Kamar Asrama", moduleKey: "ASRAMA" },
    // Wali Santri
    { key: "guardian.view", name: "Akses Dashboard Khusus Wali", moduleKey: "WALI_SANTRI" },
  ];

  for (const p of permissions) {
    await prisma.permission.create({ data: p });
  }
  console.log(`   ✅ Dibuat ${permissions.length} Permissions`);

  // 3. Paket Langganan SaaS
  const plans = [
    { key: "FREE", name: "Paket Starter (Gratis)", priceMonth: 0, maxStudents: 50 },
    { key: "PRO", name: "Paket Pesantren Berkembang", priceMonth: 299000, maxStudents: 500 },
    { key: "ENTERPRISE", name: "Paket Pesantren Besar", priceMonth: 799000, maxStudents: 5000 },
  ];
  for (const pl of plans) {
    await prisma.plan.create({ data: pl });
  }
  console.log(`   ✅ Dibuat ${plans.length} Paket Langganan`);

  // -------------------------------------------------------------
  // LANGKAH 3: SEEDING TENANT & PENGGUNA RESMI
  // -------------------------------------------------------------
  console.log("\n🏢 [3/4] Menanam Tenant Pondok Pesantren & Akun Peran...");

  // Tenant 1: Pondok Pesantren Al-Hikmah Modern (Tenant Utama)
  const tenantAlHikmah = await prisma.tenant.create({
    data: {
      slug: "al-hikmah",
      name: "Pondok Pesantren Al-Hikmah Modern",
      tagline: "Mencetak Generasi Qur'ani, Berakhlak Mulia & Mandiri",
      phone: "0341-551234",
      email: "info@alhikmah-modern.sch.id",
      address: "Jl. Pondok Indah No. 99, Joyo Agung",
      city: "Kota Malang",
      province: "Jawa Timur",
      status: "ACTIVE",
    },
  });

  // Tenant 2: Pesantren Darussalam Al-Islami (Tenant Uji Isolasi)
  const tenantDarussalam = await prisma.tenant.create({
    data: {
      slug: "darussalam",
      name: "Pesantren Darussalam Al-Islami",
      tagline: "Tafaqquh Fiddin & Berkhidmat untuk Ummat",
      phone: "0321-884321",
      email: "sekretariat@darussalam.or.id",
      address: "Jl. Raya Tebuireng No. 12",
      city: "Kabupaten Jombang",
      province: "Jawa Timur",
      status: "ACTIVE",
    },
  });

  console.log(`   ✅ Dibuat 2 Tenant: "${tenantAlHikmah.name}" & "${tenantDarussalam.name}"`);

  // Aktifkan modul untuk Al-Hikmah
  const activeModuleKeys = ["CORE", "SANTRI", "KEUANGAN", "ABSENSI", "TAHFIZH", "AKADEMIK", "ASRAMA", "PERIZINAN", "WALI_SANTRI"];
  const dbModules = await prisma.module.findMany();
  for (const m of dbModules.filter(m => activeModuleKeys.includes(m.key))) {
    await prisma.tenantModule.create({
      data: {
        tenantId: tenantAlHikmah.id,
        moduleId: m.id,
        enabled: true,
      },
    });
  }

  // Buat Role untuk Al-Hikmah
  const roleNames = [
    { name: "OWNER", description: "Pengasuh / Pimpinan Pondok Pesantren (Hak Akses Penuh)" },
    { name: "ADMIN", description: "Kepala Tata Usaha & Administrator Operasional" },
    { name: "BENDAHARA", description: "Pengelola Keuangan, Tagihan SPP, dan Pembukuan Kas" },
    { name: "GURU", description: "Dewan Asatidz, Guru Mapel, dan Pembimbing Tahfizh" },
    { name: "KESANTRIAN", description: "Bagian Kesantrian, Kedisiplinan & Perizinan" },
    { name: "MUSYRIF", description: "Pembina Asrama dan Pembimbing Kamar Santri" },
    { name: "WALI_SANTRI", description: "Orang Tua / Wali Santri Aktif" },
    { name: "SANTRI", description: "Santri Aktif Pesantren" },
  ];

  const roleMapAlHikmah: Record<string, string> = {};
  for (const rn of roleNames) {
    const r = await prisma.role.create({
      data: {
        tenantId: tenantAlHikmah.id,
        name: rn.name,
        description: rn.description,
        isSystem: true,
      },
    });
    roleMapAlHikmah[rn.name] = r.id;
  }

  // Petakan Permissions ke Role di Al-Hikmah
  const allPerms = await prisma.permission.findMany();
  const permsByModule = (keys: string[]) => allPerms.filter(p => keys.includes(p.moduleKey)).map(p => ({ permissionId: p.id }));

  // OWNER -> All permissions
  await prisma.rolePermission.createMany({
    data: allPerms.map(p => ({ roleId: roleMapAlHikmah["OWNER"], permissionId: p.id })),
  });
  // ADMIN -> Core, Santri, Absensi, Perizinan, Tahfizh view
  await prisma.rolePermission.createMany({
    data: permsByModule(["CORE", "SANTRI", "ABSENSI", "PERIZINAN", "TAHFIZH"]).map(p => ({
      roleId: roleMapAlHikmah["ADMIN"],
      permissionId: p.permissionId,
    })),
  });
  // BENDAHARA -> Keuangan + Santri view
  await prisma.rolePermission.createMany({
    data: permsByModule(["KEUANGAN", "CORE"]).map(p => ({
      roleId: roleMapAlHikmah["BENDAHARA"],
      permissionId: p.permissionId,
    })),
  });
  // GURU -> Tahfizh + Absensi
  await prisma.rolePermission.createMany({
    data: permsByModule(["TAHFIZH", "ABSENSI"]).map(p => ({
      roleId: roleMapAlHikmah["GURU"],
      permissionId: p.permissionId,
    })),
  });
  // KESANTRIAN / MUSYRIF -> Perizinan + Asrama + Absensi
  await prisma.rolePermission.createMany({
    data: permsByModule(["PERIZINAN", "ASRAMA", "ABSENSI"]).map(p => ({
      roleId: roleMapAlHikmah["KESANTRIAN"],
      permissionId: p.permissionId,
    })),
  });
  // WALI_SANTRI -> Guardian view
  await prisma.rolePermission.createMany({
    data: permsByModule(["WALI_SANTRI"]).map(p => ({
      roleId: roleMapAlHikmah["WALI_SANTRI"],
      permissionId: p.permissionId,
    })),
  });

  // Global Super Admin Role
  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPER_ADMIN",
      description: "SaaS Platform Super Administrator",
      isSystem: true,
      tenantId: null,
    },
  });

  // Buat User Terverifikasi & Hubungkan ke Role
  const defaultPw = hashPassword("Demo123456!");
  const superPw = hashPassword("SuperAdmin123456!");

  const demoAccounts = [
    { email: "kiai@demo.local", name: "KH. Abdullah Munir", role: "OWNER" },
    { email: "owner@demo.local", name: "KH. Abdullah Munir", role: "OWNER" },
    { email: "admin@demo.local", name: "Ustadz Ridwan, S.Pd.", role: "ADMIN" },
    { email: "bendahara@demo.local", name: "Ustadz Syamsul Hadi, S.E.", role: "BENDAHARA" },
    { email: "guru@demo.local", name: "Ustadzah Fatimah, Lc.", role: "GURU" },
    { email: "kesantrian@demo.local", name: "Ustadz Fatih Al-Banjari", role: "KESANTRIAN" },
    { email: "musyrif@demo.local", name: "Ustadz Fatih Al-Banjari", role: "KESANTRIAN" },
    { email: "wali@demo.local", name: "Bpk. Rahmat Santoso (Wali Fauzan)", role: "WALI_SANTRI" },
  ];

  for (const acc of demoAccounts) {
    let user = await prisma.user.findUnique({ where: { email: acc.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: acc.email,
          name: acc.name,
          passwordHash: defaultPw,
          status: "ACTIVE",
          phone: "081234567890",
        },
      });
    }

    const roleId = roleMapAlHikmah[acc.role];
    if (roleId) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          tenantId: tenantAlHikmah.id,
          roleId,
        },
      });
    }
  }

  // Super Admin User
  const saUser = await prisma.user.create({
    data: {
      email: "superadmin@santrios.local",
      name: "SaaS Super Admin Platform",
      passwordHash: superPw,
      status: "ACTIVE",
      phone: "081199887766",
    },
  });
  await prisma.userRole.create({
    data: {
      userId: saUser.id,
      tenantId: tenantAlHikmah.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(`   ✅ Dibuat ${demoAccounts.length + 1} Akun Terverifikasi (Password: Demo123456! / SuperAdmin123456!)`);

  // -------------------------------------------------------------
  // LANGKAH 4: DATA DOMAIN (KELAS, ASRAMA, SANTRI, TAHFIZH, SPP)
  // -------------------------------------------------------------
  console.log("\n🎓 [4/4] Menanam data domain operasional (Kelas, Kamar, Santri, Absensi, Tahfizh, Tagihan, Kasir)...");

  // 1. Data Kelas / Rombel
  const classes = [
    { name: "Kelas Ulya 2", level: "SMA", academicYear: "2026/2027" },
    { name: "Kelas Ulya 1", level: "SMA", academicYear: "2026/2027" },
    { name: "Kelas Wustha 3", level: "SMP", academicYear: "2026/2027" },
    { name: "Kelas Wustha 2", level: "SMP", academicYear: "2026/2027" },
    { name: "Kelas Wustha 1", level: "SMP", academicYear: "2026/2027" },
  ];
  const classIdMap: Record<string, string> = {};
  for (const c of classes) {
    const cls = await prisma.classroom.create({
      data: {
        tenantId: tenantAlHikmah.id,
        name: c.name,
        level: c.level,
        academicYear: c.academicYear,
      },
    });
    classIdMap[c.name] = cls.id;
  }

  // 2. Data Kamar Asrama
  const rooms = [
    { name: "Kamar Abu Bakar (A-01)", building: "Gedung Al-Faruq (Putra)", capacity: 10 },
    { name: "Kamar Umar bin Khattab (A-02)", building: "Gedung Al-Faruq (Putra)", capacity: 10 },
    { name: "Kamar Utsman bin Affan (A-03)", building: "Gedung Al-Faruq (Putra)", capacity: 12 },
    { name: "Kamar Ali bin Abi Thalib (A-04)", building: "Gedung Al-Faruq (Putra)", capacity: 12 },
    { name: "Kamar Sayyidah Khadijah (B-01)", building: "Gedung Az-Zahra (Putri)", capacity: 12 },
  ];
  const roomIdMap: Record<string, string> = {};
  for (const r of rooms) {
    const rm = await prisma.dormitoryRoom.create({
      data: {
        tenantId: tenantAlHikmah.id,
        name: r.name,
        building: r.building,
        capacity: r.capacity,
      },
    });
    roomIdMap[r.name] = rm.id;
  }

  // 3. 15 Data Santri Lengkap & Valid
  const studentsList = [
    {
      nis: "20260001",
      nisn: "0091827361",
      name: "Ahmad Fauzan Al-Ghifari",
      nickname: "Fauzan",
      gender: "LAKI_LAKI",
      birthPlace: "Surabaya",
      birthDate: new Date("2009-04-12"),
      address: "Jl. Rungkut Asri Timur No. 45, Surabaya",
      phone: "081234567801",
      status: "AKTIF",
      className: "Kelas Ulya 2",
      roomName: "Kamar Utsman bin Affan (A-03)",
      guardianName: "Bpk. Rahmat Santoso",
      guardianPhone: "081234567890",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260002",
      nisn: "0091827362",
      name: "Muhammad Ali Al-Fatih",
      nickname: "Ali",
      gender: "LAKI_LAKI",
      birthPlace: "Malang",
      birthDate: new Date("2009-08-25"),
      address: "Jl. Ijen Besar No. 12, Malang",
      phone: "081234567802",
      status: "AKTIF",
      className: "Kelas Ulya 2",
      roomName: "Kamar Abu Bakar (A-01)",
      guardianName: "Bpk. Hendra Gunawan",
      guardianPhone: "081234567891",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260003",
      nisn: "0101827363",
      name: "Bilal Ibnu Rabah",
      nickname: "Bilal",
      gender: "LAKI_LAKI",
      birthPlace: "Gresik",
      birthDate: new Date("2010-01-15"),
      address: "Jl. Veteran No. 8, Gresik",
      phone: "081234567803",
      status: "IZIN",
      className: "Kelas Ulya 1",
      roomName: "Kamar Umar bin Khattab (A-02)",
      guardianName: "Ibu Siti Khodijah",
      guardianPhone: "081234567892",
      guardianRelation: "IBU",
    },
    {
      nis: "20260004",
      nisn: "0101827364",
      name: "Farhan Hakim Pratama",
      nickname: "Farhan",
      gender: "LAKI_LAKI",
      birthPlace: "Sidoarjo",
      birthDate: new Date("2010-06-30"),
      address: "Jl. Pahlawan No. 20, Sidoarjo",
      phone: "081234567804",
      status: "AKTIF",
      className: "Kelas Ulya 1",
      roomName: "Kamar Umar bin Khattab (A-02)",
      guardianName: "Bpk. Agus Santoso",
      guardianPhone: "081234567893",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260005",
      nisn: "0111827365",
      name: "Zaidan Al-Ayyubi",
      nickname: "Zaidan",
      gender: "LAKI_LAKI",
      birthPlace: "Pasuruan",
      birthDate: new Date("2011-03-10"),
      address: "Jl. Untung Suropati No. 5, Pasuruan",
      phone: "081234567805",
      status: "AKTIF",
      className: "Kelas Wustha 3",
      roomName: "Kamar Ali bin Abi Thalib (A-04)",
      guardianName: "Bpk. Bambang Irawan",
      guardianPhone: "081234567894",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260006",
      nisn: "0111827366",
      name: "Hasan Basri",
      nickname: "Hasan",
      gender: "LAKI_LAKI",
      birthPlace: "Kediri",
      birthDate: new Date("2011-09-18"),
      address: "Jl. Dhoho No. 77, Kediri",
      phone: "081234567806",
      status: "AKTIF",
      className: "Kelas Wustha 3",
      roomName: "Kamar Ali bin Abi Thalib (A-04)",
      guardianName: "Bpk. Mansur Hidayat",
      guardianPhone: "081234567895",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260007",
      nisn: "0121827367",
      name: "Ibrahim Al-Khalil",
      nickname: "Ibrahim",
      gender: "LAKI_LAKI",
      birthPlace: "Jombang",
      birthDate: new Date("2012-02-14"),
      address: "Jl. KH. Wahid Hasyim No. 19, Jombang",
      phone: "081234567807",
      status: "AKTIF",
      className: "Kelas Wustha 2",
      roomName: "Kamar Abu Bakar (A-01)",
      guardianName: "Bpk. Ahmad Syafi'i",
      guardianPhone: "081234567896",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260008",
      nisn: "0121827368",
      name: "Yusuf Mansur Ridwan",
      nickname: "Yusuf",
      gender: "LAKI_LAKI",
      birthPlace: "Mojokerto",
      birthDate: new Date("2012-07-22"),
      address: "Jl. Majapahit No. 88, Mojokerto",
      phone: "081234567808",
      status: "SAKIT",
      className: "Kelas Wustha 2",
      roomName: "Kamar Utsman bin Affan (A-03)",
      guardianName: "Ibu Nurul Aini",
      guardianPhone: "081234567897",
      guardianRelation: "IBU",
    },
    {
      nis: "20260009",
      nisn: "0131827369",
      name: "Abdullah Gymnastiar",
      nickname: "Aa",
      gender: "LAKI_LAKI",
      birthPlace: "Bandung",
      birthDate: new Date("2013-05-19"),
      address: "Jl. Gegerkalong Girang No. 23, Bandung",
      phone: "081234567809",
      status: "AKTIF",
      className: "Kelas Wustha 1",
      roomName: "Kamar Abu Bakar (A-01)",
      guardianName: "Bpk. Deden Kurnia",
      guardianPhone: "081234567898",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260010",
      nisn: "0131827370",
      name: "Salman Al-Farisi",
      nickname: "Salman",
      gender: "LAKI_LAKI",
      birthPlace: "Batu",
      birthDate: new Date("2013-11-03"),
      address: "Jl. Panglima Sudirman No. 101, Kota Batu",
      phone: "081234567810",
      status: "AKTIF",
      className: "Kelas Wustha 1",
      roomName: "Kamar Ali bin Abi Thalib (A-04)",
      guardianName: "Bpk. Rudi Hermawan",
      guardianPhone: "081234567899",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260011",
      nisn: "0091827371",
      name: "Fatimah Az-Zahra",
      nickname: "Fatimah",
      gender: "PEREMPUAN",
      birthPlace: "Malang",
      birthDate: new Date("2009-03-15"),
      address: "Jl. Borobudur No. 40, Malang",
      phone: "081234567811",
      status: "AKTIF",
      className: "Kelas Ulya 2",
      roomName: "Kamar Sayyidah Khadijah (B-01)",
      guardianName: "Bpk. Subhan Baswedan",
      guardianPhone: "081234567881",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260012",
      nisn: "0101827372",
      name: "Aisyah Humaira Putri",
      nickname: "Aisyah",
      gender: "PEREMPUAN",
      birthPlace: "Surabaya",
      birthDate: new Date("2010-09-08"),
      address: "Jl. Dharmawangsa No. 15, Surabaya",
      phone: "081234567812",
      status: "AKTIF",
      className: "Kelas Ulya 1",
      roomName: "Kamar Sayyidah Khadijah (B-01)",
      guardianName: "Ibu Wardah Maulida",
      guardianPhone: "081234567882",
      guardianRelation: "IBU",
    },
    {
      nis: "20260013",
      nisn: "0111827373",
      name: "Maryam binti Imran",
      nickname: "Maryam",
      gender: "PEREMPUAN",
      birthPlace: "Probolinggo",
      birthDate: new Date("2011-12-01"),
      address: "Jl. Sukarno Hatta No. 8, Probolinggo",
      phone: "081234567813",
      status: "AKTIF",
      className: "Kelas Wustha 3",
      roomName: "Kamar Sayyidah Khadijah (B-01)",
      guardianName: "Bpk. Lukman Hakim",
      guardianPhone: "081234567883",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260014",
      nisn: "0121827374",
      name: "Khadijah Al-Kubra",
      nickname: "Khadijah",
      gender: "PEREMPUAN",
      birthPlace: "Lamongan",
      birthDate: new Date("2012-04-17"),
      address: "Jl. Babat Raya No. 90, Lamongan",
      phone: "081234567814",
      status: "AKTIF",
      className: "Kelas Wustha 2",
      roomName: "Kamar Sayyidah Khadijah (B-01)",
      guardianName: "Bpk. Masykur Yahya",
      guardianPhone: "081234567884",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260015",
      nisn: "0131827375",
      name: "Zainab binti Ali",
      nickname: "Zainab",
      gender: "PEREMPUAN",
      birthPlace: "Tuban",
      birthDate: new Date("2013-08-20"),
      address: "Jl. Basuki Rahmat No. 34, Tuban",
      phone: "081234567815",
      status: "AKTIF",
      className: "Kelas Wustha 1",
      roomName: "Kamar Sayyidah Khadijah (B-01)",
      guardianName: "Ibu Salma Wahidah",
      guardianPhone: "081234567885",
      guardianRelation: "IBU",
    },
  ];

  const studentDbMap: Record<string, any> = {};
  for (const s of studentsList) {
    const std = await prisma.student.create({
      data: {
        tenantId: tenantAlHikmah.id,
        nis: s.nis,
        nisn: s.nisn,
        name: s.name,
        nickname: s.nickname,
        gender: s.gender,
        birthPlace: s.birthPlace,
        birthDate: s.birthDate,
        address: s.address,
        phone: s.phone,
        status: s.status,
        classroomId: classIdMap[s.className],
        dormitoryRoomId: roomIdMap[s.roomName],
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianRelation: s.guardianRelation,
      },
    });
    studentDbMap[s.nis] = std;
  }
  console.log(`   ✅ Dibuat ${studentsList.length} Santri Terdaftar Lengkap`);

  // 4. Data Absensi Harian (Hari ini & Kemarin)
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  for (const s of studentsList) {
    const std = studentDbMap[s.nis];
    // Absensi hari ini
    let statusToday = "HADIR";
    if (s.nis === "20260003") statusToday = "IZIN";
    if (s.nis === "20260008") statusToday = "SAKIT";

    await prisma.attendanceRecord.create({
      data: {
        tenantId: tenantAlHikmah.id,
        studentId: std.id,
        date: today,
        type: "HARIAN",
        status: statusToday,
        notes: statusToday === "IZIN" ? "Izin pulang acara keluarga" : statusToday === "SAKIT" ? "Istirahat di poskestren" : "Hadir tepat waktu",
      },
    });

    // Absensi kemarin
    await prisma.attendanceRecord.create({
      data: {
        tenantId: tenantAlHikmah.id,
        studentId: std.id,
        date: yesterday,
        type: "HARIAN",
        status: "HADIR",
        notes: "Hadir penuh",
      },
    });
  }
  console.log(`   ✅ Dibuat ${studentsList.length * 2} Rekaman Presensi Harian`);

  // 5. Data Setoran Tahfizh Al-Qur'an
  const guruUser = await prisma.user.findUnique({ where: { email: "guru@demo.local" } });
  const tahfizhRecords = [
    { nis: "20260001", surah: "An-Naba'", juz: 30, ayahStart: 1, ayahEnd: 40, grade: "MUMTAZ", notes: "Makharijul huruf sangat fasih dan mutqin" },
    { nis: "20260001", surah: "An-Nazi'at", juz: 30, ayahStart: 1, ayahEnd: 46, grade: "MUMTAZ", notes: "Lancar sekali tanpa teguran" },
    { nis: "20260002", surah: "Al-Mulk", juz: 29, ayahStart: 1, ayahEnd: 30, grade: "JAYYID_JIDDAN", notes: "Tajwid tartil, perhatikan ghunnah" },
    { nis: "20260002", surah: "Al-Qalam", juz: 29, ayahStart: 1, ayahEnd: 52, grade: "MUMTAZ", notes: "Mutqin lancar" },
    { nis: "20260004", surah: "Yasin", juz: 22, ayahStart: 1, ayahEnd: 83, grade: "MUMTAZ", notes: "Setoran 1 surah penuh sekali duduk" },
    { nis: "20260005", surah: "Ar-Rahman", juz: 27, ayahStart: 1, ayahEnd: 78, grade: "JAYYID_JIDDAN", notes: "Lancar, waqaf ibtida' rapi" },
    { nis: "20260006", surah: "Al-Waqi'ah", juz: 27, ayahStart: 1, ayahEnd: 96, grade: "MUMTAZ", notes: "Sangat baik" },
    { nis: "20260007", surah: "Al-Kahf", juz: 15, ayahStart: 1, ayahEnd: 50, grade: "JAYYID", notes: "Perlu murajaah di ayat 30-40" },
    { nis: "20260009", surah: "At-Takwir", juz: 30, ayahStart: 1, ayahEnd: 29, grade: "MUMTAZ", notes: "Fasih makhraj huruf" },
    { nis: "20260011", surah: "Maryam", juz: 16, ayahStart: 1, ayahEnd: 98, grade: "MUMTAZ", notes: "Suara merdu dan tartil mutqin" },
    { nis: "20260012", surah: "Al-Insan", juz: 29, ayahStart: 1, ayahEnd: 31, grade: "MUMTAZ", notes: "Bagus dan hafal kuat" },
    { nis: "20260013", surah: "Al-Mursalat", juz: 29, ayahStart: 1, ayahEnd: 50, grade: "JAYYID_JIDDAN", notes: "Lancar dengan bimbingan minim" },
  ];

  for (const tr of tahfizhRecords) {
    const std = studentDbMap[tr.nis];
    await prisma.hafalanRecord.create({
      data: {
        tenantId: tenantAlHikmah.id,
        studentId: std.id,
        surah: tr.surah,
        juz: tr.juz,
        ayahStart: tr.ayahStart,
        ayahEnd: tr.ayahEnd,
        grade: tr.grade,
        notes: tr.notes,
        mentorId: guruUser?.id || null,
      },
    });
  }
  console.log(`   ✅ Dibuat ${tahfizhRecords.length} Setoran Mutaba'ah Tahfizh`);

  // 6. Data Tagihan & Transaksi Keuangan (SPP Syahriyah, Kas, Belanja)
  const invoicesToCreate = [
    // Lunas
    { nis: "20260001", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "PAID", method: "TRANSFER" },
    { nis: "20260002", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "PAID", method: "CASH" },
    { nis: "20260004", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "PAID", method: "TRANSFER" },
    { nis: "20260005", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "PAID", method: "TRANSFER" },
    { nis: "20260011", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "PAID", method: "CASH" },
    // Menunggak / Belum Bayar
    { nis: "20260003", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "OVERDUE", method: null },
    { nis: "20260006", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260007", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260008", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "OVERDUE", method: null },
    { nis: "20260009", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260010", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260012", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260013", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "OVERDUE", method: null },
    { nis: "20260014", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
    { nis: "20260015", title: "SPP Syahriyah September 2026", category: "SPP", amount: 500000, status: "UNPAID", method: null },
  ];

  let kwCounter = 1;
  for (const inv of invoicesToCreate) {
    const std = studentDbMap[inv.nis];
    const createdInv = await prisma.invoice.create({
      data: {
        tenantId: tenantAlHikmah.id,
        studentId: std.id,
        title: inv.title,
        category: inv.category,
        amount: inv.amount,
        dueDate: new Date("2026-09-10"),
        status: inv.status,
        paidAt: inv.status === "PAID" ? new Date("2026-09-05") : null,
      },
    });

    if (inv.status === "PAID" && inv.method) {
      const receiptNo = `KW-202609-${String(kwCounter++).padStart(3, "0")}`;
      await prisma.transaction.create({
        data: {
          tenantId: tenantAlHikmah.id,
          receiptNo,
          type: "INCOME",
          category: "SPP",
          amount: inv.amount,
          method: inv.method,
          description: `Pembayaran ${inv.title} an. ${std.name} (${std.nis})`,
          studentId: std.id,
          invoiceId: createdInv.id,
        },
      });
    }
  }

  // Tambahkan transaksi operasional pengeluaran kas
  const expenses = [
    { receiptNo: "KW-OUT-202609-001", category: "BELANJA_DAPUR", amount: 4850000, method: "TRANSFER", description: "Pengadaan beras 500kg & bahan dapur konsumsi santri" },
    { receiptNo: "KW-OUT-202609-002", category: "LISTRIK_INTERNET", amount: 1850000, method: "TRANSFER", description: "Tagihan listrik PLN & internet fiber optik pesantren" },
    { receiptNo: "KW-OUT-202609-003", category: "BISYARAH_ASATIDZ", amount: 6500000, method: "TRANSFER", description: "Bisyarah & kafalah dewan asatidz dan pembina tahfizh" },
    { receiptNo: "KW-OUT-202609-004", category: "PEMELIHARAAN_GEDUNG", amount: 1200000, method: "CASH", description: "Perbaikan sanitasi & pipa air asrama putra" },
  ];

  for (const exp of expenses) {
    await prisma.transaction.create({
      data: {
        tenantId: tenantAlHikmah.id,
        receiptNo: exp.receiptNo,
        type: "EXPENSE",
        category: exp.category,
        amount: exp.amount,
        method: exp.method,
        description: exp.description,
      },
    });
  }
  console.log(`   ✅ Dibuat ${invoicesToCreate.length} Tagihan Invoice & ${kwCounter - 1 + expenses.length} Transaksi Kasir/Buku Kas`);

  // 7. Data Perizinan Santri
  const kesantrianUser = await prisma.user.findUnique({ where: { email: "kesantrian@demo.local" } });
  const permits = [
    {
      nis: "20260003",
      type: "PULANG",
      reason: "Menghadiri walimatul 'ursy kakak kandung di Gresik",
      startDate: new Date("2026-09-22"),
      endDate: new Date("2026-09-25"),
      status: "APPROVED",
      approvedById: kesantrianUser?.id,
    },
    {
      nis: "20260008",
      type: "SAKIT",
      reason: "Pemeriksaan lanjutan dokter spesialis THT di RSUD",
      startDate: new Date("2026-09-23"),
      endDate: new Date("2026-09-24"),
      status: "APPROVED",
      approvedById: kesantrianUser?.id,
    },
    {
      nis: "20260005",
      type: "SAMBANG",
      reason: "Keluarga berkunjung sambang bulanan ke pondok",
      startDate: new Date("2026-09-27"),
      endDate: new Date("2026-09-27"),
      status: "PENDING",
      approvedById: null,
    },
  ];

  for (const pm of permits) {
    const std = studentDbMap[pm.nis];
    await prisma.permit.create({
      data: {
        tenantId: tenantAlHikmah.id,
        studentId: std.id,
        type: pm.type,
        reason: pm.reason,
        startDate: pm.startDate,
        endDate: pm.endDate,
        status: pm.status,
        approvedById: pm.approvedById || null,
      },
    });
  }
  console.log(`   ✅ Dibuat ${permits.length} Surat Izin Santri`);

  // 8. Log Audit Jejak Keamanan
  await prisma.auditLog.create({
    data: {
      tenantId: tenantAlHikmah.id,
      action: "RESET_AND_FRESH_SEED",
      entity: "Database",
      entityId: tenantAlHikmah.id,
      newData: {
        totalStudents: studentsList.length,
        totalClasses: classes.length,
        totalRooms: rooms.length,
        seededAt: new Date().toISOString(),
        message: "Database SantriOS berhasil di-reset dan diisi ulang data valid 100%.",
      },
    },
  });

  console.log("=============================================================");
  console.log("🎉 PENGISIAN DATABASE SELESAI DENGAN SUKSES 100%!");
  console.log("=============================================================");
  console.log("Kredensial Login Demo yang Siap Digunakan:");
  console.log("👉 Kiai / Pimpinan   : kiai@demo.local        | Sandi: Demo123456!");
  console.log("👉 Administrator     : admin@demo.local       | Sandi: Demo123456!");
  console.log("👉 Bendahara         : bendahara@demo.local   | Sandi: Demo123456!");
  console.log("👉 Dewan Guru        : guru@demo.local        | Sandi: Demo123456!");
  console.log("👉 Kesantrian/Musyrif: kesantrian@demo.local  | Sandi: Demo123456!");
  console.log("👉 Wali Santri       : wali@demo.local        | Sandi: Demo123456!");
  console.log("👉 Super Admin SaaS  : superadmin@santrios.local | Sandi: SuperAdmin123456!");
  console.log("=============================================================");
}

if (require.main === module) {
  resetAndSeed()
    .catch((err) => {
      console.error("\n❌ Error saat menjalankan reset & seed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
