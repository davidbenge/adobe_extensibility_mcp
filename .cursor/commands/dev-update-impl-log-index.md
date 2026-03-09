# /dev-update-impl-log-index

**Invoked by**: Auto from /dev-write-impl-log-entry  
**Chains to**: End

## Load

Relevant specialist skill for domain

## Process

- Update impl-log/[domain]/index.md in-place (current state only)
- Never append; replace with updated inventory
- Annotate entries added or materially changed by this story with the Jira ID (e.g. `(AARCH-13)`) so personas scanning the index can find related history in log.md
