import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { req } = context;

  try {
    // ตรวจสอบว่า login แล้วหรือไม่
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));

    if (!userCookie) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Error reading cookie:', error);
  }

  return {
    props: {},
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/get');
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (section, data) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data }),
      });

      const result = await response.json();
      if (result.success) {
        alert('บันทึกสำเร็จ');
        fetchContent();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <p className="text-white text-[20px]">กำลังโหลด...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <p className="text-white text-[20px]">ไม่พบข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] py-[50px] px-[20px]">
      <div className="container mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-[40px]">
          <h1 className="text-white text-[32px] font-medium">Admin Dashboard</h1>
          <div className="flex items-center gap-[15px]">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2EEBAA] text-[#181818] px-[20px] py-[10px] rounded-[8px] font-medium hover:bg-[#26c293] transition-colors"
            >
              ดูหน้าเว็บไซต์
            </a>
            <button
              onClick={handleLogout}
              className="bg-[#ff4444] text-white px-[20px] py-[10px] rounded-[8px] hover:bg-[#cc0000] transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-[10px] mb-[30px] flex-wrap">
          {Object.keys(content).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-[20px] py-[10px] rounded-[8px] transition-colors ${
                activeSection === section
                  ? 'bg-[#2EEBAA] text-[#181818]'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="bg-[#2A2A2A] rounded-[15px] p-[30px]">
          {activeSection === 'welcome' && (
            <WelcomeEditor content={content.welcome} onSave={(data) => handleUpdate('welcome', data)} saving={saving} />
          )}
          {activeSection === 'stats' && (
            <StatsEditor content={content.stats} onSave={(data) => handleUpdate('stats', data)} saving={saving} />
          )}
          {activeSection === 'about' && (
            <AboutEditor content={content.about} onSave={(data) => handleUpdate('about', data)} saving={saving} />
          )}
          {activeSection === 'career' && (
            <CareerEditor content={content.career} onSave={(data) => handleUpdate('career', data)} saving={saving} />
          )}
          {activeSection === 'services' && (
            <ServicesEditor content={content.services} onSave={(data) => handleUpdate('services', data)} saving={saving} />
          )}
          {activeSection === 'contact' && (
            <ContactEditor content={content.contact} onSave={(data) => handleUpdate('contact', data)} saving={saving} />
          )}
          {activeSection === 'footer' && (
            <FooterEditor content={content.footer} onSave={(data) => handleUpdate('footer', data)} saving={saving} />
          )}
          {activeSection === 'avatar' && (
            <AvatarEditor content={content.avatar} onSave={(data) => handleUpdate('avatar', data)} saving={saving} />
          )}
          {activeSection === 'skills' && (
            <SkillsEditor content={content.skills} onSave={(data) => handleUpdate('skills', data)} saving={saving} />
          )}
        </div>
      </div>
    </div>
  );
}

// Editor Components
function WelcomeEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Welcome Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Greeting</label>
        <input
          type="text"
          value={formData.greeting}
          onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <textarea
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          rows={3}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function StatsEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Stats Section</h2>
      <div className="grid grid-cols-3 gap-[20px]">
        <div>
          <label className="block text-white mb-[10px]">Years</label>
          <input
            type="text"
            value={formData.years}
            onChange={(e) => setFormData({ ...formData, years: e.target.value })}
            className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-[10px]">Projects</label>
          <input
            type="text"
            value={formData.projects}
            onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
            className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-[10px]">Clients</label>
          <input
            type="text"
            value={formData.clients}
            onChange={(e) => setFormData({ ...formData, clients: e.target.value })}
            className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
          />
        </div>
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function AboutEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">About Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function CareerEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  const addCareerItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          period: "March 2020 - Present",
          title: "Freelance Designer",
          description: "I've done remote work for agencies, consulted for startups, and collaborated with talented people to create digital products for both business and consumer use."
        }
      ]
    });
  };

  const removeCareerItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Career Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-[10px]">
          <label className="block text-white">Career Items</label>
          <button
            onClick={addCareerItem}
            className="bg-[#2EEBAA] text-[#181818] px-[15px] py-[8px] rounded-[8px] text-[14px] font-bold hover:bg-[#26c293]"
          >
            + เพิ่ม Career Item
          </button>
        </div>
        <div className="space-y-[15px]">
          {formData.items.map((item, index) => (
            <div key={index} className="border border-[#999999] rounded-[8px] p-[20px] bg-[#1E1E1E]">
              <div className="flex justify-between items-center mb-[15px]">
                <h3 className="text-white text-[16px] font-medium">Career Item {index + 1}</h3>
                <button
                  onClick={() => removeCareerItem(index)}
                  className="bg-[#ff4444] text-white px-[10px] py-[5px] rounded-[5px] text-[12px] hover:bg-[#cc0000]"
                >
                  ลบ
                </button>
              </div>
              <div className="space-y-[10px]">
                <input
                  type="text"
                  value={item.period}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].period = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  placeholder="Period"
                  className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  placeholder="Title"
                  className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].description = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  placeholder="Description"
                  rows={3}
                  className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function ServicesEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  const addServiceItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          title: "New Service",
          projects: "0 PROJECTS"
        }
      ]
    });
  };

  const removeServiceItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Services Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-[10px]">
          <label className="block text-white">Service Items</label>
          <button
            onClick={addServiceItem}
            className="bg-[#2EEBAA] text-[#181818] px-[15px] py-[8px] rounded-[8px] text-[14px] font-bold hover:bg-[#26c293]"
          >
            + เพิ่ม Service Item
          </button>
        </div>
        <div className="space-y-[15px]">
          {formData.items.map((item, index) => (
            <div key={index} className="border border-[#999999] rounded-[8px] p-[20px] bg-[#1E1E1E]">
              <div className="flex justify-between items-center mb-[15px]">
                <h3 className="text-white text-[16px] font-medium">Service {index + 1}</h3>
                <button
                  onClick={() => removeServiceItem(index)}
                  className="bg-[#ff4444] text-white px-[10px] py-[5px] rounded-[5px] text-[12px] hover:bg-[#cc0000]"
                >
                  ลบ
                </button>
              </div>
              <div className="space-y-[10px]">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].title = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  placeholder="Service Title"
                  className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                />
                <input
                  type="text"
                  value={item.projects}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].projects = e.target.value;
                    setFormData({ ...formData, items: newItems });
                  }}
                  placeholder="Projects"
                  className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function ContactEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Contact Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function FooterEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Footer Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Footer Text</label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function AvatarEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  const updateSocialLink = (index, field, value) => {
    const newSocialLinks = [...formData.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newSocialLinks });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { icon: '/images/social-icon.png', url: '#' }]
    });
  };

  const removeSocialLink = (index) => {
    const newSocialLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: newSocialLinks });
  };

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Avatar/Sidebar Section</h2>
      
      <div>
        <label className="block text-white mb-[10px]">Avatar Image Path</label>
        <input
          type="text"
          value={formData.avatarImage}
          onChange={(e) => setFormData({ ...formData, avatarImage: e.target.value })}
          placeholder="/images/avatar.png"
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
        <p className="text-[#999999] text-[12px] mt-[5px]">Path to avatar image (e.g., /images/avatar.png)</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-[10px]">
          <label className="block text-white">Social Links</label>
          <button
            onClick={addSocialLink}
            className="bg-[#2EEBAA] text-[#181818] px-[15px] py-[8px] rounded-[8px] text-[14px] font-bold hover:bg-[#26c293]"
          >
            + เพิ่ม Social Link
          </button>
        </div>
        <div className="space-y-[15px]">
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="border border-[#999999] rounded-[8px] p-[15px] bg-[#1E1E1E]">
              <div className="flex justify-between items-center mb-[10px]">
                <span className="text-white text-[14px] font-medium">Social Link {index + 1}</span>
                {formData.socialLinks.length > 1 && (
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="bg-[#ff4444] text-white px-[10px] py-[5px] rounded-[5px] text-[12px] hover:bg-[#cc0000]"
                  >
                    ลบ
                  </button>
                )}
              </div>
              <div className="space-y-[10px]">
                <div>
                  <label className="block text-[#999999] text-[12px] mb-[5px]">Icon Path</label>
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                    placeholder="/images/social-icon.png"
                    className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[#999999] text-[12px] mb-[5px]">URL</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[10px] py-[8px] text-white text-[14px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white mb-[10px]">Button Text</label>
        <input
          type="text"
          value={formData.buttonText}
          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>

      <div>
        <label className="block text-white mb-[10px]">Button Link</label>
        <input
          type="text"
          value={formData.buttonLink}
          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
          placeholder="# or https://..."
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>

      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

function SkillsEditor({ content, onSave, saving }) {
  const [formData, setFormData] = useState(content);

  const addSkillItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          icon: "/images/program-icon.png",
          alt: "program-icon"
        }
      ]
    });
  };

  const removeSkillItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateSkillItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="space-y-[20px]">
      <h2 className="text-white text-[24px] font-medium mb-[20px]">Skills Section</h2>
      <div>
        <label className="block text-white mb-[10px]">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <label className="block text-white mb-[10px]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#1E1E1E] border border-[#999999] rounded-[8px] px-[15px] py-[10px] text-white"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-[10px]">
          <label className="block text-white">Skill Items</label>
          <button
            onClick={addSkillItem}
            className="bg-[#2EEBAA] text-[#181818] px-[15px] py-[8px] rounded-[8px] text-[14px] font-bold hover:bg-[#26c293]"
          >
            + เพิ่ม Skill Item
          </button>
        </div>
        <div className="grid grid-cols-2 c768:grid-cols-4 gap-[15px]">
          {formData.items.map((item, index) => (
            <div key={index} className="border border-[#999999] rounded-[8px] p-[15px] bg-[#1E1E1E]">
              <div className="flex justify-between items-center mb-[10px]">
                <span className="text-white text-[12px] font-medium">Skill {index + 1}</span>
                <button
                  onClick={() => removeSkillItem(index)}
                  className="bg-[#ff4444] text-white px-[8px] py-[4px] rounded-[5px] text-[11px] hover:bg-[#cc0000]"
                >
                  ลบ
                </button>
              </div>
              <div className="space-y-[8px]">
                <div>
                  <label className="block text-[#999999] text-[11px] mb-[5px]">Icon Path</label>
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateSkillItem(index, 'icon', e.target.value)}
                    placeholder="/images/program-icon.png"
                    className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[8px] py-[6px] text-white text-[12px]"
                  />
                </div>
                <div>
                  <label className="block text-[#999999] text-[11px] mb-[5px]">Alt Text</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => updateSkillItem(index, 'alt', e.target.value)}
                    placeholder="program-icon"
                    className="w-full bg-[#1A1A1A] border border-[#666] rounded-[5px] px-[8px] py-[6px] text-white text-[12px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onSave(formData)}
        disabled={saving}
        className="bg-[#2EEBAA] text-[#181818] px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#26c293] disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
}

