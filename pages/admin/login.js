import React, { useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { req } = context;

  try {
    // อ่าน cookie จาก request headers
    const cookies = req.headers.cookie || '';
    const cookieArray = cookies.split(';').map(c => c.trim());
    const userCookie = cookieArray.find(c => c.startsWith('user='));

    // ถ้าพบ user cookie แสดงว่ามีการ login แล้ว ให้ redirect ไป dashboard
    if (userCookie) {
      return {
        redirect: {
          destination: '/admin/dashboard',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Error reading cookie:', error);
  }

  // ถ้ายังไม่ login ให้แสดงหน้า login
  return {
    props: {},
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Login สำเร็จ - ข้อมูลผู้ใช้ถูกเก็บใน cookie แล้ว (ตั้งค่าที่ server-side)
        // Redirect ไปหน้า dashboard หรือหน้าอื่นๆ
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-[20px] py-[50px]">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-[40px]">
          <h1 className="text-white text-[32px] c768:text-[48px] font-medium mb-[10px]">
            เข้าสู่ระบบ
          </h1>
          <p className="text-[#999999] text-[16px] c768:text-[18px]">
            กรุณาเข้าสู่ระบบเพื่อใช้งาน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[30px]">
          {error && (
            <div className="bg-[#ff4444] bg-opacity-10 border border-[#ff4444] rounded-[10px] p-[15px]">
              <p className="text-[#ff4444] text-[14px]">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-white text-[16px] font-normal mb-[10px]"
            >
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[16px] c768:text-[18px] focus:outline-none focus:border-[#2EEBAA] transition-colors"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white text-[16px] font-normal mb-[10px]"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-[1px] border-[#999999] rounded-[15px] px-[25px] py-[18px] text-white text-[16px] c768:text-[18px] focus:outline-none focus:border-[#2EEBAA] transition-colors"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2EEBAA] text-[#181818] text-[18px] c768:text-[20px] font-bold rounded-[15px] px-[50px] py-[18px] transition-all duration-300 hover:bg-[#26c293] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

