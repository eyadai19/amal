import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const authCookie = req.cookies.get("auth_session");

		if (!authCookie?.value) {
			return NextResponse.json(
				{ isLoggedIn: false },
				{ status: 401 }, 
			);
		}

		return NextResponse.json({ isLoggedIn: true }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
