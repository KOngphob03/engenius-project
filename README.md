# Next.js + Elysia Monorepo (Bun + Docker Compose)

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
```

---

## 2) Tech Stack

- Bun
- Next.js
- Elysia
- Docker / Docker Compose
- Git / GitHub

---

## 3) สิ่งที่ต้องติดตั้งก่อน

ให้ติดตั้งเครื่องมือเหล่านี้ก่อน

- Bun
- Docker Desktop
- Git

ตรวจสอบว่าเครื่องพร้อมใช้งาน

```bash
bun --version
docker --version
docker compose version
git --version
```

---

## 4) Clone โปรเจกต์

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd my-project
```

---

## 5) ติดตั้ง dependencies

### ติดตั้งฝั่ง web

```bash
cd apps/web
bun install
```

### ติดตั้งฝั่ง api

```bash
cd ../api
bun install
```

### กลับไป root

```bash
cd ../..
```

---

## 6) Environment ที่ใช้ตอน local

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> หมายเหตุ:
>
> - ฝั่ง `web` ใช้ port `3000`
> - ฝั่ง `api` ใช้ port `3001`

---

## 7) Run แบบ Local Development

เปิด 2 terminal

### Terminal 1: รัน Next.js

```bash
cd apps/web
bun dev
```

เข้าใช้งาน:

- Web: http://localhost:3000

### Terminal 2: รัน Elysia

```bash
cd apps/api
bun dev
```

เข้าใช้งาน:

- API root: http://localhost:3001
- Health check: http://localhost:3001/api/health

---

## 8) คำสั่งที่ใช้บ่อย

### ฝั่ง web

```bash
cd apps/web
bun dev
bun run build
bun run start
```

### ฝั่ง api

```bash
cd apps/api
bun dev
bun run build
bun run start
```

---

## 9) Run ด้วย Docker Compose

ให้รันจาก root ของโปรเจกต์

### build image

```bash
docker compose build
```

### run container

```bash
docker compose up
```

### run พร้อม rebuild

```bash
docker compose up --build
```

### stop container

```bash
docker compose down
```

### ดู logs

```bash
docker compose logs -f
```

เมื่อรันแล้วจะเข้าใช้งานได้ที่

- Web: http://localhost:3000
- API: http://localhost:3001

---

## 10) Docker ที่เกี่ยวข้อง

### `apps/web/Dockerfile`

ใช้สำหรับ build และ run Next.js แบบ production

### `apps/api/Dockerfile`

ใช้สำหรับ build และ run Elysia แบบ production

### `docker-compose.yml`

ใช้รวม service ของ `web` และ `api` ให้สั่งงานพร้อมกันได้

---

## 11) ข้อตกลงเรื่อง Branch

โปรเจกต์นี้ใช้ branch ดังนี้

- `main` = stable / production-ready
- `dev` = branch รวมงานก่อนขึ้น main
- `dev-cha` = branch งานของ Cha
- `dev-ohm` = branch งานของ Ohm
- `dev-save` = branch งานของ Save

---

## 12) วิธีทำงานกับ Branch

### ครั้งแรก ดึง branch ทั้งหมด

```bash
git fetch --all
```

### ไปทำงานที่ branch ของตัวเอง

ตัวอย่างของ Cha

```bash
git checkout dev-cha
git pull origin dev-cha
```

ตัวอย่างของ Ohm

```bash
git checkout dev-ohm
git pull origin dev-ohm
```

ตัวอย่างของ Save

```bash
git checkout dev-save
git pull origin dev-save
```

---

## 13) Workflow การทำงานของทีม

ลำดับการทำงานที่แนะนำ

1. ดึง code ล่าสุดจาก branch ตัวเอง
2. แก้ไขงานใน branch ตัวเอง
3. commit และ push ขึ้น branch ตัวเอง
4. เปิด Pull Request เข้า `dev`
5. ทดสอบรวมบน `dev`
6. เมื่อทุกอย่างพร้อม ค่อย merge `dev` เข้า `main`

---

## 14) ตัวอย่างคำสั่ง Git ที่ใช้ประจำ

### เช็กสถานะไฟล์

```bash
git status
```

