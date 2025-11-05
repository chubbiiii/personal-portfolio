import Image from "next/image";
import Link from "next/link";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useReducer,
} from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../libs/contexts/AppContext";
import { Button, ButtonGroup } from "@heroui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import AOS from "aos";
import "aos/dist/aos.css";
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
    return null;
  } catch (error) {
    console.error('Error reading content.json:', {
      message: error.message,
    });
    return null;
  }
}

export async function getServerSideProps(context) {
  const { req } = context;

  // ตรวจสอบการ login โดยดูจาก user cookie
  try {
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));
    
    // ถ้ายังไม่ได้ login ให้ redirect ไปหน้า login
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
    // ถ้าเกิด error ในการอ่าน cookie ให้ redirect ไป login
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  // ถ้า login แล้ว ให้โหลด content จากไฟล์
  try {
    // อ่าน content จากไฟล์
    const content = getContent();

    // ถ้ายังไม่มีข้อมูลในไฟล์ ให้ใช้ default content
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

      return {
        props: {
          content: defaultContent
        }
      };
    }

    return {
      props: {
        content: content
      }
    };
  } catch (error) {
    console.error('Error reading content:', error);
    return {
      props: {
        content: null
      }
    };
  }
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ fullname: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-[100%] c1200:max-w-[700px] flex flex-col gap-[30px]"
    >
      {submitStatus && (
        <div className={`p-[15px] rounded-[10px] ${
          submitStatus.type === 'success' 
            ? 'bg-[#2EEBAA] text-[#181818]' 
            : 'bg-[#ff4444] text-white'
        }`}>
          {submitStatus.message}
        </div>
      )}
      <div className="grid grid-cols-2 gap-[30px]">
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-1"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-1"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-2"
        />
      </div>
      <textarea
        name="message"
        placeholder="Your message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] min-h-[140px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA]"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-[#2EEBAA] text-[#181818] text-[20px] font-bold rounded-[15px] px-[50px] py-[15px] min-w-[180px] w-fit self-end transition hover:bg-[#26c293] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'กำลังส่ง...' : 'Send'}
      </button>
    </form>
  );
}

