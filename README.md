## Cognizant AI Summarizer

Cognizant AI App is a small, focused Next.js application that exposes a single, well‑designed feature: text summarization backed by Hugging Face’s Inference API. It emphasizes **clean feature boundaries**, **local but reusable state management**, and **defensive API design**, while keeping the codebase intentionally small and easy to reason about.

The goal is to demonstrate how a production‑minded frontend engineer structures even a simple app so that it remains maintainable, testable, and ready to grow.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 (Client Components where needed)
- **Styling**: Tailwind CSS 4
- **UI primitives**:
  - Custom `Button` and `AlertDialog` components in `shared/ui/` (Radix-based, shadcn-style)
  - Lucide icons (`lucide-react`)
- **AI integration**: `@huggingface/inference` via `InferenceClient`
- **Language**: TypeScript for shared UI, JavaScript for feature and route code

---

## Architecture Overview

The app uses a **feature-based architecture** layered on top of Next.js’ App Router:

- **Features** live under `features/` and own:
  - Business logic (API client config, hooks)
  - Reusable UI components tied to that feature
  - Local persistence (e.g., history via `localStorage`)
- **Routes** under `app/` are thin page shells:
  - They wire URL structure to feature components
  - They hold only page-scoped UI (layout decisions, param extraction)
  - They deliberately avoid embedding feature logic

This separation is intentional:

- It keeps **business rules and state transitions** inside features.
- It makes **routing concerns** (URLs, layouts, transitions) independent from feature internals.
- It allows the summarizer feature to be reused or migrated (e.g., into another app or shell) with minimal coupling to routing.

### Why history is part of the summarizer feature

The history implementation is placed under `features/summarizer` instead of being a top-level `history` feature, because:

- History entries are **semantically tied** to the summarization feature:
  - Each item is a `(input text, summary, timestamp)` pair.
  - There’s no generic “activity feed” or cross-feature history.
- The lifecycle and persistence mechanism are **specific to summarization**:
  - Stored under a summarizer-specific key (`summarizer_history`).
  - Managed exclusively via `useSummarizerHistory`.
- Keeping it co-located:
  - Avoids a “fake abstraction” for a single, feature-only use case.
  - Keeps the **feature boundary clear**: if summarizer is removed, history disappears with it.

If in the future multiple features needed shared history, this code can be generalized and extracted into its own feature. For now, the design is intentionally **right-sized** to avoid premature abstraction.

### Why some components live under `app/` instead of `features/`

Page components under `app/(home)` and `app/history/[id]` are **route-scoped UI**:

- `app/(home)/page.js`:
  - Renders a page title and centers `SummarizerForm`.
- `app/history/[id]/page.jsx`:
  - Extracts the dynamic route param and passes it to `HistoryDetail`.

These are **not** reusable feature logic; they are **entry points** that:

- Bind URL structure (`/`, `/history/:id`) to features.
- Make layout decisions (e.g., where the form is centered, how the page is padded).
- Contain no business logic, no persistence, and no domain-specific decisions.

Keeping these route-only components in `app/` ensures that:

- **Feature code remains portable** and testable in isolation.
- **Route changes** (e.g., adding `/summarizer` or `/dashboard`) don’t require moving or rewriting feature components.

---

## Folder Structure

High-level structure (only relevant parts shown):

