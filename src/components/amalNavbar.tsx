"use client";
import { useState } from "react";

interface AmalNavbarProps {
	backgroundColor?: string;
}

export default function AmalNavbar({ backgroundColor }: AmalNavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav
			className="fixed top-0 left-0 z-50 w-full py-1 text-white shadow-md"
			style={{ backgroundColor: backgroundColor }} // استخدام خاصية style
		>
			<div className="container mx-auto flex items-center justify-between px-6">
				<img
					src="../image/logo/LOGO.png"
					alt="أمل Logo"
					className="h-17 w-28 object-contain"
				/>

				<button
					onClick={toggleMenu}
					className="block focus:outline-none sm:hidden"
					aria-label="فتح القائمة"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16m-7 6h7"
						></path>
					</svg>
				</button>

				<ul
					className={`${
						isMenuOpen ? "block" : "hidden"
					} absolute top-16 right-0 left-0 z-10 space-y-4 bg-[#283a5c] p-4 sm:static sm:flex sm:space-y-0 sm:bg-transparent sm:p-0 ${
						isMenuOpen ? "flex-col" : "sm:flex-row"
					} sm:flex sm:w-full sm:max-w-2xl sm:items-center sm:justify-around`}
				>
					<li className="text-center">
						<a
							href="/home"
							className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
						>
							الصفحة الرئيسية
						</a>
					</li>
					<li className="text-center">
						<a
							href="/home#about"
							className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
						>
							من نحن
						</a>
					</li>
					<li className="text-center">
						<a
							href="/home#services"
							className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
						>
							خدماتنا
						</a>
					</li>
					<li className="text-center">
						<a
							href="/home#contact"
							className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
						>
							تواصل معنا
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
