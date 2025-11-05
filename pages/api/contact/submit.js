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
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { fullname, email, phone, message } = req.body;

    // Validate required fields
    if (!fullname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, อีเมล, และข้อความ)'
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

    // Create new submission
    const newSubmission = {
      id: Date.now().toString(), // Simple ID generation
      fullname: fullname.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add to submissions array
    submissions.unshift(newSubmission); // Add to beginning

    // Write to file
    try {
      writeSubmissions(submissions);
    } catch (error) {
      console.error('Error writing contact.json:', error);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ส่งข้อความสำเร็จ ขอบคุณสำหรับการติดต่อ'
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
      error: error.message
    });
  }
}
