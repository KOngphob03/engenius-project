from pathlib import Path

content = r"""# Next.js + Elysia Monorepo (Bun + Docker Compose)

โปรเจกต์นี้เป็น monorepo ที่แยกออกเป็น 2 ส่วนหลัก

- `apps/web` = Next.js
- `apps/api` = Elysia

ใช้ **Bun** เป็น package manager / runtime และใช้ **Docker Compose** สำหรับ build และ run container ทั้งระบบ

---

## 1) โครงสร้างโปรเจกต์

```txt
my-project/
├─ .gitignore
├─ docker-compose.yml
├─ README.md
└─ apps/
   ├─ web/
   │  ├─ .dockerignore
   │  ├─ Dockerfile
   │  ├─ next.config.ts
   │  ├─ package.json
   │  ├─ bun.lock
   │  └─ ...
   └─ api/
      ├─ .dockerignore
      ├─ Dockerfile
      ├─ package.json
      ├─ bun.lock
      ├─ src/
      │  └─ index.ts
      └─ ...