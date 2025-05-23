import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const authCookie = request.cookies.get("auth_session");

	if (!authCookie?.value) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/Profile/:path*",
		"/legal/:path*",
		"/psychological/:path*",
		"/literacy/:path*",
		"/letters/:path*",
		"/career/:path*",
		"/cvbuilder/:path*",
		"/cv-preview/:path*",
	],
};
