import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

function performLogout(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";
  const isJsonExpected =
    acceptHeader.includes("application/json") && !acceptHeader.includes("text/html");

  if (isJsonExpected) {
    const response = NextResponse.json({ message: "Logout berhasil", redirectUrl: "/login" });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Redirect to /login with status 303 (See Other) for standard form POST submission
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl, { status: 303 });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export async function POST(request: NextRequest) {
  return performLogout(request);
}

export async function GET(request: NextRequest) {
  return performLogout(request);
}
