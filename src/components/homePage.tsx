"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [categories, setCategories] = useState([
    {
      title: "القسم التعليمي",
      description: "!تعلّم معنا",
      bgColor: "bg-[#D8E5F0]",
      textColor: "text-[#1E3A6E]",
      href: "/literacy",
    },
    {
      title: "القسم المهني",
      description: "!مسارك المهني",
      bgColor: "bg-[#E49B97]",
      textColor: "text-[#B84941]",
      href: "/career",
    },
    {
      title: "القسم النفسي",
      description: "!صحتك النفسية",
      bgColor: "bg-[#E2C8D3]",
      textColor: "text-[#582C5E]",
      href: "/psychological",
    },
    {
      title: "القسم القانوني",
      description: "!ثق بنا واسألنا ما تريد",
      bgColor: "bg-[#FFCB99]",
      textColor: "text-[#D78448]",
      href: "/legal",
    },
  ]);

  useEffect(() => {
    console.log("HomePage component mounted!");
  }, []);

  return (
    <div className="min-h-screen bg-[#E1D9D1] flex flex-col">
      <nav className="bg-[#697867] text-white py-1 shadow-md">
		<div className="container mx-auto flex justify-between items-center px-6">
			<img
			src="../image/authImage/a.png"
			alt="أمل Logo"
			className="w-28 h-17 object-contain"
			/>
			<ul className="flex justify-around w-full max-w-4xl">
				<li className="flex-grow text-center">
					<Link href="/home" passHref>
					<span
						className="text-lg font-semibold hover:text-[#E1D9D1] transition duration-300 block w-full cursor-pointer"
						onClick={() => window.location.reload()}
					>
						الصفحة الرئيسية
					</span>
					</Link>
				</li>
				<li className="flex-grow text-center">
					<Link href="/about-us" className="text-lg font-semibold hover:text-[#E1D9D1] transition duration-300 block w-full">
					من نحن
					</Link>
				</li>
				<li className="flex-grow text-center">
					<Link href="/our-services" className="text-lg font-semibold hover:text-[#E1D9D1] transition duration-300 block w-full">
					خدماتنا
					</Link>
				</li>
				<li className="flex-grow text-center">
					<Link href="/contact" className="text-lg font-semibold hover:text-[#E1D9D1] transition duration-300 block w-full">
					تواصل معنا
					</Link>
				</li>
			</ul>

		</div>
		</nav>


      <div className="flex-1 flex justify-center items-center p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
          <motion.img
			src="../image/authImage/LOGO.png"
			alt="أمل Logo"
			className="m-9 w-70"
			initial={{ opacity: 0, scale: 0.8, y: -20 }} 
			animate={{ opacity: 1, scale: 1, y: 0 }} 
			transition={{ duration: 1, ease: "easeOut" }} 
			whileHover={{ scale: 1.1 }} 
			/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-150">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <div
                  className={`p-9 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 duration-300 ${category.bgColor} ${category.textColor} w-full`}
                >
                  <div className="flex flex-col justify-center items-center h-full">
                    <h2 className="text-3xl font-bold text-center">{category.title}</h2>
                    <p className="text-xl mt-4 text-center">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
