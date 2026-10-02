import { timingSafeEqual } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_EDITOR_USERNAME;
  const password = process.env.ADMIN_EDITOR_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Admin editor credentials are not configured", { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (
      separator > -1 &&
      safeEqual(decoded.slice(0, separator), username) &&
      safeEqual(decoded.slice(separator + 1), password)
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Ember & Oak Content"' },
  });
}

export const config = { matcher: ["/content/:path*"] };
