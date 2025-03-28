"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SectionType = "literacy" | "career" | "psychological" | "legal" | null;

interface AmalNavbarProps {
	backgroundColor?: string;
	activeSection?: SectionType;
}

const sectionColors: Record<
	string,
	{ bg: string; text: string; light: string; hover: string }
> = {
	// literacy: { bg: "#4CAF50", text: "#ffffff", light: "#A5D6A7" },
	// career: { bg: "#2196F3", text: "#ffffff", light: "#90CAF9" },
	// psychological: { bg: "#9C27B0", text: "#ffffff", light: "#CE93D8" },
	// legal: { bg: "#FF9800", text: "#ffffff", light: "#FFCC80" },
	literacy: {
		bg: "#2A5C9A",
		text: "#FFFFFF",
		light: "#A7C7F2",
		hover: "#3D7BC8",
	},
	career: {
		bg: "#D6453D",
		text: "#FFFFFF",
		light: "#FFB8B3",
		hover: "#E85C54",
	},
	psychological: {
		bg: "#7D3C98",
		text: "#FFFFFF",
		light: "#D9B3E6",
		hover: "#9257AD",
	},
	legal: {
		bg: "#FF8C42",
		text: "#FFFFFF",
		light: "#FFD1A8",
		hover: "#FF9E5E",
	},
};

export default function AmalNavbar({
	backgroundColor = "#283a5c",
	activeSection = null,
}: AmalNavbarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [userLoggedIn, setUserLoggedIn] = useState(true);
	const pathname = usePathname();
	const isHomePage = pathname === "/home" || pathname === "/";
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	useEffect(() => {
		async function checkLoginStatus() {
			try {
				const response = await fetch("/api/is_logged_in");
				if (!response.ok) {
					console.error("Failed to fetch login status:", response.statusText);
					setUserLoggedIn(false);
					return;
				} else setUserLoggedIn(true);
			} catch (error) {
				setUserLoggedIn(false);
				return;
			}
		}

		checkLoginStatus();
	}, []);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.redirected) {
				window.location.href = response.url;
			} else {
				router.push("/login");
			}
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<nav
			className="fixed top-0 left-0 z-50 w-full py-2 text-white shadow-md"
			style={{ backgroundColor }}
		>
			<div className="container mx-auto flex items-center justify-between px-6">
				<img
					src="../image/logo/LOGO.png"
					alt="أمل Logo"
					className="h-17 w-28 object-contain"
				/>

				<button
					onClick={toggleMenu}
					className="rounded-md p-2 hover:bg-white/10 focus:outline-none md:hidden"
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
							d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
						></path>
					</svg>
				</button>
			</div>

			{/* القائمة المنسدلة للأجهزة الصغيرة */}
			<div
				className={`${isMenuOpen ? "block" : "hidden"} bg-[#1e2c45] md:hidden`}
			>
				<div className="container mx-auto space-y-4 px-4 py-3">
					{isHomePage ? (
						<>
							<Link
								href="/home#about"
								className="block border-b border-white/10 py-2 text-lg font-medium hover:text-[#D8E5F0]"
								onClick={() => setIsMenuOpen(false)}
							>
								من نحن
							</Link>
							<Link
								href="/home#services"
								className="block border-b border-white/10 py-2 text-lg font-medium hover:text-[#D8E5F0]"
								onClick={() => setIsMenuOpen(false)}
							>
								خدماتنا
							</Link>
							<Link
								href="/home#contact"
								className="block border-b border-white/10 py-2 text-lg font-medium hover:text-[#D8E5F0]"
								onClick={() => setIsMenuOpen(false)}
							>
								تواصل معنا
							</Link>
						</>
					) : (
						<>
							<Link
								href="/literacy"
								className={`block border-b border-white/10 py-2 text-lg font-medium ${
									activeSection === "literacy"
										? "bg-white/10 font-bold"
										: "hover:text-[#D8E5F0]"
								}`}
								style={
									activeSection === "literacy"
										? {
												color: sectionColors.literacy.bg,
												borderLeft: `4px solid ${sectionColors.literacy.bg}`,
											}
										: activeSection
											? { color: sectionColors.literacy.light }
											: {}
								}
								onClick={() => setIsMenuOpen(false)}
							>
								<div className="flex items-center">
									{activeSection === "literacy" && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									القسم التعليمي
								</div>
							</Link>

							<Link
								href="/career"
								className={`block border-b border-white/10 py-2 text-lg font-medium ${
									activeSection === "career"
										? "bg-white/10 font-bold"
										: "hover:text-[#D8E5F0]"
								}`}
								style={
									activeSection === "career"
										? {
												color: sectionColors.career.bg,
												borderLeft: `4px solid ${sectionColors.career.bg}`,
											}
										: activeSection
											? { color: sectionColors.career.light }
											: {}
								}
								onClick={() => setIsMenuOpen(false)}
							>
								<div className="flex items-center">
									{activeSection === "career" && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									القسم المهني
								</div>
							</Link>

							<Link
								href="/psychological"
								className={`block border-b border-white/10 py-2 text-lg font-medium ${
									activeSection === "psychological"
										? "bg-white/10 font-bold"
										: "hover:text-[#D8E5F0]"
								}`}
								style={
									activeSection === "psychological"
										? {
												color: sectionColors.psychological.bg,
												borderLeft: `4px solid ${sectionColors.psychological.bg}`,
											}
										: activeSection
											? { color: sectionColors.psychological.light }
											: {}
								}
								onClick={() => setIsMenuOpen(false)}
							>
								<div className="flex items-center">
									{activeSection === "psychological" && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									القسم النفسي
								</div>
							</Link>

							<Link
								href="/legal"
								className={`block border-b border-white/10 py-2 text-lg font-medium ${
									activeSection === "legal"
										? "bg-white/10 font-bold"
										: "hover:text-[#D8E5F0]"
								}`}
								style={
									activeSection === "legal"
										? {
												color: sectionColors.legal.bg,
												borderLeft: `4px solid ${sectionColors.legal.bg}`,
											}
										: activeSection
											? { color: sectionColors.legal.light }
											: {}
								}
								onClick={() => setIsMenuOpen(false)}
							>
								<div className="flex items-center">
									{activeSection === "legal" && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									القسم القانوني
								</div>
							</Link>
						</>
					)}

					<div className="pt-2">
						{!isHomePage && (
							<Link
								href="/home"
								className="flex items-center py-2 text-lg font-medium hover:text-[#D8E5F0]"
								onClick={() => setIsMenuOpen(false)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								الصفحة الرئيسية
							</Link>
						)}

						{userLoggedIn ? (
							<>
								<Link
									href="/Profile"
									className="flex items-center py-2 text-lg font-medium hover:text-[#D8E5F0]"
									onClick={() => setIsMenuOpen(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									معلومات الحساب
								</Link>
								<button
									className="block cursor-pointer py-2 text-lg font-medium hover:text-[#D8E5F0]"
									onClick={handleLogout}
								>
									{isLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
								</button>
							</>
						) : (
							<Link
								href="/login"
								className="block py-2 text-lg font-medium hover:text-[#D8E5F0]"
								onClick={() => setIsMenuOpen(false)}
							>
								تسجيل الدخول
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
