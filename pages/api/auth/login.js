// Simple login without database
// ใช้ environment variables สำหรับ credentials

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { username, password } = req.body;

    // ตรวจสอบว่ามีข้อมูล username และ password หรือไม่
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
      });
    }

    // ตรวจสอบ credentials จาก environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // Login สำเร็จ
    const user = {
      id: 1,
      username: username,
      role: 'admin'
    };

    // Set cookie หมดอายุ 1 วัน (24 ชั่วโมง)
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds
    const expires = new Date(Date.now() + oneDay);

    // Set cookie ด้วย httpOnly สำหรับความปลอดภัย
    res.setHeader('Set-Cookie', [
      `user=${encodeURIComponent(JSON.stringify(user))}; Path=/; Expires=${expires.toUTCString()}; HttpOnly; SameSite=Lax; Max-Age=86400`
    ]);

    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: user
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
}
