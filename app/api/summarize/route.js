import { hf } from "@/features/summarizer/summarizer.config";

function jsonResponse(payload, status) {

  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req) {
  let body;
  const model = req.nextUrl.searchParams.get("model") || "facebook/bart-large-cnn";

  try {

    body = await req.json();

  } catch {
    return jsonResponse(
      {
        ok: false,error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        }
      },400
    );
  }

  const text = typeof body === "object" && body !== null && "text" in body ? body.text : undefined;

  if (typeof text !== "string") {
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Field 'text' is required and must be a string.",
        }
      },400
    );
  }

  if (!text.trim()) {

    return jsonResponse(
      {
        ok: false,
        error: {
          code: "EMPTY_TEXT",
          message: "Field 'text' cannot be empty.",
        }
      },400
    );
  }
  
  try {
    const summary = await hf.summarization({
      model: model,
      inputs: text.trim(),
    });

    const summaryText = Array.isArray(summary) && summary.length > 0 &&
      typeof summary[0].summary_text === "string" 
      ? summary[0].summary_text : null;

    if (!summaryText) {

      return jsonResponse(
        {
         ok: false,
         error: {
           code: "INVALID_MODEL_RESPONSE",
           message: "Unexpected response from summarization model.",
         }
        },502
      );
    }

    return jsonResponse({ ok: true, summary: summaryText }, 200);  

  } catch (error) {
    const message = error instanceof Error ? error.message : "Hugging Face request failed.";

    return jsonResponse(
      {ok: false,
        error: {
          code: "HF_REQUEST_FAILED",
          message,
        }
      },502
    );
  }
}
