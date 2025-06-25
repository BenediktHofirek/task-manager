import { auth0 } from '@/lib/auth0';
import axios, { AxiosRequestConfig, CancelToken } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

async function withAccessToken(
  req: NextRequest,
  method: string,
) {
  const { token: authToken } = await auth0.getAccessToken();

  const url = `${process.env.API_URL}${req.nextUrl.pathname}${req.nextUrl.search}`;

  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  // Add body only for methods that support it and if present
  const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (req.body && methodsWithBody.includes(method.toUpperCase())) {
    config.data = await new Response(req.body).json();
  }

  console.log('config', config)
  const response = await axios(config);

  return NextResponse.json(response.data, {
    status: response.status,
    headers: normalizeHeaders(response.headers),
  });
}

function normalizeHeaders(headers: any): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in headers) {
    const value = headers[key];
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
    } else if (value === undefined || value === null) {
      continue;
    } else {
      result[key] = String(value);
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  return withAccessToken(request, 'GET');
}

export async function POST(request: NextRequest) {
  return withAccessToken(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return withAccessToken(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return withAccessToken(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return withAccessToken(request, 'DELETE');
}

export async function OPTIONS(request: NextRequest) {
  return withAccessToken(request, 'OPTIONS');
}

export async function HEAD(request: NextRequest) {
  return withAccessToken(request, 'HEAD');
}
