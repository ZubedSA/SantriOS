import { prisma } from "../src/client";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// Memastikan DATABASE_URL terisi saat seed dijalankan langsung via tsx
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

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Starting SantriOS Database Seed...");

  // 1. Seed Modules
  const modules = [
    { key: "CORE", name: "Modul Inti & Dashboard", description: "Fondasi sistem dan dashboard", icon: "LayoutDashboard", isCore: true },
    { key: "SANTRI", name: "Data Santri", description: "Biodata, data induk, dan riwayat santri", icon: "Users", isCore: false },
    { key: "KEUANGAN", name: "Keuangan & Tagihan", description: "Tagihan, pembayaran, kas, laporan", icon: "CreditCard", isCore: false },
    { key: "ABSENSI", name: "Absensi & Presensi", description: "Presensi santri cepat", icon: "CalendarCheck", isCore: false },
    { key: "TAHFIZH", name: "Tahfizh Al-Qur'an", description: "Setoran hafalan, murajaah, progres", icon: "BookOpen", isCore: false },
    { key: "AKADEMIK", name: "Akademik", description: "Tahun ajaran, kelas, jadwal, nilai", icon: "GraduationCap", isCore: false },
    { key: "ASRAMA", name: "Manajemen Asrama", description: "Gedung, kamar, penempatan", icon: "Home", isCore: false },
    { key: "PERIZINAN", name: "Perizinan", description: "Alur izin santri", icon: "FileCheck", isCore: false },
    { key: "WALI_SANTRI", name: "Portal Wali Santri", description: "Portal khusus orang tua", icon: "UserCheck", isCore: false },
    { key: "PPDB", name: "PPDB Online", description: "Penerimaan santri baru", icon: "UserPlus", isCore: false },
    { key: "INVENTARIS", name: "Inventaris Aset", description: "Aset barang dan sarana", icon: "Package", isCore: false },
    { key: "KOPERASI", name: "Koperasi & Kantin", description: "POS kasir dan toko", icon: "ShoppingCart", isCore: false },
    { key: "ALUMNI", name: "Database Alumni", description: "Data lulusan dan kiprah alumni", icon: "Award", isCore: false },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { key: mod.key },
      update: { name: mod.name, description: mod.description, icon: mod.icon, isCore: mod.isCore },
      create: { key: mod.key, name: mod.name, description: mod.description, icon: mod.icon, isCore: mod.isCore },
    });
  }
  console.log(`✅ Seeded ${modules.length} Modules`);

  // 2. Seed Permissions
  const permissions = [
    { key: "core.view", name: "Lihat Dashboard", moduleKey: "CORE" },
    { key: "core.settings", name: "Kelola Pengaturan", moduleKey: "CORE" },
    { key: "students.view", name: "Lihat Santri", moduleKey: "SANTRI" },
    { key: "students.create", name: "Tambah Santri", moduleKey: "SANTRI" },
    { key: "students.update", name: "Edit Santri", moduleKey: "SANTRI" },
    { key: "students.delete", name: "Hapus Santri", moduleKey: "SANTRI" },
    { key: "finance.view", name: "Lihat Keuangan", moduleKey: "KEUANGAN" },
    { key: "finance.create", name: "Input Pembayaran/Pengeluaran", moduleKey: "KEUANGAN" },
    { key: "finance.approve", name: "Persetujuan Keuangan", moduleKey: "KEUANGAN" },
    { key: "attendance.view", name: "Lihat Absensi", moduleKey: "ABSENSI" },
    { key: "attendance.mark", name: "Input Absensi", moduleKey: "ABSENSI" },
    { key: "hafalan.view", name: "Lihat Hafalan", moduleKey: "TAHFIZH" },
    { key: "hafalan.create", name: "Input Setoran Tahfizh", moduleKey: "TAHFIZH" },
    { key: "hafalan.update", name: "Update Target Tahfizh", moduleKey: "TAHFIZH" },
    { key: "dormitory.view", name: "Lihat Kamar & Asrama", moduleKey: "ASRAMA" },
    { key: "dormitory.manage", name: "Kelola Kamar & Musyrif", moduleKey: "ASRAMA" },
    { key: "permission.view", name: "Lihat Perizinan", moduleKey: "PERIZINAN" },
    { key: "permission.request", name: "Ajukan Izin", moduleKey: "PERIZINAN" },
    { key: "permission.approve", name: "Setujui Izin", moduleKey: "PERIZINAN" },
    { key: "guardian.view", name: "Akses Portal Wali", moduleKey: "WALI_SANTRI" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, moduleKey: perm.moduleKey },
      create: perm,
    });
  }
  console.log(`✅ Seeded ${permissions.length} Permissions`);

  // 3. Seed Plans
  const plans = [
    { key: "FREE", name: "Starter Gratis", priceMonth: 0, maxStudents: 50 },
    { key: "PRO", name: "Pesantren Pro", priceMonth: 299000, maxStudents: 500 },
    { key: "ENTERPRISE", name: "Pesantren Enterprise", priceMonth: 799000, maxStudents: 5000 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: { name: plan.name, priceMonth: plan.priceMonth, maxStudents: plan.maxStudents },
      create: plan,
    });
  }
  console.log(`✅ Seeded ${plans.length} Plans`);

  // 4. Seed Demo Tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "al-hikmah" },
    update: {
      name: "Pondok Pesantren Al-Hikmah Modern",
      tagline: "Mencetak Generasi Qur'ani, Berakhlak Mulia & Mandiri",
      city: "Malang",
      province: "Jawa Timur",
      status: "ACTIVE",
    },
    create: {
      slug: "al-hikmah",
      name: "Pondok Pesantren Al-Hikmah Modern",
      tagline: "Mencetak Generasi Qur'ani, Berakhlak Mulia & Mandiri",
      city: "Malang",
      province: "Jawa Timur",
      status: "ACTIVE",
    },
  });
  console.log(`✅ Seeded Demo Tenant: ${demoTenant.name} (${demoTenant.slug})`);

  // 5. Link Tenant Modules (Activate CORE, SANTRI, KEUANGAN, ABSENSI, TAHFIZH, ASRAMA, PERIZINAN, WALI_SANTRI)
  const activeKeys = ["CORE", "SANTRI", "KEUANGAN", "ABSENSI", "TAHFIZH", "ASRAMA", "PERIZINAN", "WALI_SANTRI"];
  for (const key of activeKeys) {
    const mod = await prisma.module.findUnique({ where: { key } });
    if (mod) {
      await prisma.tenantModule.upsert({
        where: {
          tenantId_moduleId: {
            tenantId: demoTenant.id,
            moduleId: mod.id,
          },
        },
        update: { enabled: true },
        create: {
          tenantId: demoTenant.id,
          moduleId: mod.id,
          enabled: true,
        },
      });
    }
  }

  // 6. Seed Roles for Demo Tenant
  const tenantRoles = [
    { name: "OWNER", description: "Pimpinan / Pengasuh Pesantren" },
    { name: "ADMIN", description: "Administrator Operasional Pesantren" },
    { name: "BENDAHARA", description: "Bendahara & Pengelola Keuangan" },
    { name: "GURU", description: "Ustadz / Tenaga Pendidik" },
    { name: "KESANTRIAN", description: "Bagian Kesantrian & Keasramaan" },
    { name: "MUSYRIF", description: "Musyrif Pembina Kamar / Asrama" },
    { name: "WALI_SANTRI", description: "Wali / Orang Tua Santri" },
    { name: "SANTRI", description: "Santri Aktif" },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of tenantRoles) {
    const role = await prisma.role.upsert({
      where: {
        tenantId_name: {
          tenantId: demoTenant.id,
          name: r.name,
        },
      },
      update: { description: r.description },
      create: {
        tenantId: demoTenant.id,
        name: r.name,
        description: r.description,
        isSystem: true,
      },
    });
    roleMap[r.name] = role.id;
  }

  // Also create SaaS global SUPER_ADMIN role (tenantId = null)
  let superAdminRole = await prisma.role.findFirst({
    where: {
      tenantId: null,
      name: "SUPER_ADMIN",
    },
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        description: "SaaS Super Administrator",
        isSystem: true,
        tenantId: null,
      },
    });
  }

  // 7. Seed Demo Users (Password for all: Demo123456!)
  const defaultPasswordHash = hashPassword("Demo123456!");

  const demoUsers = [
    { email: "owner@demo.local", name: "KH. Abdullah Munir", role: "OWNER" },
    { email: "admin@demo.local", name: "Ustadz Ridwan, S.Pd.", role: "ADMIN" },
    { email: "bendahara@demo.local", name: "Ustadz Syamsul Hadi, S.E.", role: "BENDAHARA" },
    { email: "guru@demo.local", name: "Ustadzah Fatimah, Lc.", role: "GURU" },
    { email: "kesantrian@demo.local", name: "Ustadz Fatih (Bagian Kesantrian)", role: "KESANTRIAN" },
    { email: "musyrif@demo.local", name: "Ustadz Fatih Al-Banjari", role: "KESANTRIAN" },
    { email: "wali@demo.local", name: "Bpk. Rahmat Santoso (Wali)", role: "WALI_SANTRI" },
  ];

  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, passwordHash: defaultPasswordHash },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: defaultPasswordHash,
        status: "ACTIVE",
      },
    });

    const roleId = roleMap[u.role];
    if (roleId) {
      await prisma.userRole.upsert({
        where: {
          userId_tenantId_roleId: {
            userId: user.id,
            tenantId: demoTenant.id,
            roleId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          tenantId: demoTenant.id,
          roleId,
        },
      });
    }
  }

  // Super Admin Account
  await prisma.user.upsert({
    where: { email: "superadmin@santrios.local" },
    update: { passwordHash: hashPassword("SuperAdmin123456!") },
    create: {
      email: "superadmin@santrios.local",
      name: "SaaS Super Admin",
      passwordHash: hashPassword("SuperAdmin123456!"),
      status: "ACTIVE",
    },
  });

  // 8. Seed Classrooms
  const classesData = [
    { name: "Ulya 2", level: "SMA", academicYear: "2026/2027" },
    { name: "Ulya 1", level: "SMA", academicYear: "2026/2027" },
    { name: "Wustha 3", level: "SMP", academicYear: "2026/2027" },
    { name: "Wustha 2", level: "SMP", academicYear: "2026/2027" },
    { name: "Wustha 1", level: "SMP", academicYear: "2026/2027" },
  ];

  const classMap: Record<string, string> = {};
  for (const c of classesData) {
    const cls = await prisma.classroom.upsert({
      where: { tenantId_name: { tenantId: demoTenant.id, name: c.name } },
      update: { level: c.level, academicYear: c.academicYear },
      create: { tenantId: demoTenant.id, name: c.name, level: c.level, academicYear: c.academicYear },
    });
    classMap[c.name] = cls.id;
  }
  console.log(`✅ Seeded ${classesData.length} Classrooms`);

  // 9. Seed Dormitory Rooms
  const roomsData = [
    { name: "Kamar A-01 (Abu Bakar)", building: "Gedung Al-Faruq", capacity: 10 },
    { name: "Kamar A-02 (Umar)", building: "Gedung Al-Faruq", capacity: 10 },
    { name: "Kamar A-03 (Utsman)", building: "Gedung Al-Faruq", capacity: 12 },
    { name: "Kamar A-04 (Ali)", building: "Gedung Al-Faruq", capacity: 12 },
    { name: "Kamar B-01 (Thalhah)", building: "Gedung Az-Zubair", capacity: 10 },
  ];

  const roomMap: Record<string, string> = {};
  for (const r of roomsData) {
    const rm = await prisma.dormitoryRoom.upsert({
      where: { tenantId_name: { tenantId: demoTenant.id, name: r.name } },
      update: { building: r.building, capacity: r.capacity },
      create: { tenantId: demoTenant.id, name: r.name, building: r.building, capacity: r.capacity },
    });
    roomMap[r.name] = rm.id;
  }
  console.log(`✅ Seeded ${roomsData.length} Dormitory Rooms`);

  // 10. Seed Students
  const studentsData = [
    {
      nis: "20260021",
      name: "Ahmad Fauzan",
      nickname: "Fauzan",
      gender: "LAKI_LAKI",
      birthPlace: "Surabaya",
      birthDate: new Date("2009-04-12"),
      address: "Jl. Rungkut Asri No. 45, Surabaya",
      phone: "081234567801",
      status: "AKTIF",
      className: "Ulya 2",
      roomName: "Kamar A-03 (Utsman)",
      guardianName: "Bpk. Rahmat Santoso",
      guardianPhone: "081234567890",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260022",
      name: "Muhammad Ali Al-Fatih",
      nickname: "Ali",
      gender: "LAKI_LAKI",
      birthPlace: "Malang",
      birthDate: new Date("2010-08-25"),
      address: "Jl. Ijen No. 12, Malang",
      phone: "081234567802",
      status: "AKTIF",
      className: "Ulya 1",
      roomName: "Kamar A-01 (Abu Bakar)",
      guardianName: "Bpk. Hendra Gunawan",
      guardianPhone: "081234567894",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260023",
      name: "Bilal Ibnu Rabah",
      nickname: "Bilal",
      gender: "LAKI_LAKI",
      birthPlace: "Gresik",
      birthDate: new Date("2011-01-15"),
      address: "Jl. Veteran No. 8, Gresik",
      phone: "081234567803",
      status: "IZIN",
      className: "Wustha 3",
      roomName: "Kamar A-03 (Utsman)",
      guardianName: "Ibu Siti Khodijah",
      guardianPhone: "081234567895",
      guardianRelation: "IBU",
    },
    {
      nis: "20260024",
      name: "Farhan Hakim",
      nickname: "Farhan",
      gender: "LAKI_LAKI",
      birthPlace: "Sidoarjo",
      birthDate: new Date("2011-06-30"),
      address: "Jl. Pahlawan No. 20, Sidoarjo",
      phone: "081234567804",
      status: "AKTIF",
      className: "Wustha 2",
      roomName: "Kamar A-02 (Umar)",
      guardianName: "Bpk. Agus Santoso",
      guardianPhone: "081234567896",
      guardianRelation: "AYAH",
    },
    {
      nis: "20260025",
      name: "Zaidan Al-Ayyubi",
      nickname: "Zaidan",
      gender: "LAKI_LAKI",
      birthPlace: "Pasuruan",
      birthDate: new Date("2012-03-10"),
      address: "Jl. Suropati No. 5, Pasuruan",
      phone: "081234567805",
      status: "AKTIF",
      className: "Wustha 1",
      roomName: "Kamar A-04 (Ali)",
      guardianName: "Bpk. Bambang Irawan",
      guardianPhone: "081234567897",
      guardianRelation: "AYAH",
    },
  ];

  const studentMap: Record<string, string> = {};
  for (const s of studentsData) {
    const std = await prisma.student.upsert({
      where: { tenantId_nis: { tenantId: demoTenant.id, nis: s.nis } },
      update: {
        name: s.name,
        nickname: s.nickname,
        gender: s.gender,
        classroomId: classMap[s.className],
        dormitoryRoomId: roomMap[s.roomName],
        status: s.status,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianRelation: s.guardianRelation,
      },
      create: {
        tenantId: demoTenant.id,
        nis: s.nis,
        name: s.name,
        nickname: s.nickname,
        gender: s.gender,
        birthPlace: s.birthPlace,
        birthDate: s.birthDate,
        address: s.address,
        phone: s.phone,
        status: s.status,
        classroomId: classMap[s.className],
        dormitoryRoomId: roomMap[s.roomName],
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianRelation: s.guardianRelation,
      },
    });
    studentMap[s.nis] = std.id;
  }
  console.log(`✅ Seeded ${studentsData.length} Students`);

  // 11. Seed Invoices & Transactions
  if (studentMap["20260021"]) {
    const inv1 = await prisma.invoice.create({
      data: {
        tenantId: demoTenant.id,
        studentId: studentMap["20260021"],
        title: "SPP Syahriyah September 2026",
        category: "SPP",
        amount: 500000,
        dueDate: new Date("2026-09-10"),
        status: "PAID",
        paidAt: new Date("2026-09-05"),
      },
    });

    await prisma.transaction.create({
      data: {
        tenantId: demoTenant.id,
        receiptNo: "KW-20260901-001",
        type: "INCOME",
        category: "SPP",
        amount: 500000,
        method: "CASH",
        description: "Pembayaran SPP September an. Ahmad Fauzan (Ulya 2)",
        studentId: studentMap["20260021"],
        invoiceId: inv1.id,
      },
    });

    if (studentMap["20260023"]) {
      await prisma.invoice.create({
        data: {
          tenantId: demoTenant.id,
          studentId: studentMap["20260023"],
          title: "SPP Syahriyah September 2026",
          category: "SPP",
          amount: 500000,
          dueDate: new Date("2026-09-10"),
          status: "OVERDUE",
        },
      });
    }

    await prisma.transaction.create({
      data: {
        tenantId: demoTenant.id,
        receiptNo: "KW-20260901-OUT-001",
        type: "EXPENSE",
        category: "BELANJA_DAPUR",
        amount: 4200000,
        method: "TRANSFER",
        description: "Pengadaan beras 500kg & minyak goreng konsumsi santri",
      },
    });
  }
  console.log(`✅ Seeded Invoices & Financial Transactions`);

  // Seed Initial Audit Log
  await prisma.auditLog.create({
    data: {
      tenantId: demoTenant.id,
      action: "INITIAL_SEED",
      entity: "Tenant",
      entityId: demoTenant.id,
      newData: { message: "Pesantren Al-Hikmah setup completed via seed." },
    },
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