```text
app/
  layout.js                     # Root layout, wraps everything in SummarizerLayout
  globals.css                   # Tailwind + global theme tokens

  (home)/
    page.js                     # Home page: page shell around SummarizerForm
    _components/
      SummarizerLayout.jsx      # Overall app layout + responsive sidebar shell
      SummarizerSideBar.jsx     # Sidebar containing the Summarizer history panel

  api/
    summarize/
      route.js                  # POST /api/summarize – server-side summarization endpoint

  history/
    [id]/
      page.jsx                  # Page shell around HistoryDetail for a given history ID

features/
  summarizer/
    components/
      SummarizerForm.jsx        # Main input form, fetches summaries & manages UI state
      SummaryResult.jsx         # Displays summary, copy-to-clipboard, and errors
      HistoryPanel.jsx          # Sidebar history list + per-item + bulk deletion
      HistoryDetail.jsx         # Detailed view for a single history entry
    hooks/
      useSummarizerHistory.js   # Custom hook for history state & localStorage persistence
    summarizer.config.js        # Hugging Face inference client configuration
    summarizer.service.js       # Reserved for future service abstractions

shared/
  ui/
    button.tsx                  # Reusable button component with variants/sizes
    alert-dialog.tsx            # Composable AlertDialog primitives (Radix-based)
  lib/
    utils.ts                    # Tailwind-aware `cn` helper for class composition

package.json                    # Tooling & runtime dependencies
.env.local                      # HF_TOKEN (Hugging Face API token) – not committed
```

**Justification:**

- `features/summarizer` owns *everything* related to summarization.
- `shared/ui` and `shared/lib` are **implementation-agnostic** primitives (design system + utilities).
- `app/` is purely routing & layout glue.

---

## State Management Strategy

The project intentionally avoids global state and uses **local React state + a custom hook**.

### Summarizer form state

`SummarizerForm.jsx`:

- `input` – the textarea value.
- `summary` – the latest summary returned by the API.
- `loading` – whether a request is in flight.
- `error` – error message from failed requests.

This state is **fully local** to the form, because:

- It is not shared with unrelated components.
- Resetting and scoping are straightforward and predictable.
- It avoids unnecessary global complexity (no Redux/Context for simple page-local state).

### History state via `useSummarizerHistory`

`useSummarizerHistory.js` encapsulates:

- `history` – array of `{ id, text, summary, timestamp }`.
- `isLoaded` – indicates when `localStorage` has been read (prevents premature writes).
- Methods:
  - `addToHistory(text, summary)`
  - `clearHistory()`
  - `removeFromHistory(id)`

**Why a custom hook instead of lifting state or using Context:**

- **Not lifted into pages or layouts**:
  - Lifting history up to the page or `SummarizerLayout` would force **prop drilling** into `SummarizerForm`, `HistoryPanel`, and `HistoryDetail`.
  - Those consumers live in different parts of the tree (sidebar, main content, history detail), making lifting awkward and brittle.
- **Not using React Context yet**:
  - History is currently **feature-local**, not cross-cutting app state.
  - Introducing Context would be **over-engineering**:
    - Extra provider wiring in `layout.js`
    - Harder to test in isolation
    - More global coupling than the problem requires
- **Custom hook is the right middle ground**:
  - Encapsulates **persistence logic** (localStorage access, serialization) in one place.
  - Keeps **API surface small and explicit** (`addToHistory`, `clearHistory`, `removeFromHistory`).
  - Consumers (`SummarizerForm`, `HistoryPanel`, `HistoryDetail`) are simple and focused on UI.

In short, the hook pattern offers **modularity and testability** without global complexity.

---

## API Design

The summarization endpoint is `POST /api/summarize?model=facebook/bart-large-cnn` (`app/api/summarize/route.js`).

### Input handling and validation

```js
export async function POST(req) {
  let body;
  const model = req.nextUrl.searchParams.get("model") || "facebook/bart-large-cnn";

  try {
    body = await req.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      },
      400,
    );
  }

  const text = typeof body === "object" && body !== null && "text" in body ? body.text : undefined;

  if (typeof text !== "string") {
    // ...
  }

  if (!text.trim()) {
    // ...
  }

  // ...
}
```

Validation steps:

1. **JSON parsing**:
   - Catches invalid JSON and returns `400` with `code: "INVALID_JSON"`.
2. **Shape validation**:
   - Ensures `body.text` exists and is a string, otherwise responds with `400` and `code: "INVALID_INPUT"`.
3. **Semantic validation**:
   - Ensures `text.trim()` is non-empty, otherwise `400` with `code: "EMPTY_TEXT"`.

The client (`SummarizerForm`) also guards against empty input before sending, but the API still validates server-side to remain robust against malformed clients.

