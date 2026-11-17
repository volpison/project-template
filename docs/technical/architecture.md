# Architecture

> A skeleton. Replace the text below with the project's own structure.

How the code is organised, for a developer who is new to it. Follow [the conventions](../../CONVENTIONS.md): one reason to change per file, pure logic apart from the machine, one boundary to the outside world.

## Layers

Describe the layers from the inside out. A useful default:

```
  user interface        thin: shows data, calls rules
        │
  pure rules            data in, data out: no screen, no disk, no network
        │
  boundary              the only code that touches files, network and the operating system
```

## Folders

List each top-level folder and what it holds, in one line each. Mirror the shape in `tests/` and `docs/`.

## How to add a feature

Write the steps for the most common kind of change (a new screen, a new kind of document, a new command), as a checklist. If the list touches many unrelated places, the structure needs work: record that in [the decision log](decisions.md).
