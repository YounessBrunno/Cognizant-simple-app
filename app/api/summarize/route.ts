import { NextRequest } from "next/server";
import { hf } from "@/features/summarizer/summarizer.config";

export async function POST(req : NextRequest) {
  try {
      const body = await req.json();

      const res = await hf.summarization({
        model: "google/flan-t5-small",
        inputs: body.text,
      })
      return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response("Error processing request", { status: 500 });
  }
}

export async function GET(req : NextRequest) {
  try {
    
  } catch (error) {
    
  }
}