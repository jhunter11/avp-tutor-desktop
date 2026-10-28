# Tutor API v1

The frontend makes one tutoring request. Provider names, model IDs, keys, tools and routing are backend concerns. The old `generated_code` API is not part of this contract.

Development path: `POST /MiamiOH-AVP-Demo/api/tutor`. Vite proxies this to the Python service's `POST /api/tutor`. A deployed frontend needs the equivalent same-origin reverse proxy. This local integration does not configure Miami production authentication or hosting.

Headers: `Content-Type: application/json`, `X-Tutor-Client: web-v1`. The local service binds to loopback, allows the configured frontend origin, and does not log learner payloads. `TUTOR_ALLOWED_ORIGIN` sets a comma-separated exact origin list on a configured host.

```json
{
  "schema_version": "1",
  "request_id": "frontend-generated-unique-id",
  "question": "Why does this stop early?",
  "mode": "hint",
  "history": [],
  "context": {
    "algorithm": "Linear Search",
    "student_code": "the exact current editor source",
    "executed_code": "the saved source associated with the interpreter trace",
    "viewed_state": {
      "step": 3,
      "total_steps": 26,
      "highlighted_lines": 4,
      "variables": {"i": [0, 1]},
      "last_step": {"line": 4, "actions": []},
      "code_matches_execution": false
    },
    "screenshots": [{"label": "Visualization", "data_url": "data:image/png;base64,..."}]
  }
}
```

`mode` is `hint` or `explain`. History entries have exactly `role` (`user`/`assistant`) and `content`. Variable entries and `last_step` retain the inherited visualizer's JSON data; variable tuples include displayed highlight information. Step is the displayed step counter, not an inferred instruction pointer. A null highlighted line is allowed. A two-number line range is also allowed. This API does not independently verify execution or program correctness.

The client captures visualization and variable panes, excluding the tutor conversation and the rest of the desktop. Capture failures prevent submission. If code/state changes while capture is being prepared, the client asks the student to stop and retry. Replies for a view that has since changed stay labeled as an earlier view. Current editor source and the trace's source remain separate when edits are unsaved.

Every response uses the same four fields, including errors:

```json
{"schema_version":"1","request_id":"frontend-generated-unique-id","answer":"Consider which condition must be false before returning.","error":null}
```

```json
{"schema_version":"1","request_id":"frontend-generated-unique-id","answer":null,"error":{"code":"provider_error","message":"The tutor could not respond. Please retry."}}
```

The pane renders `answer` as plain text. It does not execute HTML, apply patches or change code. Unknown response shapes, including `generated_code`, are rejected. Invalid request fields are rejected rather than silently extending v1. A request that cannot be parsed or is rejected before its ID is read returns an empty request ID.

Limits: 4,000 question characters; 32,000 per code string; 12 history turns, 16,000 characters each and 24,000 combined; 100,000 serialized viewed-state characters; 1–4 PNG data URLs of at most 1,500,000 characters each; six MB total HTTP body. The client includes the most recent bounded history. No remote image URLs are fetched. The client stops waiting after 135 seconds; cancellation does not guarantee an upstream model request is canceled.

## Provider boundary

`backend/providers.py` converts the same canonical context into OpenRouter Chat Completions or OpenAI Responses requests, including image content. Both normalize to the same text envelope. OpenRouter checks current catalog pricing/image support before inference and forbids fallback routes in free-only mode. A text-only model is rejected instead of dropping screenshots. Default: free-only `nvidia/nemotron-3.5-super-vl:free`, selected from the catalog during integration; availability is rechecked at request time. Existing standalone-demo settings remain unchanged.

OpenAI support is implemented and tested with mocked provider responses. It is not enabled for live paid calls in this change. Configure provider/model/key server-side and explicitly opt in with `TUTOR_ALLOW_PAID=1` only when authorized. No frontend shape changes are required.

References checked during implementation: [OpenAI vision inputs](https://developers.openai.com/api/docs/guides/images-vision), [OpenRouter completion API](https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion), [OpenRouter image inputs](https://github.com/OpenRouterTeam/docs/blob/main/guides/overview/multimodal/image-understanding.mdx).

## A future saved solution action

No “I give up” button is added here. If approved later, map an exercise ID to a reviewed, versioned correct AVP file and ask before replacing the student's editor contents. It must call that deterministic application action, not `/api/tutor` or a model. Keep the student's draft recoverable and reset/recompile the visualizer after explicit replacement.
