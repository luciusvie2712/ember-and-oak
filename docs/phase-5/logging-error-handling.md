# Logging and Error Handling

Every API request receives a UUID correlation ID (a valid caller-provided `x-request-id` may be propagated) and returns it in the response header. Completion logs are one-line JSON with event, request ID, method, path, status, and duration.

Errors use `{ "error": { "code": "...", "message": "...", "requestId": "..." } }`. Public messages are stable and non-sensitive. SQL, stack traces, secrets, passwords, raw request bodies, and customer PII never enter responses or routine logs. Internal error tracking may retain a stack under access control and retention policy while correlating by request ID.
