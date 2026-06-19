# CodexWeb_Game Agent Rules

## Command Structure

- The game development lead thread receives Keni's instructions, decomposes work, delegates to sub-agents when useful, integrates results, and reports back.
- Sub-agents must work only inside their assigned scope. Do not revert, overwrite, or "clean up" unrelated changes made by other agents or by Keni.
- Prefer disjoint file ownership for parallel work. If a task touches `src/main.js`, the lead should normally integrate that shared file to avoid conflicting game-data edits.

## Project Truth Sources

- Formal game runtime: `src/main.js`, `src/styles.css`, `index.html`.
- Story development console: `src/story-dev-rewrite.js`, `src/story-dev.css`, `story-dev.html`.
- Story/game parity gate: `tools/audit-story-flow.mjs`.
- Static release output is generated into `dist/` by `npm run build`.

## Story Data Rules

- `src/main.js` and `src/story-dev-rewrite.js` must stay aligned for map nodes, action cards, items, flags, gates, and recommended ending routes.
- Do not weaken `tools/audit-story-flow.mjs` to hide data drift. If the audit fails, fix the story data, runtime data, or route logic.
- `need`, `spend`, `needFlag`, and `needFlags` must be reachable through a real earlier route. `spend` also counts as a runtime precondition.
- Critical items must not be randomly dropped or arbitrarily consumed: `壁画残照`, `白塔短波`, `旧城令帖`, `归位铜钥`, `棺钉撬`.
- Avoid reintroducing `spendAny`; use explicit `spend` entries.

## Verification

- For code or story-data changes, run `npm run check`.
- For deployable or previewable changes, also run `npm run build`.
- For visible frontend changes, open the local preview in the in-app browser when possible.

## Mobile Preview Preference

When Keni needs to review a local Mac web project from an iPhone:

- Keep Shadowrocket enabled on the iPhone so Codex Remote Control and external sites continue to work.
- Do not use the Mac/Docker/Clash Tailscale Exit Node for this workflow; it has previously allowed ordinary browsing while causing Codex Remote Control to remain stuck loading.
- Prefer a temporary HTTPS preview backed by a local read-only server, a long one-time share code, and Cloudflare Quick Tunnel.
- Generate a new URL and share code for each preview session. Bind the local server to `127.0.0.1`, disable caching, use an HttpOnly SameSite cookie after verification, and stop the tunnel when review is complete.
- For the implementation and rationale, see `docs/phone-preview.md`.