### Summarization call and model configurability

Configuration is isolated in `features/summarizer/summarizer.config.js`:

```js
import { InferenceClient } from "@huggingface/inference";

export const hf = new InferenceClient(process.env.HF_TOKEN);
```

Key points:

- **HF_TOKEN is server-side only**:
  - Read from `process.env.HF_TOKEN` on the server.
  - Never exposed to the client; the frontend calls the API route, not Hugging Face directly.
- **Model is configurable per-request**:
  - `model` is read from `req.nextUrl.searchParams.get("model")` with a default.
  - The client currently uses `?model=facebook/bart-large-cnn`, but this is easily changed.

### Response normalization and error handling

The route normalizes potentially different HF responses:

- Handles:
  - Raw string summaries.
  - Arrays with `summary[0].summary_text`.
  - Objects with `summary.summary_text`.

If no `summaryText` can be derived, it returns:

- `502` with `code: "INVALID_MODEL_RESPONSE"`.

Exceptions from the HF client are caught:

- Error code: `"HF_REQUEST_FAILED"`.
- Status: `502`.
- Message: either the original `Error.message` or a generic `"Hugging Face request failed."`.

Successful responses:

- `200 OK` with `{ ok: true, summary: summaryText }`.

This design:

- Uses **clear, machine-parsable error codes**.
- Avoids leaking internal errors directly but still surfaces useful messages.
- Is tolerant to **schema variations** in the HF response format.

---

## UX Decisions

The UX is intentionally minimal yet thoughtful, focusing on **fast feedback** and **safe destructive actions**.

### Summarizer form

- **Loading state**:
  - While a summarization request is in flight:
    - The submit button shows a spinner (`Loader2Icon`).
    - The button is disabled to prevent duplicate requests.
    - Previous summary is cleared to avoid confusion between states.
- **Error state**:
  - Server/API errors are caught and mapped to a human-readable message.
  - Displayed below the form as a red alert in `SummaryResult`.
- **Keyboard behavior**:
  - `Enter` submits the form when not combined with `Shift`.
  - `Shift+Enter` inserts a newline.
  - This mimics modern chat/AI UIs and keeps interaction efficient.
- **Textarea scroll UX**:
  - The textarea uses `overflow-y-auto` with a custom `no-scrollbar` class:
    - Content can scroll using wheel/trackpad or text selection.
    - The UI keeps a clean, minimal appearance without scrollbar chrome.
  - `max-h-32` constrains height to prevent the form from dominating the viewport.

### Summary display and copy

`SummaryResult`:

- Shows the latest summary in a styled card.
- Provides a **copy button** with feedback:
  - Changes icon / color when copying succeeds.
  - Reverts after a short timeout.
- Errors are displayed in a separate, clearly visible red box.

This balances **utility** (fast copy) with **feedback** (did the copy work?) and keeps the UI unambiguous.

### History UX

`HistoryPanel`:

- Shows a time-ordered list of past summarizations.
- Each entry:
  - Displays a truncated version of the input text and a timestamp.
  - Is clickable to open `/history/:id` with full details.
  - Has an inline delete icon that opens a **confirmation dialog**.
- **Clear history**:
  - Button is disabled when history is empty.
  - Wrapped in an AlertDialog with explicit confirmation.

`HistoryDetail`:

- Uses a **stacked card layout**:
  - “Original text” with character count and scrollable content.
  - “Summary” with “Generated on …” metadata.
- Provides a **back button** to the main summarizer view.

The combination of history, confirmations, and detail views demonstrates an emphasis on **data safety** and **traceability** even in a small app.

### Layout & responsiveness

- **SummarizerLayout**:
  - On large screens:
    - Fixed sidebar (`SummarizerSideBar`) on the left.
    - Main content offset via `lg:pl-58`.
  - On small screens:
    - Sidebar collapses and is toggled via a top-left menu button.
    - An overlay/backdrop prevents underlying content interaction when the sidebar is open.
- This ensures:
  - The main experience (summarizing text) stays central.
  - History is always accessible but never blocks usage on small viewports.

