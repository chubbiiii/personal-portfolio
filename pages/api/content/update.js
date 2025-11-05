import fs from 'fs';
import path from 'path';

// ฟังก์ชันสำหรับอ่าน content จากไฟล์
function getContent() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    return {};
  } catch (error) {
    console.error('Error reading content.json:', error);
    return {};
  }
}

function writeContent(content) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const directory = path.dirname(filePath);
    
    // สร้าง directory ถ้ายังไม่มี
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // เขียนไฟล์
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error writing content.json:', error);
    throw error;
  }
}

export default async function handler(req, res) {
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

    // อ่าน content จากไฟล์
    let content = {};
    try {
      content = getContent();
    } catch (error) {
      console.error('Error reading content.json:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        nodeEnv: process.env.NODE_ENV
      });
      
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอ่านข้อมูลจากไฟล์',
        error: {
          message: error.message,
          name: error.name,
          details: {
            nodeEnv: process.env.NODE_ENV
          }
        }
      });
    }

    // ถ้ายังไม่มีข้อมูล ให้สร้าง structure ใหม่
    if (!content || Object.keys(content).length === 0) {
      content = {
        avatar: {},
        welcome: {},
        stats: {},
        about: {},
        career: {},
        services: {},
        skills: {},
        contact: {},
        footer: {}
      };
    }

    // อัปเดต content ตาม section
    content[section] = { ...content[section], ...data };

    // เขียน content ลงไฟล์
    try {
      writeContent(content);
    } catch (error) {
      console.error('Error writing content.json:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงไฟล์',
        error: {
          message: error.message,
          name: error.name
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'อัปเดตข้อมูลสำเร็จ',
      content: content[section]
    });
  } catch (error) {
    console.error('Error updating content:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause
    });
    
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
      error: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        cause: error.cause
      }
    });
  }
}

