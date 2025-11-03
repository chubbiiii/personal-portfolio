import { get } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // อ่าน content จาก Edge Config
    let content = null;
    try {
      content = await get('content');
    } catch (edgeConfigError) {
      console.error('Edge Config Error Details:', {
        message: edgeConfigError.message,
        name: edgeConfigError.name,
        stack: edgeConfigError.stack,
        hasEdgeConfig: !!process.env.EDGE_CONFIG,
        hasEdgeConfigId: !!process.env.EDGE_CONFIG_ID,
        nodeEnv: process.env.NODE_ENV
      });
      
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Edge Config',
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

    // ถ้ายังไม่มีข้อมูลใน Edge Config ให้ fallback ไปใช้ default content
    if (!content) {
      const defaultContent = {
        avatar: {
          avatarImage: "/images/avatar.png",
          socialLinks: [],
          buttonText: "Hire Me",
          buttonLink: "#"
        },
        welcome: {
          greeting: "Hello",
          title: "Welcome",
          description: ""
        },
        stats: {
          years: "0",
          projects: "0",
          clients: "0"
        },
        about: {
          label: "About",
          title: "",
          description: ""
        },
        career: {
          label: "Career",
          title: "",
          items: []
        },
        services: {
          label: "Services",
          title: "",
          items: []
        },
        skills: {
          label: "Skills",
          title: "",
          items: []
        },
        contact: {
          label: "Contact",
          title: ""
        },
        footer: {
          text: "© 2025. All rights reserved."
        }
      };
      
      return res.status(200).json({
        success: true,
        content: defaultContent
      });
    }

    return res.status(200).json({
      success: true,
      content: content
    });
  } catch (error) {
    console.error('Error reading content:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}

