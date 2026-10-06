import type {
  CreatePrivateEventEnquiryInput,
  PrivateEventEnquiryReceipt,
} from "@ember-and-oak/types";

export class PrivateEventApiError extends Error {
  constructor(
    readonly code: "VALIDATION_ERROR" | "IDEMPOTENCY_CONFLICT" | "REQUEST_ERROR",
    readonly status: number,
  ) {
    super("Private-event enquiry request failed");
    this.name = "PrivateEventApiError";
  }
}

export async function submitPrivateEventEnquiry(
  input: CreatePrivateEventEnquiryInput,
  idempotencyKey: string,
): Promise<PrivateEventEnquiryReceipt> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  let response: Response;
  try {
    response = await fetch(new URL("/api/v1/private-event-enquiries", baseUrl), {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new PrivateEventApiError("REQUEST_ERROR", 0);
  }
  let envelope: unknown;
  try {
    envelope = await response.json();
  } catch {
    throw new PrivateEventApiError("REQUEST_ERROR", response.status);
  }
  if (!response.ok) {
    const error =
      envelope && typeof envelope === "object" && "error" in envelope ? envelope.error : undefined;
    const rawCode = error && typeof error === "object" && "code" in error ? error.code : undefined;
    const code =
      rawCode === "VALIDATION_ERROR" || rawCode === "IDEMPOTENCY_CONFLICT"
        ? rawCode
        : "REQUEST_ERROR";
    throw new PrivateEventApiError(code, response.status);
  }
  if (!envelope || typeof envelope !== "object" || !("data" in envelope)) {
    throw new PrivateEventApiError("REQUEST_ERROR", response.status);
  }
  const data = envelope.data;
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("receivedAt" in data) ||
    typeof data.receivedAt !== "string"
  ) {
    throw new PrivateEventApiError("REQUEST_ERROR", response.status);
  }
  return { id: data.id, receivedAt: data.receivedAt };
}