export default function HomePage({ content }) {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // ระบุ offset ของ header (เช่น 80px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // ปิดเมนูมือถือหลังจากคลิก
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // ป้องกันการเลื่อนหน้าตอนเปิดเมนูมือถือ
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="landingPage bg-[#1E1E1E] h-full">
      <header className="fixed top-0 left-0 right-0 bg-[#1E1E1E] bg-opacity-90 backdrop-blur-md z-50 border-b border-[#999999] border-opacity-20">
        <nav className="container mx-auto max-w-[1200px] px-[20px] py-[20px] flex justify-between items-center relative z-50 ">
          <div className="text-white text-[24px] font-bold">Portfolio</div>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-[20px] c992:gap-[40px]">
            <li>
              <button
                onClick={() => scrollToSection("welcome")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                หน้าแรก
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                เกี่ยวกับฉัน
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("career")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                การทำงาน
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("services")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                เชี่ยวชาญ
              </button>
            </li>
            {/* <li>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Portfolio
              </button>
            </li> */}
            <li>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                ติดต่อ
              </button>
            </li>
          </ul>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-[30px] h-[30px] gap-[6px] focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-full h-[2px] bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-[8px]" : ""
              }`}
            />
            <span
              className={`block w-full h-[2px] bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-full h-[2px] bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""
              }`}
            />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 bg-[#1E1E1E] bg-opacity-95 backdrop-blur-md z-40 md:hidden transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="container mx-auto max-w-[1200px] px-[20px] pt-[100px] bg-[#1E1E1E] h-[100dvh]">
            <ul className="flex flex-col gap-[15px] c768:gap-[30px]">
              <li>
                <button
                  onClick={() => scrollToSection("welcome")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  เกี่ยวกับ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  เกี่ยวกับฉัน
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("career")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  การทำงาน
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  เชี่ยวชาญ
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => scrollToSection("portfolio")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  Portfolio
                </button>
              </li> */}
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white text-[20px] font-normal hover:text-[#2EEBAA] transition-colors w-full text-left py-[10px]"
                >
                  ติดต่อ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="px-[20px] c768:px-[50px] py-[100px] pb-[0]">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex-col c1200:flex-row c1200:flex c1200:gap-[70px]">
            <div className="box-avatar flex flex-col items-center c1200:w-[40%] w-full mb-[50px] c1200:mb-[0]">
              <div className="relative c1200:fixed c1200:top-[100px]">
                <Image
                  src={content?.avatar?.avatarImage || "/images/avatar.png"}
                  alt="avatar"
                  width={360}
                  height={360}
                  quality={100}
                />
                <div className="flex flex-wrap justify-between items-center my-[20px] w-[40%] m-auto">
                  {content?.avatar?.socialLinks ? (
                    content.avatar.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url || "#"}
                        target={link.url?.startsWith('http') ? '_blank' : '_self'}
                        rel={link.url?.startsWith('http') ? 'noopener noreferrer' : ''}
                      >
                        <Image
                          src={link.icon || "/images/social-icon.png"}
                          alt={`social-icon-${index + 1}`}
                          width={24}
                          height={24}
                        />
                      </a>
                    ))
                  ) : (
                    <>
                      <button>
                        <Image
                          src="/images/social-icon.png"
                          alt="social-icon"
                          width={24}
                          height={24}
                        />
                      </button>
                      <button>
                        <Image
                          src="/images/social-icon.png"
                          alt="social-icon"
                          width={24}
                          height={24}
                        />
                      </button>
                      <button>
                        <Image
                          src="/images/social-icon.png"
                          alt="social-icon"
                          width={24}
                          height={24}
                        />
                      </button>
                      <button>
                        <Image
                          src="/images/social-icon.png"
                          alt="social-icon"
                          width={24}
                          height={24}
                        />
                      </button>
                    </>
                  )}
                </div>
                <button
                  // href={content?.avatar?.buttonLink || "#"}
                  onClick={() => scrollToSection("contact")}
                  className="w-full min-h-[50px] transition-all duration-300 hover:border-[#2EEBAA] hover:text-[#2EEBAA] border-[#999999] border-[1px] border-solid text-white rounded-[8px] flex items-center justify-center"
                >
                  {content?.avatar?.buttonText || "Hire Me"}
                </button>
              </div>
            </div>
            <div className="box-title c1200:w-[80%] w-full overflow-hidden">
              <div className="box-welcome" id="welcome">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.welcome?.greeting || "Hello"}
                </p>
                <h1 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[20px]">
                  {content?.welcome?.title ? (
                    content.welcome.title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < content.welcome.title.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      I'm Jonathan, UX/UI <br />
                      Designer and no-code <br />
                      Developer
                    </>
                  )}
                </h1>
                <p className="text-[#999999] text-[18px] font-normal mb-[30px]">
                  {content?.welcome?.description ? (
                    content.welcome.description.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < content.welcome.description.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      I craft elegant solutions to complex problems, and I gives me
                      <br />
                      pleasure. I'm living in Berlin with my loving wife and cute
                      daughter.
                    </>
                  )}
                </p>
              </div>
              <div className="box-score my-[100px] c1200:my-[150px]">
                <div className="flex-col gap-[50px] c768:gap-[0] c768:flex-row box-score-item flex flex-wrap items-center justify-center w-full">
                  <div className="box-score-item-title text-center w-full c768:w-[33.33%]">
                    <h2 className="text-[#2EEBAA] text-[58px] c768:text-[48px] font-medium">
                      {content?.stats?.years || "9+"}
                    </h2>
                    <p className="text-[#999999] text-[18px] font-normal">
                      Years Experience
                    </p>
                  </div>
                  <div className="box-score-item-title text-center w-full c768:w-[33.33%]">
                    <h2 className="text-[#2EEBAA] text-[58px] c768:text-[48px] font-medium">
                      {content?.stats?.projects || "67+"}
                    </h2>
                    <p className="text-[#999999] text-[18px] font-normal">
                      Completed Project
                    </p>
                  </div>
                  {content?.stats?.clients!=="0" && (
                    <div className="box-score-item-title text-center w-full c768:w-[33.33%]">
                      <h2 className="text-[#2EEBAA] text-[58px] c768:text-[48px] font-medium">
                        {content?.stats?.clients || "21+"}
                      </h2>
                      <p className="text-[#999999] text-[18px] font-normal">
                        Happy Client
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="box-about my-[100px] c1200:my-[150px]" id="about">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.about?.label || "About"}
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[20px]">
                  {content?.about?.title || "Every great design begin with an even better story"}
                </h2>
                <p className="text-[#999999] text-[18px] font-normal mb-[30px]">
                  {content?.about?.description || "Since beginning my journey as a freelance designer nearly 8 years ago, I've done remote work for agencies, consulted for startups, and collaborated with talented people to create digital products for both business and consumer use. I'm quietly confident, naturally curious, and perpetually working on improving my chopsone design problem at a time."}
                </p>
              </div>
              <div className="box-career my-[100px] c1200:my-[150px]" id="career">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.career?.label || "Career"}
                </p>
                <h1 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  {content?.career?.title || "Education & Experience"}
                </h1>
                {content?.career?.items ? (
                  content.career.items.map((item, index) => (
                    <div key={index} className={`item-career ${index < content.career.items.length - 1 ? 'mb-[50px]' : ''}`}>
                      <div className="item-career-title">
                        <h2 className="text-[#2EEBAA] text-[30px] font-medium mb-[10px]">
                          {item.period}
                        </h2>
                        <p className="text-white text-[18px] font-normal mb-[10px]">
                          {item.title}
                        </p>
                      </div>
                      <div className="item-career-content">
                        <p className="text-[#999999] text-[18px] font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="item-career mb-[50px]">
                      <div className="item-career-title">
                        <h2 className="text-[#2EEBAA] text-[30px] font-medium mb-[10px]">
                          March 2020 - Present
                        </h2>
                        <p className="text-white text-[18px] font-normal mb-[10px]">
                          Freelance Designer
                        </p>
                      </div>
                      <div className="item-career-content">
                        <p className="text-[#999999] text-[18px] font-normal">
                          I've done remote work for agencies, consulted for
                          startups, and collaborated with talented people to create
                          digital products for both business and consumer use.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="box-services my-[100px] c1200:my-[150px]" id="services">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.services?.label || "Services"}
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  {content?.services?.title || "My expertise and services"}
                </h2>
                <div className=" grid grid-col-1 c768:grid-cols-3 gap-[15px]">
                  {content?.services?.items ? (
                    content.services.items.map((item, index) => (
                      <div key={index} className="border-[#2EEBAA] border-[1px] border-solid rounded-[10px] p-[30px] text-center flex flex-col items-center justify-center">
                        <h3 className="text-white text-[20px] font-medium mb-[10px]">
                          {item.title}
                        </h3>
                        <p className="text-[#999999] text-[16px] font-normal">
                          {item.projects}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border-[#2EEBAA] border-[1px] border-solid rounded-[10px] p-[30px] text-center flex flex-col items-center justify-center">
                        <h3 className="text-white text-[20px] font-medium mb-[10px]">
                          UX/UI Design
                        </h3>
                        <p className="text-[#999999] text-[16px] font-normal">
                          21 PROJECTS
                        </p>
                      </div>
                      <div className="border-[#2EEBAA] border-[1px] border-solid rounded-[10px] p-[30px] text-center flex flex-col items-center justify-center">
                        <h3 className="text-white text-[20px] font-medium mb-[10px]">
                          Web Development
                        </h3>
                        <p className="text-[#999999] text-[16px] font-normal">
                          12 PROJECTS
                        </p>
                      </div>
                      <div className="border-[#2EEBAA] border-[1px] border-solid rounded-[10px] p-[30px] text-center flex flex-col items-center justify-center">
                        <h3 className="text-white text-[20px] font-medium mb-[10px]">
                          Brand Identity
                        </h3>
                        <p className="text-[#999999] text-[16px] font-normal">
                          18 PROJECTS
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="box-skills my-[100px] c1200:my-[150px]">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.skills?.label || "Skills"}
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  {content?.skills?.title || "My skills and knowledge"}
                </h2>
                <div className="grid grid-cols-5 c768:grid-cols-8 gap-[30px] c768:gap-[15px]">
                  {content?.skills?.items ? (
                    content.skills.items.map((item, index) => (
                      <Image
                        key={index}
                        className="grayscale"
                        src={item.icon || "/images/program-icon.png"}
                        alt={item.alt || "program-icon"}
                        width={50}
                        height={50}
                      />
                    ))
                  ) : (
                    <>
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                      <Image
                        className="grayscale"
                        src="/images/program-icon.png"
                        alt="program-icon"
                        width={50}
                        height={50}
                      />
                    </>
                  )}
                </div>
              </div>
              {/* <div className="box-portfolio my-[100px] c1200:my-[150px]" id="portfolio">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Portfolio
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  Featured Projects
                </h2>
                <div className="card-image-banner mb-[15px]">
                  <Image
                    src="/images/project.png"
                    className="h-[250px] c768:h-[400] w-full c1200:h-[300px] object-cover rounded-[25px]"
                    alt="project"
                    width={820}
                    height={400}
                  />
                </div>
                <div className="grid grid-cols-1 c768:grid-cols-2 gap-[15px]">
                  <div className="box-image-flex-item">
                    <Image
                      src="/images/project.png"
                      className="h-[250px] c768:h-[400] w-full c1200:h-[300px] object-cover rounded-[25px]"
                      alt="project"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="box-image-flex-item">
                    <Image
                      src="/images/project.png"
                      className="h-[250px] c768:h-[400] w-full c1200:h-[300px] object-cover rounded-[25px]"
                      alt="project"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </div> */}
              {/* <div className="box-portfolio">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Testimonial
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  Trusted by many clients
                </h2>
                <Swiper
                  spaceBetween={30}
                  slidesPerView="auto"
                  loop={true}
                  watchSlidesProgress={true}
                  watchSlidesVisibility={true}
                  pagination={{
                    clickable: true,
                  }}
                  className="swiper-portfolio"
                >
                  <SwiperSlide className="w-full c768:!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[20px] c768:p-[50px] h-full">
                      <div className="card-testimonial-author flex items-center gap-[15px]">
                        <Image
                          src="/images/avatar.png"
                          className="w-[100px] h-[100px] object-cover rounded-[20px]"
                          alt="avatar"
                          width={50}
                          height={50}
                        />
                        <div className="name-author">
                          <p className="text-white text-[20px] font-bold mb-[10px]">
                            Jimmy Fermin
                          </p>
                          <p className="text-[#999999] text-[16px] font-medium">
                            Photographer, Unsplash
                          </p>
                        </div>
                      </div>
                      <p className="text-[#999999] text-[20px] font-normal mt-[30px]">
                        “Jonathan has demonstrated outstanding performance in
                        her work. He is not only creative in finding innovative
                        solutions, but also efficient in delivering high-quality
                        results.”
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="w-full c768:!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[20px] c768:p-[50px] h-full">
                      <div className="card-testimonial-author flex items-center gap-[15px]">
                        <Image
                          src="/images/avatar.png"
                          className="w-[100px] h-[100px] object-cover rounded-[20px]"
                          alt="avatar"
                          width={50}
                          height={50}
                        />
                        <div className="name-author">
                          <p className="text-white text-[20px] font-bold mb-[10px]">
                            Sarah Jones
                          </p>
                          <p className="text-[#999999] text-[16px] font-medium">
                            CEO, Example Co.
                          </p>
                        </div>
                      </div>
                      <p className="text-[#999999] text-[20px] font-normal mt-[30px]">
                        "I am always satisfied with Jonathan's professionalism
                        and his ability to deliver on time. Highly recommended!"
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="w-full c768:!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[20px] c768:p-[50px] h-full">
                      <div className="card-testimonial-author flex items-center gap-[15px]">
                        <Image
                          src="/images/avatar.png"
                          className="w-[100px] h-[100px] object-cover rounded-[20px]"
                          alt="avatar"
                          width={50}
                          height={50}
                        />
                        <div className="name-author">
                          <p className="text-white text-[20px] font-bold mb-[10px]">
                            David Kim
                          </p>
                          <p className="text-[#999999] text-[16px] font-medium">
                            Product Manager, ABC Ltd
                          </p>
                        </div>
                      </div>
                      <p className="text-[#999999] text-[20px] font-normal mt-[30px]">
                        “Very creative! Collaboration was smooth and the final
                        result exceeded expectations.”
                      </p>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div> */}
              {/* <div className="box-brands my-[100px] c1200:my-[150px]">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Brands
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  Work with brands worldwide
                </h2>
                <div className="grid grid-cols-2 c768:grid-cols-4 gap-[30px] c768:gap-[15px]">
                  <Image
                    className="grayscale"
                    src="/images/brand.png"
                    alt="brand"
                    width={100}
                    height={100}
                  />
                  <Image
                    className="grayscale"
                    src="/images/brand.png"
                    alt="brand"
                    width={100}
                    height={100}
                  />
                  <Image
                    className="grayscale"
                    src="/images/brand.png"
                    alt="brand"
                    width={100}
                    height={100}
                  />
                  <Image
                    className="grayscale"
                    src="/images/brand.png"
                    alt="brand"
                    width={100}
                    height={100}
                  />
                </div>
              </div> */}
              <div className="box-contact my-[100px] c1200:my-[50px]" id="contact">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  {content?.contact?.label || "Contact"}
                </p>
                <h2 className="text-white text-[32px] c1200:text-[56px] font-medium mb-[50px]">
                  {content?.contact?.title || "Let's work together!"}
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] border-t border-[#999999] border-opacity-20 py-[50px]">
        <div className="container mx-auto max-w-[1200px] px-[50px]">
          <p className="text-[#999999] text-[14px] font-normal text-center">
            {content?.footer?.text || "© 2025 Jonathan. All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}
