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

export default function HomePage() {
  const appContext = useContext(AppContext);
  const router = useRouter();

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
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="landingPage bg-[#1E1E1E] h-full">
      <header className="fixed top-0 left-0 right-0 bg-[#1E1E1E] bg-opacity-90 backdrop-blur-md z-50 border-b border-[#999999] border-opacity-20">
        <nav className="container mx-auto max-w-[1200px] px-[50px] py-[20px] flex justify-between items-center">
          <div className="text-white text-[24px] font-bold">Portfolio</div>
          <ul className="flex gap-[40px]">
            <li>
              <button
                onClick={() => scrollToSection("welcome")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("career")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Career
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("services")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Portfolio
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white text-[16px] font-normal hover:text-[#2EEBAA] transition-colors"
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="px-[50px] py-[100px] pb-[0]">
        <div className="container mx-auto max-w-[1200px]">
          <div className=" flex gap-[70px]">
            <div className="box-avatar flex flex-col items-center w-[40%]">
              <div className="fixed top-[100px]">
                <Image
                  src="/images/avatar.png"
                  alt="avatar"
                  width={360}
                  height={360}
                  quality={100}
                />
                <div className="flex flex-wrap justify-between items-center my-[20px] w-[70%] m-auto">
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
                </div>
                <button className="w-full min-h-[50px] transition-all duration-300 hover:border-[#2EEBAA] hover:text-[#2EEBAA] border-[#999999] border-[1px] border-solid text-white rounded-[8px]">
                  Hire Me
                </button>
              </div>
            </div>
            <div className="box-title w-[80%] overflow-hidden">
              <div className="box-welcome" id="welcome">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Hello
                </p>
                <h1 className="text-white text-[56px] font-medium mb-[20px]">
                  I'm Jonathan, UX/UI <br />
                  Designer and no-code <br />
                  Developer
                </h1>
                <p className="text-[#999999] text-[18px] font-normal mb-[30px]">
                  I craft elegant solutions to complex problems, and I gives me
                  <br />
                  pleasure. I'm living in Berlin with my loving wife and cute
                  daughter.
                </p>
              </div>
              <div className="box-score my-[150px]">
                <div className="box-score-item flex flex-wrap items-center w-full">
                  <div className="box-score-item-title text-center w-[33.33%]">
                    <h2 className="text-[#2EEBAA] text-[48px] font-medium">
                      9+
                    </h2>
                    <p className="text-[#999999] text-[18px] font-normal">
                      Years Experience
                    </p>
                  </div>
                  <div className="box-score-item-title text-center w-[33.33%]">
                    <h2 className="text-[#2EEBAA] text-[48px] font-medium">
                      67+
                    </h2>
                    <p className="text-[#999999] text-[18px] font-normal">
                      Completed Project
                    </p>
                  </div>
                  <div className="box-score-item-title text-center w-[33.33%]">
                    <h2 className="text-[#2EEBAA] text-[48px] font-medium">
                      21+
                    </h2>
                    <p className="text-[#999999] text-[18px] font-normal">
                      Happy Client
                    </p>
                  </div>
                </div>
              </div>
              <div className="box-about my-[150px]" id="about">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  About
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[20px]">
                  Every great design begin with an even better story
                </h2>
                <p className="text-[#999999] text-[18px] font-normal mb-[30px]">
                  Since beginning my journey as a freelance designer nearly 8
                  years ago, I've done remote work for agencies, consulted for
                  startups, and collaborated with talented people to create
                  digital products for both business and consumer use. I'm
                  quietly confident, naturally curious, and perpetually working
                  on improving my chopsone design problem at a time.
                </p>
              </div>
              <div className="box-career my-[150px]" id="career">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Career
                </p>
                <h1 className="text-white text-[56px] font-medium mb-[50px]">
                  Education & Experience
                </h1>
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
                <div className="item-career">
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
              </div>
              <div className="box-services my-[150px]" id="services">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Services
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
                  My expertise and services
                </h2>
                <div className="grid grid-cols-3 gap-[15px]">
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
                </div>
              </div>
              <div className="box-skills my-[150px]">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Skills
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
                  My skills and knowledge
                </h2>
                <div className="grid grid-cols-8 gap-[15px]">
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
                </div>
              </div>
              <div className="box-portfolio my-[150px]" id="portfolio">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Portfolio
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
                  Featured Projects
                </h2>
                <div className="card-image-banner mb-[15px]">
                  <Image
                    src="/images/project.png"
                    className="h-[300px] object-cover rounded-[25px]"
                    alt="project"
                    width={820}
                    height={400}
                  />
                </div>
                <div className="grid grid-cols-2 gap-[15px]">
                  <div className="box-image-flex-item">
                    <Image
                      src="/images/project.png"
                      className="h-[300px] object-cover rounded-[25px]"
                      alt="project"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="box-image-flex-item">
                    <Image
                      src="/images/project.png"
                      className="h-[300px] object-cover rounded-[25px]"
                      alt="project"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </div>
              <div className="box-portfolio">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Testimonial
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
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
                  <SwiperSlide className="!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[50px] h-full">
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
                  <SwiperSlide className="!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[50px] h-full">
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
                  <SwiperSlide className="!w-[500px]">
                    <div className="card-testimonial border-[#999999] border-[1px] border-solid rounded-[25px] p-[50px] h-full">
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
              </div>
              <div className="box-brands my-[150px]">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Brands
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
                  Work with brands worldwide
                </h2>
                <div className="grid grid-cols-4 gap-[15px]">
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
              </div>
              <div className="box-contact my-[150px]" id="contact">
                <p className="text-[#2EEBAA] text-[18px] font-normal mb-[10px]">
                  Contact
                </p>
                <h2 className="text-white text-[56px] font-medium mb-[50px]">
                  Let's work together!
                </h2>
                <form className="w-full max-w-[700px] flex flex-col gap-[30px]">
                  <div className="grid grid-cols-2 gap-[30px]">
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-1"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-1"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA] col-span-2 md:col-span-2"
                      required
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Your message"
                    className="bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] min-h-[140px] text-white text-[18px] focus:outline-none focus:border-[#2EEBAA]"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#2EEBAA] text-[#181818] text-[20px] font-bold rounded-[15px] px-[50px] py-[15px] min-w-[180px] w-fit self-end transition hover:bg-[#26c293]"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] border-t border-[#999999] border-opacity-20 py-[50px]">
        <div className="container mx-auto max-w-[1200px] px-[50px]">
          <p className="text-[#999999] text-[14px] font-normal text-center">
            © 2025 Jonathan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