---

## Trade-offs and Decisions

1. **LocalStorage vs database**  
   - Chosen: `localStorage` via `useSummarizerHistory`.
   - Rationale:
     - Good enough for a single-user, browser-based side panel.
     - Zero infra, zero network overhead for history reads.
     - Keeps the app deployable without backend storage.
   - Trade-off: History does not sync across devices; suitable for this project’s scope.

2. **Custom hook vs Context/Redux**  
   - Chosen: `useSummarizerHistory` hook.
   - Rationale:
     - Encapsulates logic without polluting global app state.
     - Avoids context providers in the root layout for a feature-local concern.
     - Keeps test surface small.
   - Trade-off: If many more consumers or features start sharing this state, a Context abstraction might become preferable.

3. **Single API route vs client-side HF calls**  
   - Chosen: server-side `POST /api/summarize`.
   - Rationale:
     - Keeps secrets (`HF_TOKEN`) server-only.
     - Simplifies client (plain `fetch` with JSON).
     - Centralizes input validation and error handling.
   - Trade-off: Adds a small amount of server logic, but this is a clear win for security and control.

4. **Feature-based foldering**  
   - Chosen: `features/summarizer`, `shared/ui`.
   - Rationale:
     - Clear boundaries between summarization logic and generic UI.
     - Scales cleanly to additional features (e.g., translation, classification).
   - Trade-off: Slight upfront structure overhead for a small app, but it pays off as features grow.

---

## Future Improvements

These are **not implemented yet**, but the current design makes them straightforward to add:

- **Backend persistence**:
  - Migrate history from `localStorage` to a database (e.g., Postgres, SQLite, or a cloud KV).
  - Replace or augment `useSummarizerHistory` with a data-fetching layer (React Query / server actions).
- **Authentication & multi-user history**:
  - Gate the app behind authentication.
  - Associate history with user accounts instead of a single browser.
- **Streaming responses**:
  - Use streaming APIs from HF or another provider.
  - Update `SummaryResult` progressively as tokens arrive.
- **Caching & rate limiting**:
  - Cache identical requests on the server for cost savings.
  - Add rate limiting in the API route to protect downstream services.
- **Model selection UI**:
  - Surface the `model` query parameter as a dropdown allowing advanced users to switch summarization models.
- **Enhanced error messaging**:
  - Map API error codes (`INVALID_INPUT`, `HF_REQUEST_FAILED`, etc.) to friendlier user messages.
  - Log detailed errors server-side only.

---

## How to Run Locally

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

2. **Set Hugging Face token**

Create a `.env.local` file in the project root:

```bash
HF_TOKEN=your_hugging_face_inference_token_here
```

3. **Start the dev server**

```bash
npm run dev
# or
yarn dev
```

4. **Open the app**

- Go to `http://localhost:3000` in your browser.

You should see the summarizer form with the history sidebar. Summaries will be generated via the configured Hugging Face model and persisted in localStorage.

---

## Why This Project Reflects Production-Ready Thinking

Even though the scope is intentionally small, the codebase showcases:

- **Clear separation of concerns**:
  - Features vs routing vs shared UI.
  - Business logic in hooks/config, not buried in components.
- **Defensive API design**:
  - Input validation and semantic checks.
  - Normalized responses and explicit error codes.
  - Proper HTTP status usage (`400`, `502`, `200`).
- **Security-aware integration**:
  - HF token kept strictly on the server side.
  - Client never touches third-party credentials.
- **Thoughtful UX**:
  - Loading and error states are handled explicitly.
  - Keyboard shortcuts match user expectations.
  - Destructive actions are gated behind confirmation dialogs.
- **Scalability path**:
  - Feature-based architecture will tolerate new features and cross-cutting concerns.
  - History logic and summarization client are structured so they can be swapped or extended without rewriting the UI.

Altogether, this repository is less about raw feature count and more about **how** features are implemented: with clean boundaries, explicit trade-offs, and an eye toward maintainability and growth.
