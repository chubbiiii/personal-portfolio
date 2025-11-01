import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // ตรวจสอบว่าเป็น admin หรือไม่ (ตรวจสอบจาก cookie)
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));

    if (!userCookie) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { section, data } = req.body;

    if (!section || !data) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ section และ data'
      });
    }

    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const content = JSON.parse(fileContents);

    // อัปเดต content ตาม section
    content[section] = { ...content[section], ...data };

    // บันทึกไฟล์
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: 'อัปเดตข้อมูลสำเร็จ',
      content: content[section]
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
    });
  }
}

