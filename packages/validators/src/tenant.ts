import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(3, "Nama pesantren minimal 3 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda strip"),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  selectedModules: z.array(z.string()).min(1, "Pilih minimal 1 modul"),
  ownerName: z.string().min(2, "Nama penanggung jawab minimal 2 karakter"),
  ownerEmail: z.string().email("Format email pemilik tidak valid"),
  ownerPassword: z.string().min(6, "Password minimal 6 karakter"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export const toggleTenantModuleSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID diperlukan"),
  moduleKey: z.string().min(1, "Module Key diperlukan"),
  enabled: z.boolean(),
});

export type ToggleTenantModuleInput = z.infer<typeof toggleTenantModuleSchema>;
