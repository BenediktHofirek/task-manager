import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

async function withAccessToken(req: NextRequest) {
  const { token: authToken } = await auth0.getAccessToken();

  return fetch(`${process.env.API_URL}${req.nextUrl.pathname}/${req.nextUrl.search}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}

export async function GET(request: NextRequest) {
  return withAccessToken(request);
}

export async function POST(request: NextRequest) {
  return withAccessToken(request);
}
//
// export async function PUT(request) {
//   const result = await universalFunction(request);
//   return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
// }
//
// export async function PATCH(request) {
//   const result = await universalFunction(request);
//   return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
// }
//
// export async function DELETE(request) {
//   const result = await universalFunction(request);
//   return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
// }
