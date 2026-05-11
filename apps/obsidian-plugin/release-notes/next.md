# Next Obsidian plugin release

## Added

- Version previews now show a line-by-line comparison against the current file when viewing text file history.

## Changed

- Sync push processing now reuses vault-scoped crypto work during a push, reducing repeated encryption setup for larger batches.
- Local sync reconciliation now reuses vault-scoped crypto work while queueing changes, reducing repeated encryption setup for larger batches.

## Fixed

- Signing out now disconnects the active remote vault on this device first.
