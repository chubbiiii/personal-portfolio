import fs from 'fs';
import path from 'path';

// ฟังก์ชันสำหรับอ่าน submissions จากไฟล์
function getSubmissions() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const submissions = JSON.parse(fileContents);
      return Array.isArray(submissions) ? submissions : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading contact.json:', error);
    return [];
  }
}

function writeSubmissions(submissions) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    const directory = path.dirname(filePath);
    
    // สร้าง directory ถ้ายังไม่มี
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // เขียนไฟล์
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error writing contact.json:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  // Check authentication
  try {
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));

    if (!userCookie) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ ID ของข้อความที่ต้องการลบ'
      });
    }

    // Get existing submissions
    let submissions = [];
    try {
      submissions = getSubmissions();
    } catch (error) {
      console.error('Error reading submissions:', error);
      submissions = [];
    }

    // Filter out the submission with matching id
    const filteredSubmissions = submissions.filter(sub => sub.id !== id);

    if (submissions.length === filteredSubmissions.length) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อความที่ต้องการลบ'
      });
    }

    // Write to file
    try {
      writeSubmissions(filteredSubmissions);
    } catch (error) {
      console.error('Error writing contact.json:', error);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ลบข้อความสำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
      error: error.message
    });
  }
}
