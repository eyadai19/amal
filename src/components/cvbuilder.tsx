"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserInfo = {
  name?: string;
  age?: number;
  email?: string;
  phone?: string;
};

export default function CVForm() {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    skills: "",
    languages: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showWarning, setShowWarning] = useState(false);

  // State to handle work experience input
  const [experienceInput, setExperienceInput] = useState("");
  const [cvExperiences, setCvExperiences] = useState<string[]>([]);

  useEffect(() => {
    const getUserInfoAction = async (): Promise<UserInfo> => {
      return {
        name: "محمد أحمد",
        age: 30,
        email: "example@email.com",
        phone: "0912345678"
      };
    };

    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfoAction();
        setUserInfo(info);
        setFormData(prev => ({
          ...prev,
          name: info.name || prev.name,
          email: info.email || prev.email,
          phone: info.phone || prev.phone
        }));
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    
    fetchUserInfo();
  }, []);

  const sectionLabels: Record<keyof typeof formData, string> = {
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    summary: "الملخص المهني",
    skills: "المهارات",
    languages: "اللغات",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
    setShowWarning(false);
  };

  const handleSave = () => {
    const missingFields = Object.entries(formData).filter(
      ([, value]) => value.trim() === ""
    );

    if (missingFields.length > 0) {
      const newErrors: Record<string, boolean> = {};
      missingFields.forEach(([key]) => {
        newErrors[key] = true;
      });
      setErrors(newErrors);
      setShowWarning(true);
      return;
    }

    console.log("تم حفظ السيرة الذاتية:", formData);
    alert("✅ تم حفظ السيرة الذاتية بنجاح!");
  };

  const handleProfessionalize = () => {
    console.log("تحويل إلى صيغة رسمية:", formData);
  };

  // Function to handle adding experience to CV
  const handleAddExperience = () => {
    if (experienceInput.trim() !== "") {
      setCvExperiences([...cvExperiences, experienceInput]);
      setExperienceInput(""); // Clear the input after adding
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4 sm:px-6 lg:px-10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Shorter Red Header */}
        <div className="bg-[#761515] text-white rounded-t-xl p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center mb-1">السيرة الذاتية</h1>
          <p className="text-center text-red-100 text-sm">املأ البيانات لإنشاء سيرتك الذاتية</p>
        </div>

        {/* CV Form Container */}
        <div className="bg-white shadow-lg rounded-b-xl overflow-hidden border border-gray-200">
          {/* Professional Header Section */}
          <div className="bg-gradient-to-r from-red-50 to-white p-6 border-b border-gray-200 text-center">
            <div className="inline-block bg-white p-3 rounded-full shadow-sm mt-4 mb-3 border-4 border-red-100">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
                {formData.name ? formData.name.charAt(0) : "?"}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {formData.name || userInfo.name || "الاسم الكامل"}
            </h2>
            {userInfo.age && (
              <p className="text-gray-600 mb-3">العمر: {userInfo.age} سنة</p>
            )}
          </div>

          

          <form className="p-6 space-y-6">
            {Object.entries(sectionLabels).map(([key, label]) => {
              const isTextarea = ["summary", "skills", "languages"].includes(key);
              const errorStyle = errors[key] ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-300";
              
              if (key === "experience") return null;  

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-start gap-4">
                    <Label htmlFor={key} className="text-gray-700 font-medium w-32 text-right">
                      {label}
                      <span className={`w-2 h-2 rounded-full ml-2 ${errors[key] ? "bg-[#b11f1f]" : "bg-red-300"}`}></span>
                    </Label>

                    {isTextarea ? (
                      <textarea
                        id={key}
                        name={key}
                        value={formData[key as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={`أدخل ${label.toLowerCase()}`}
                        className={`w-full p-3 text-right border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300 focus:outline-none transition ${errorStyle}`}
                        rows={4}
                        dir="rtl"
                      />
                    ) : (
                      <Input
                        id={key}
                        name={key}
                        value={formData[key as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={`أدخل ${label.toLowerCase()}`}
                        className={`text-right border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300 focus:outline-none transition ${errorStyle}`}
                        dir="rtl"
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {/* Work Experience Section */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">الخبرات العملية</h3>

            {/* Work Experience Input */}
            <Input
              type="text"
              value={experienceInput}
              onChange={(e) => setExperienceInput(e.target.value)}
              placeholder="أدخل الخبرة العملية"
              className="w-full p-3 text-right border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300 focus:outline-none transition"
              dir="rtl"
            />

            {/* Add Experience Button */}
            <Button
              onClick={handleAddExperience}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md mt-4"
            >
              إضافة خبرة
            </Button>

            {/* Display added experiences */}
            <div className="space-y-2 mt-4">
              {cvExperiences.length > 0 ? (
                cvExperiences.map((experience, index) => (
                  <div key={index} className="text-gray-600">{experience}</div>
                ))
              ) : (
                <div className="text-gray-600">لم تتم إضافة خبرات بعد.</div>
              )}
            </div>
          </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button
                onClick={handleProfessionalize}
                type="button"
                variant="outline"
                className="border-[#b11f1f] text-[#b11f1f] hover:bg-red-50 hover:text-red-600 px-6 py-2 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md"
              >
                تحويل إلى صيغة رسمية
              </Button>

              <Button
                onClick={handleSave}
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md"
              >
                حفظ السيرة الذاتية
              </Button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
