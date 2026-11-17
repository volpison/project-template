# Decision log

One short paragraph per decision, newest last: what was decided, why, and what was left out. Future you forgets the why.

Template for a new entry:

```
## Short title (YYYY-MM)

Decided: …
Why: …
Left out: … (and when to revisit it, if ever)
```

The first entries below came from Fabulator and apply to every project started from this template. Change them if a project decides otherwise, and say so in a new entry.

## Docs live in the repository (2026-11)

Decided: documentation is Markdown under `docs/`, next to the code, with a short README that links to it.
Why: it changes in the same pull request as the code, it is reviewed with it, and a link check can keep it healthy. A wiki drifts away from the code.
Left out: a hosted documentation site. Add one only when readers need it.

## Every change is a pull request from a branch (2026-11)

Decided: nothing is pushed to `main`; each change is a pull request with one topic and a "Check before merging" list.
Why: small, checked changes are easy to review and easy to undo, and CI judges them before they land.
Left out: direct pushes, even for tiny fixes.

## A new kind of document keeps its data under one key (2026-11)

Decided: when a project learns a new kind of document, all of its data lives under one key named after it (`"game": { ... }`).
Why: kinds do not mix their lists with the shared parts, and an older version that does not know the kind leaves the key untouched.
Left out: moving every kind into a common `world` and `document` layout; it would touch everything without adding a feature, and a minimum reader version makes it safe to do later as its own step.

## Pure moves and behaviour changes are separate pull requests (2026-11)

Decided: a refactor that changes no behaviour is its own pull request.
Why: a pure move is easy to check (the tests do not change); a mixed one hides mistakes.
Left out: "while I am here" fixes in a move.
