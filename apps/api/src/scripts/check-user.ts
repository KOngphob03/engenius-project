import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// ค้นหาพาธของไฟล์ .env ที่อยู่ในโฟลเดอร์ apps/api
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { db } from '../shared/config/database.js';
import { users } from '../infrastructure/database/drizzle/schema/index.js';

async function run() {
  try {
    console.log('⏳ กำลังดึงข้อมูลผู้ใช้งานทั้งหมด...');
    
    const allUsers = await db.select().from(users);

    if (allUsers.length === 0) {
      console.log('📭 ไม่พบข้อมูลในตาราง users');
    } else {
      console.log(`✅ พบผู้ใช้งานทั้งหมด ${allUsers.length} คน:`);
      console.table(allUsers);
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    // เช็คว่าเชื่อมตฐานข้อมูลได้ไหม
    if (error.message.includes('authentication failed')) {
      console.error('💡 คำแนะนำ: ตรวจสอบว่าไฟล์ .env ถูกโหลดถูกต้องและค่า DATABASE_URL ถูกต้องหรือไม่');
    }
  } finally {
    process.exit(0);
  }
}

run();