### add ไฟล์ทั้งหมด

```bash
git add .
```

### commit

```bash
git commit -m "feat: add new api endpoint"
```

### push branch ตัวเอง

ตัวอย่าง Cha

```bash
git push origin dev-cha
```

ตัวอย่าง Ohm

```bash
git push origin dev-ohm
```

ตัวอย่าง Save

```bash
git push origin dev-save
```

---

## 15) ขั้นตอนดึงงานจาก `dev` มาอัปเดต branch ตัวเอง

ตัวอย่างใน `dev-cha`

```bash
git checkout dev
git pull origin dev

git checkout dev-cha
git merge dev
```

ถ้ามี conflict ให้แก้ก่อน แล้วค่อย

```bash
git add .
git commit -m "merge dev into dev-cha"
git push origin dev-cha
```

---

## 16) ขั้นตอนเปิดงานใหม่

ทุกครั้งที่เริ่มงานใหม่ ให้ทำแบบนี้

```bash
git checkout dev
git pull origin dev

git checkout dev-cha
git merge dev
```

จากนั้นค่อยเริ่มเขียนงานใหม่ใน branch ตัวเอง

---

## 17) กติกาการ commit

แนะนำให้ตั้งชื่อ commit ให้สื่อความหมาย เช่น

```txt
feat: add login page
feat: add borrow equipment api
fix: resolve docker compose port issue
fix: correct cors config
chore: update README
refactor: separate api routes
```

---

## 18) กติกาการ push

### ควรทำ

- push ขึ้น branch ตัวเองเท่านั้น
- ทดสอบก่อน push
- เขียน commit message ให้ชัด
- เปิด PR เข้า `dev` ก่อนเสมอ

### ห้ามทำ

- ห้าม push ตรงเข้า `main`
- ห้ามแก้ branch คนอื่นโดยไม่คุยก่อน
- ห้าม merge เข้า `main` โดยไม่ review

---

## 19) การตั้งค่าแนะนำบน GitHub

แนะนำให้ตั้งค่าบน GitHub ดังนี้

### Protect branch `main`

- Require pull request before merging
- Require approvals
- Block force push

### Protect branch `dev`

- Require pull request before merging

---

## 20) สำหรับคนที่รับช่วง migrate API ต่อ

โค้ด API อยู่ที่

```txt
apps/api
```

สิ่งที่ทีม backend ควรทำต่อ เช่น

- แยก route ให้ชัดเจน
- เพิ่ม service / repository layer
- เชื่อม database
- เพิ่ม validation
- เพิ่ม auth
- จัดการ env ให้แยก dev / production
- เพิ่ม error handling
- เพิ่ม logging

---

## 21) ปัญหาที่พบบ่อย

### 1. Port ชนกัน

ถ้า `3000` หรือ `3001` ถูกใช้งานอยู่ ให้หยุด process เดิมก่อน หรือเปลี่ยน port ใน config

### 2. Web เรียก API ไม่ได้

ตรวจสอบว่า

- API รันอยู่จริง
- `apps/web/.env.local` ถูกต้อง
- CORS ถูกตั้งค่าแล้ว

### 3. Docker build ไม่ผ่าน

ลอง rebuild ใหม่

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

### 4. ติดตั้ง package แล้วลืม commit lockfile

ให้ commit ไฟล์ lock มาด้วยทุกครั้ง

---

## 22) คำสั่งเริ่มต้นแบบเร็ว

### Run local

```bash
# terminal 1
cd apps/web
bun dev
```

```bash
# terminal 2
cd apps/api
bun dev
```

### Run docker

```bash
docker compose build
docker compose up
```

### Stop docker

```bash
docker compose down
```

---

## 23) ผู้รับผิดชอบ branch

- `dev-cha` → Cha
- `dev-ohm` → Ohm
- `dev-save` → Save

---

## 24) สรุปสั้น

- พัฒนาเว็บที่ `apps/web`
- พัฒนา API ที่ `apps/api`
- local ใช้ `bun dev`
- production/container ใช้ Docker Compose
- ทำงานบน branch ของตัวเอง
- รวมงานเข้า `dev`
- ปล่อยงานจาก `main`
