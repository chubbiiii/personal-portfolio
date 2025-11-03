import { get } from '@vercel/edge-config';

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

    // อ่าน content จาก Edge Config
    let content = {};
    try {
      content = await get('content') || {};
    } catch (edgeConfigError) {
      console.error('Edge Config Read Error:', {
        message: edgeConfigError.message,
        name: edgeConfigError.name,
        stack: edgeConfigError.stack,
        hasEdgeConfig: !!process.env.EDGE_CONFIG,
        hasEdgeConfigId: !!process.env.EDGE_CONFIG_ID,
        nodeEnv: process.env.NODE_ENV
      });
      
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอ่านข้อมูลจาก Edge Config',
        error: {
          message: edgeConfigError.message,
          name: edgeConfigError.name,
          details: {
            hasEdgeConfig: !!process.env.EDGE_CONFIG,
            hasEdgeConfigId: !!process.env.EDGE_CONFIG_ID,
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

    // อัพเดท Edge Config ผ่าน API (ต้องใช้ Vercel API Token)
    // ใช้ VERCEL_API_TOKEN แทน EDGE_CONFIG_WRITE_TOKEN
    const vercelApiToken = process.env.VERCEL_API_TOKEN || process.env.EDGE_CONFIG_WRITE_TOKEN;
    const edgeConfigId = process.env.EDGE_CONFIG_ID;
    
    if (!vercelApiToken || !edgeConfigId) {
      return res.status(500).json({
        success: false,
        message: 'VERCEL_API_TOKEN (หรือ EDGE_CONFIG_WRITE_TOKEN) และ EDGE_CONFIG_ID ไม่ได้ถูกตั้งค่า กรุณาตั้งค่าใน Environment Variables',
        hint: 'สร้าง Vercel API Token จาก: https://vercel.com/account/tokens'
      });
    }

    // เรียก Edge Config API เพื่ออัพเดท
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${vercelApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: 'content',
              value: content,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson = null;
      
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // ถ้า parse ไม่ได้ ให้ใช้ text ตรงๆ
      }
      
      console.error('Edge Config API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        errorJson: errorJson,
        url: response.url,
        hasApiToken: !!vercelApiToken,
        hasConfigId: !!edgeConfigId,
        configId: edgeConfigId,
        tokenPrefix: vercelApiToken ? vercelApiToken.substring(0, 10) + '...' : 'missing'
      });
      
      // ถ้าเกิด forbidden error แสดงว่า token ไม่ถูกต้อง
      if (response.status === 403 || errorJson?.error?.invalidToken) {
        return res.status(403).json({
          success: false,
          message: 'Token ไม่ถูกต้องหรือไม่มีสิทธิ์ กรุณาตรวจสอบ VERCEL_API_TOKEN',
          error: {
            status: response.status,
            message: errorJson?.error?.message || 'Not authorized',
            hint: 'สร้าง Vercel API Token ใหม่จาก: https://vercel.com/account/tokens',
            details: {
              hasApiToken: !!vercelApiToken,
              hasConfigId: !!edgeConfigId,
              configId: edgeConfigId
            }
          }
        });
      }
      
      return res.status(response.status || 500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัพเดท Edge Config',
        error: {
          status: response.status,
          statusText: response.statusText,
          message: errorJson?.error?.message || errorJson?.message || errorText,
          details: errorJson || errorText,
          configId: edgeConfigId,
          hasApiToken: !!vercelApiToken,
          hasConfigId: !!edgeConfigId
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

