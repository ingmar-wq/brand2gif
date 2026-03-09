import { analyzePDF } from "@/lib/gemini";
import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return Response.json({ error: "No PDF file provided." }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return Response.json(
        { error: "PDF file is too large. Maximum size is 4.5MB." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File must be a PDF." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const brandData = await analyzePDF(base64, apiKey);

    return Response.json(brandData);
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      { error: `Failed to analyze PDF: ${message}` },
      { status: 500 }
    );
  }
}
