// API endpoint สำหรับ logout
// รองรับทั้ง GET และ POST request
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // ลบ cookie โดยการ set expiration เป็นอดีต
    res.setHeader('Set-Cookie', [
      'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
    ]);

    // ถ้าเป็น GET request ให้ redirect ไปหน้า login
    if (req.method === 'GET') {
      res.writeHead(302, {
        'Location': '/admin/login'
      });
      return res.end();
    }

    // ถ้าเป็น POST request ส่ง JSON response
    return res.status(200).json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    });
  }
}

