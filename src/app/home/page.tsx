"use client";

import { useRouter } from "next/navigation";

export default function home() {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/quiz/${20}`);
	};

	return (
		<div>
			{/* <HomeComponent />; */}
			<button onClick={handleClick}>Click here</button>
		</div>
	);
}
