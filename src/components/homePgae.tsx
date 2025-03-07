"use client";

import Link from "next/link";
export function HomeComponent() {
	return (
		<div className="section px-4 py-8" id="home">
			<div className="flex flex-col items-center justify-evenly md:flex-row md:space-x-6">
				{/* Text Content */}
				<div className="text-center md:max-w-lg md:text-left">
					<h2 className="mb-2 text-xs font-bold text-[#00203F]">
						Learn SQL Like Never Before
					</h2>
					<h1 className="text-[1.825rem] leading-tight font-bold sm:text-[2.5rem]">
						Have you ever tried <br />{" "}
						<span className="font-semibold text-[#ADF0D1]"> AI-supported </span>{" "}
						<br /> learning?
					</h1>
					<p className="mt-4 max-w-md text-sm leading-7 text-gray-700">
						This is the new way to learn SQL
					</p>
					{/* Buttons */}
					<div className="mt-6 flex justify-center space-x-4 md:justify-start">
						<Link href="/basic/dataType">
							<button className="rounded-lg bg-[#00203F] px-6 py-3 text-sm font-bold text-[#ADF0D1] transition-colors hover:bg-[#004466]">
								Get Started
							</button>
						</Link>
						<button className="rounded-lg border border-solid border-[#00203F] px-6 py-3 text-sm font-bold transition-colors hover:bg-[#00203F] hover:text-[#ADF0D1]">
							<Link href="#try" className="transition-colors hover:text-white">
								Discover
							</Link>
						</button>
					</div>
				</div>
				{/* Image */}
				<div className="mt-8 w-full md:mt-0 md:w-[50%]">
					<img
						src={"../image/HomeImages/HomeComponent.jpg"}
						alt="Home Component"
						className="h-auto w-full rounded-lg object-cover shadow-lg"
					/>
				</div>
			</div>
		</div>
	);
}
