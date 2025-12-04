import { GoogleAuth } from "google-auth-library";

export async function POST(req) {
  try {
    const { endpoint, payload, headers } = await req.json();

    const wifConfig = JSON.parse(process.env.GOOGLE_WIF_CONFIG);

    const auth = new GoogleAuth({
      credentials: wifConfig,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(
      JSON.stringify({ status: 500, error: err.message }),
      { status: 500 }
    );
  }
}
