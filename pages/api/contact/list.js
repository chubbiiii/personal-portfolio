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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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
    const submissions = getSubmissions();
    
    return res.status(200).json({
      success: true,
      submissions: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
}
