# SantriOS — Agent Invariants & Guidelines

Please refer to the complete rules in [santrios-rules.md](file:///d:/WEB/SantriOS/.agents/rules/santrios-rules.md).

### Core Summary:
1. **Multi-Tenant Isolation**: Every business entity must have `tenant_id`. All database queries and operations must be scoped through `tenantDb(tenantId)` / `getTenantContext()`. Never permit cross-tenant data leakage.
2. **Tech Stack**: Monorepo with Turborepo, pnpm workspaces, Next.js App Router (`apps/web`), Prisma + PostgreSQL (Neon), Tailwind CSS, Lucide Icons, TypeScript strict mode.
3. **Layered Architecture**: UI → Server Action / API → Service → Repository → Prisma. No business logic in UI.
4. **Mobile-First UX**: Design mobile-first (320px–430px) using bottom navigation and clean card lists; adapt to collapsible sidebar and data tables for desktop.
5. **Modular SaaS**: Modules are registered in `packages/modules` and toggled per-tenant with `hasModule()` checks.
6. **Code Quality**: Zod validation on all inputs, granular RBAC permissions, audit logging for sensitive actions, no `any`, 100% typecheck and tests passing.
