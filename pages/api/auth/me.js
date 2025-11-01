// API endpoint สำหรับดึงข้อมูลผู้ใช้จาก cookie
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // อ่าน cookie จาก request headers (Next.js Pages Router)
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));

    if (!userCookie) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // Extract cookie value
    const cookieValue = userCookie.split('=').slice(1).join('=');
    
    // Decode cookie
    const user = JSON.parse(decodeURIComponent(cookieValue));

    return res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
}

