import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function getZenusToken() {
  const body = new URLSearchParams();
  body.set("client_id", process.env.ZENUS_CLIENT_ID!);
  body.set("client_secret", process.env.ZENUS_CLIENT_SECRET!);
  body.set("grant_type", process.env.ZENUS_GRANT_TYPE || "client_credentials");

  if (process.env.ZENUS_SCOPE) body.set("scope", process.env.ZENUS_SCOPE);

  const res = await fetch(process.env.ZENUS_TOKEN_URL!, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error("Failed to get Zenus access token");

  return data.access_token;
}

export async function GET() {
  try {
    const token = await getZenusToken();

    const payload = {
      name: "Asira Cryptohost and Information Technology Solutions",
      registrationDate: "2025-01-01",
      identificationNumbers: [
        {
          idNumber: "SEC-2025-000001",
          idCountryCode: "PH",
          primary: true,
        },
      ],
      addresses: [
        {
          addressTypeCode: "R",
          street1: "Makati City",
          cityCounty: "Makati",
          zip: "1226",
          countryCode: "PH",
        },
      ],
      taxNumbers: [
        {
          taxNumber: "123456789000",
          taxNumberTypeCode: "TAX_IDENTIFICATION_NUMBER",
          taxCountryCode: "PH",
          primary: true,
        },
      ],
      webAddress: "https://asira-global-remit.vercel.app",
      counterpartySectorCode: "541511",
    };

    const response = await fetch(
      "https://api.dev.zenus.io/api/zv1/persons/legal",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "application/json",
          "x-request-id": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      personId: data?.data?.personId || null,
      zenus: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to create Zenus legal person",
      },
      { status: 500 }
    );
  }
}