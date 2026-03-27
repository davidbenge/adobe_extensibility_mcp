---

# Developer Setup

## Quick Start

1. Clone this repo (or copy the contents) into your Cursor project root.
2. Start Cursor — the personas, commands, and rules are active immediately.
3. (Optional) Configure MCP servers with credentials in `.cursor/mcp.json`.

No `npm install` or build step required. The framework is pure configuration and markdown.

## MCP Servers

Config: `.cursor/mcp.json`. MCP servers extend agent capabilities with live data and domain knowledge. Add tokens for any server that requires authentication:

1. Set the required env var (e.g. `GITHUB_TOKEN`) in your shell.
2. Start Cursor from that same shell so the env var is available.
3. The server will connect automatically on first use.

## Further Reading

- [Developer Process](developer-process.md) — Full developer workflow: setup, multi-persona roles, commands, constitution, impl-log.
- [Persona and Command Reference](persona-and-command-reference.md) — Where personas/commands live, when to use which, leverage patterns.
- [Persona Skill Authoring](persona-skill-authoring.md) — How to create or update persona SKILL.md files and commands.
- [Context and Memory Architecture](#context-and-memory-architecture) — How the system tracks and manages context across personas, skills, and sessions (below).

---

## Links

**GitHub**

- This repo: [adobe-extensibility-mcp](https://github.com/dbenge/adobe_extensibility_mcp)


## Context and Memory Architecture

### The Core Premise

The entire architecture is built on a single constraint, stated explicitly in `docs/design-principles/vision.md`:

> **Context loading competes with reasoning. Every token loaded is a token not available for reasoning. Personas load only what their role requires.**

This one principle explains every structural decision: why there are separate index files and log files, why stories are ephemeral, why each persona has a scoped skill file, why the constitution lives in its own isolated directory. The system is not organized for developer convenience — it is organized to give each AI persona the minimum viable context it needs to reason at maximum quality.

---

### The Two Permanent Memory Layers

The framework has exactly two categories of permanent storage: the **constitution** and the **impl-log**. Everything else is temporary.

#### Layer 1: The Constitution (`docs/design-principles/`)

The constitution is written once, before any story is planned or any code is written. It contains the invariants that no persona may ever contradict:

```
docs/design-principles/
  vision.md        ← project north star, success metrics, non-goals, target users
  architecture.md  ← approved patterns, banned patterns, ADR conventions, branching rules
  backend.md       ← handler structure, timeout tiers, error patterns, service boundaries
  frontend.md      ← UI framework, component rules, state management, accessibility
  db.md            ← schema conventions, migration policy, connection handling, query rules
  testing.md       ← test pyramid philosophy, coverage expectations, release gate criteria
  security.md      ← risk tier definitions (canonical), non-negotiables, auth model
```

Each file is authored as a set of commands, not suggestions. The terse, directive tone is intentional: every token saved in the constitution is a token available for reasoning when a persona loads it.

**Who reads which constitution file and why:**

| Persona | Reads | Reason |
|---|---|---|
| Product Manager | `vision.md` | Grounds discovery interviews in project north star; prevents out-of-scope stories |
| Architect | `vision.md`, `architecture.md`, all domain files | Reviews all design decisions for principle alignment; cannot approve patterns without knowing what is banned |
| Dev Lead | `architecture.md`, `backend.md` | Assesses feasibility and effort signals against known constraints; needs banned patterns to flag risks |
| Backend Specialist | `backend.md` | Owns API and service implementation; these are the direct coding standards it must follow |
| Frontend Specialist | `frontend.md` | Implementation must match declared component philosophy and state management rules |
| DB Specialist | `db.md` | Schema, migration, connection — every decision needs the canonical data philosophy |
| Test Engineer | `testing.md` | Coverage plan must meet release gate criteria; cannot define tests without knowing the test pyramid |
| Security Expert | `security.md` | Risk tier definitions are canonical and live here; all findings are assigned against these tiers |

No persona loads the entire constitution. Each loads only its relevant file(s). The Architect is the only persona that reads across multiple design-principle files, because architectural review spans all domain boundaries.

#### Layer 2: The Impl-Log (`docs/impl-log/`)

The impl-log is the system's living memory. It grows throughout the life of the project and persists across every story, every sprint, and every developer session. It is structured per domain:

```
docs/impl-log/
  architecture/
    index.md         ← current state of architecture decisions (maintained in-place)
    log.md           ← append-only history of architecture changes
  backend/
    index.md         ← current state of backend structure, endpoints, service map
    log.md           ← history of backend changes
  db/
    index.md         ← current schema, migration state, connection patterns in use
    log.md           ← history of schema changes
  frontend/
    index.md         ← current component inventory, routes, state patterns in use
    log.md           ← history of frontend changes
  test/
    index.md         ← current test coverage state, what is and isn't covered
    log.md           ← history of test changes
  security/
    index.md         ← current security posture, open risks
    log.md           ← history of security reviews
    risk-register.md ← all open Tier 1 and Tier 2 findings with disposition status
```

##### The Critical Distinction: `index.md` vs `log.md`

This is the most important structural decision in the entire memory system, and it is governed by an inviolable rule:

> **Index files are updated in-place and represent only current state. Log files are append-only and represent history.**

A persona reading `backend/index.md` learns exactly what the backend looks like today — what endpoints exist, what service patterns are in use, what has been deprecated. It does not have to read through months of change history to reconstruct present state. The index is a snapshot. The log is an audit trail.

**Why this matters for context management:** If a persona had to read the full `log.md` to understand current system state, the context cost would grow linearly with project age. By maintaining a current-state index, a persona can load a ~100-line index and have complete situational awareness about its domain, then optionally scan `log.md` header lines for related prior work. The log is consulted selectively, never fully.

**Who reads which impl-log file:**

| Persona | Reads | When |
|---|---|---|
| Product Manager | `architecture/index.md` | During `/plan-1` — scans for Jira issue overlap; checks if a similar story was already shipped |
| Architect | All `*/index.md` files | During story review and impl planning — needs cross-domain current state to assess integration impact |
| Architect | `architecture/log.md` header lines | Scans for related prior architecture decisions before writing a new one |
| Dev Lead | `architecture/index.md`, `architecture/log.md` | Assesses effort and identifies known patterns before estimating |
| Backend Specialist | `backend/index.md` | Current endpoint map, service patterns, before writing any new backend code |
| Backend Specialist | `backend/log.md` header lines | Scans for prior decisions that might inform current task |
| DB Specialist | `db/index.md` | Current schema state before writing migrations or queries |
| Frontend Specialist | `frontend/index.md` | Component inventory; checks if a needed component already exists |
| Test Engineer | `test/index.md` | Current coverage map; determines what is already tested before defining new test strategy |
| Security Expert | `security/index.md`, `risk-register.md` | Open risk posture before reviewing new work; assigns risk IDs sequentially |
| Orchestrator | All `*/index.md` files | When a workflow is stuck; needs full system state to diagnose deadlock and recommend recovery |

**Who writes to impl-log and when:**

Writing to impl-log happens at task and story completion, not during planning. The separation is deliberate: planning uses existing knowledge; completion updates that knowledge for the next cycle.

- Each domain specialist writes to `impl-log/[domain]/log.md` when their implementation task is marked complete (via `/dev-3`).
- Each domain specialist updates `impl-log/[domain]/index.md` in-place to reflect the new current state.
- The Architect updates `impl-log/architecture/index.md` when a new pattern is established or a decision is reversed.
- The Security Expert appends to `impl-log/security/risk-register.md` whenever a new Tier 1 or Tier 2 finding is raised, and updates disposition status when a human resolves it.

---

### The Ephemeral Artifact Layer: Stories, Epics, Tasks

Everything between "idea" and "completed impl-log update" lives in ephemeral working directories that are **never committed to version control**.

```
docs/stories/[story-id]/
  story-plan.md          ← master story artifact; all persona reviews appended here
  impl/
    plan.md              ← task list and dependency ordering
    [task-id]/
      task-plan.md       ← per-task specialist breakdown

docs/epics/[epic-id]/
  epic-plan.md           ← cross-story coordination artifact
```

#### `story-plan.md` — The Central Story Artifact

This file is the single source of truth for a story in flight. It accumulates persona reviews in a defined sequence — PM discovery → Architect Review → Dev Lead Review → Security Expert Review — with each persona appending only its own section. No persona modifies another persona's section. The rule is absolute: disagreements go to a Debate Log section, not into overwriting someone else's content.

The file's structure naturally encodes the review sequence:

1. **Discovery Summary** — what the PM learned from the stakeholder interview
2. **User Story + Acceptance Criteria** — PM output
3. **Priority Score + Product Risks** — PM output
4. **Backlog Conflict Assessment** — PM output (informed by impl-log architecture index)
5. **Architect Review** — technical validation, integration concerns, pattern alignment, sequence diagram
6. **Dev Lead Review** — effort signals, feasibility, dependency risks
7. **Security Expert Review** — risk tier table, Tier 1/2/3 findings
8. **Human Dispositions** — explicit named decisions for Tier 2 findings (human-filled)
9. **Status** — Ready / Blocked / Approved

When the story is complete and archived, this file moves to `docs/impl-log/stories/[id]/` and the working directory is deleted.

#### `impl/plan.md` — The Task List

Created during `/dev-1`, this file is the Architect and Dev Lead's output: an ordered list of implementation tasks with their dependencies, interface contracts, and specialist assignments. It is what the developer reviews before approving execution. It answers: "What will be built, in what order, and who owns what?"

Example structure:

```
Task T1: Schema migration — DB Specialist
Task T2: API handler — Backend Specialist (depends on T1)
Task T3: Frontend integration — Frontend Specialist (depends on T2)
Task T4: Test coverage — Test Engineer (depends on T3)
Security review checkpoint — Security Expert (after T4)
```

The task list is not a backlog and not a Jira board. It is a sequencing contract for a single story's implementation, scoped to one conversation lifetime.

#### `impl/[task-id]/task-plan.md` — The Per-Task Specialist Contract

Each task gets its own `task-plan.md`, written by the assigned specialists in sequence. This is where implementation specifics live — not at the story level, but at the task level. A task-plan for a backend task contains:

- **Architect section**: interface requirements, pattern constraints, links to relevant architecture decisions
- **Backend Specialist section**: handler structure, endpoint signature, error cases, service call sequence
- **Test Engineer section**: unit test cases, integration test setup, Given/When/Then acceptance verification
- **Security Expert section**: per-task risk review with tier assignments

The rule about large artifacts (>50 lines) being extracted and linked from the task-plan keeps the task-plan itself scannable. A persona reading the task-plan to begin implementation does not want to wade through 200 lines of scaffolding code — it wants the contract, with details linked.

---

### The Story Lifecycle and Who Reads What, When

#### Phase 1: `/plan-1` — Story Inception

**PM skill activates.** Reads `vision.md` and `impl-log/architecture/index.md`. Runs a 4–8 exchange discovery interview with the human. Produces `story-plan.md` PM sections. Auto-chains to Architect.

**Architect skill activates.** Reads `architecture.md`, `vision.md`, all domain design-principle files, all `impl-log/*/index.md`, scans `architecture/log.md` headers. Appends Architect Review. Auto-chains to Dev Lead.

**Dev Lead skill activates.** Reads `architecture.md`, `backend.md`, `impl-log/architecture/index.md` and `log.md`, and the Architect Review already in `story-plan.md`. Appends Dev Lead Review. Auto-chains to Security Expert.

**Security Expert skill activates.** Reads `security.md`, `impl-log/security/index.md`, `risk-register.md`, and the full `story-plan.md` including all prior reviews. Appends Security Expert Review with risk tier table. **Pauses for human** if any Tier 1 or Tier 2 finding exists.

**Human gate:** Reviews story-plan. Fills Tier 2 Disposition fields. Approves or sends back.

#### Phase 2: `/dev-1` — Implementation Planning

**Architect + Dev Lead activate in sequence.** Read the approved `story-plan.md` and all `impl-log/*/index.md`. Produce `impl/plan.md` (task list) and stub `task-plan.md` files.

**Domain specialists activate in dependency order** (DB → Backend → Frontend → Test → Security). Each reads its own design-principle file, its own `impl-log/[domain]/index.md`, the `task-plan.md` stubs, and previously completed specialist sections. (The Test Engineer, for example, reads all specialist sections before writing — it cannot define test coverage without knowing what was implemented.)

Each specialist appends its section to the relevant `task-plan.md`.

**Human gate:** Reviews `impl/plan.md` and all `task-plan.md` files. Approves plan or requests debate.

#### Phase 3: `/dev-2` — Implementation Execution

**Domain specialists implement against their `task-plan.md` as the contract.** The task-plan is the only context loaded for execution — the specialist does not re-read the full story-plan or all design principles. It reads its task-plan (which already contains the distilled constraints from prior phases) and implements.

This is the most important isolation point: **the task-plan is a pre-digested context capsule.** All relevant principles, interface contracts, and constraints were extracted and placed into the task-plan during planning. The implementing specialist does not need to re-derive anything from first principles.

**Human gate per task** (if running one at a time): Reviews implementation, runs `/dev-3 [id] [task]` to close the task.

#### Phase 4: `/dev-3` — Task Completion and Memory Update

**Domain specialist writes to impl-log.** Reads its `task-plan.md` (to know what was built) and its `impl-log/[domain]/index.md` (to update in-place). Appends to `impl-log/[domain]/log.md`. Updates the index to reflect new current state.

**Story completion:** Story-plan is archived to `impl-log/stories/[id]/`. The working `docs/stories/[id]/` directory is deleted. The impl-log indexes now carry all lasting knowledge; the ephemeral files are gone.

---

### Epics: Coordinating Across Stories

The epic workflow (`/epic-1`, `/epic-2`, `/epic-3`) adds a coordination layer above stories. An epic is a collection of stories with shared dependencies and sequencing.

`docs/epics/[id]/epic-plan.md` contains:

- The scope of the epic and which stories it encompasses
- Cross-story dependency ordering
- Shared architecture decisions that apply to all child stories
- Branching strategy (epics get a single `epic/[id]` branch; no per-story sub-branches)

The Architect is the primary author of the epic-plan. It reads all relevant `impl-log/*/index.md` files, `architecture.md`, `vision.md`, and individual story-plans for all stories in the epic.

The epic-plan exists to prevent individual stories from making locally rational decisions that collectively break the system. On epic completion, it is archived alongside its stories.

---

### Progressive Disclosure: How Context Is Rationed

The system enforces three levels of progressive disclosure for each persona activation:

**Level 1 — Frontmatter metadata** (always available): The `description` field in each `SKILL.md` is what Cursor reads to route work to the right persona. It tells the system *when* to use this skill, not *what* the skill knows.

**Level 2 — Skill file** (loaded on activation): When a persona is activated, its `SKILL.md` is loaded. This file contains role boundaries, instructions, output contract, and anti-patterns — the procedural knowledge. It does not contain domain facts (what endpoints exist, what schema looks like). It contains process knowledge (how to structure a handler, in what sequence to load context, what to output).

**Level 3 — Referenced documents** (loaded selectively per task): The `SKILL.md` instructs the persona to read specific files. It names exactly what to read: `backend.md` for principles, `impl-log/backend/index.md` for current state, scan `impl-log/backend/log.md` headers for history. Nothing else. The persona does not load the full codebase, all design-principle files, or the full story history.

This three-level structure means a persona begins with essentially zero context (just its procedural skill), then loads only what it needs for this specific task, in the order its skill file specifies.

---

### Persona Isolation: How Specialization Prevents Hallucination

Hallucination in coding AI systems typically occurs in one of three ways:

1. **The AI invents facts it should not know** — because it has no grounded reference
2. **The AI confidently applies patterns from one domain to another** — because it has no role boundary
3. **The AI produces inconsistent decisions across sessions** — because it has no persistent memory of prior decisions

The framework addresses all three:

**Problem 1 (invented facts)** is countered by the impl-log. Before a specialist can say anything about the current system state, it must read `impl-log/[domain]/index.md`. The index is the ground truth. The persona is not asked to remember what exists — it is required to read the authoritative current-state file before taking any action.

**Problem 2 (domain bleed)** is countered by role boundaries. Every `SKILL.md` has an explicit "Does NOT" list. The backend specialist does not write schema migrations. The DB specialist does not opine on component design. The PM does not prescribe implementation. When a persona notices a problem outside its domain, the skill instructs it to surface the concern in the appropriate section and assign it to the correct specialist — not to fix it unilaterally. This keeps each persona's reasoning within a domain it has the context to reason about correctly.

**Problem 3 (cross-session inconsistency)** is countered by the impl-log index. The index is updated in-place at task completion and is the source of truth for subsequent sessions. When a new story starts three sprints later, the backend specialist reads the same `backend/index.md`, which has been maintained throughout. It does not have to reconstruct system history from training data or from reading git history. The index tells it what is true now.

---

### The MCP Domain Skills Layer

For platform-specific domain knowledge (Adobe App Builder, Workfront APIs, I/O Runtime, etc.), the system adds a fourth context layer: **on-demand MCP skill loading**.

When a backend or frontend specialist needs Adobe platform knowledge, its `SKILL.md` instructs it to call `list_skills` on the `adobe-extensibility-mcp` server, then `load_skill` for the applicable domain. This surfaces deep platform API contracts, authentication patterns, and best practices on demand — without embedding that knowledge statically in the skill file or design principles.

This keeps `SKILL.md` files and `design-principles/` platform-agnostic and reusable across projects, while giving specialist personas access to the exact platform depth they need when they need it.

---

### The Rules Layer: Enforcement Across All Personas

The `multi-persona-workflow.mdc` Cursor rule file acts as the final enforcement layer. Unlike skills (loaded selectively) and commands (which encode process), rules are unconditional — they apply to every AI interaction regardless of which persona is active.

The seven non-negotiable rules prevent the most dangerous failure modes:

1. **No persona modifies another persona's section** — prevents one persona from rationalizing away another's concerns
2. **`docs/stories/` files are never committed** — prevents ephemeral planning artifacts from polluting version control history
3. **Index files updated in-place, never appended** — maintains the current-state guarantee that all index-reading depends on
4. **Design principles are non-negotiable** — prevents any persona from arguing around the constitution
5. **Tier 1 security blocks all progression** — makes the security gate hard, not advisory
6. **Tier 2 requires named human disposition** — prevents silent risk acceptance
7. **Large artifacts (>50 lines) extracted to linked files** — keeps task-plans scannable for implementation

---

### Why This Architecture Minimizes Hallucination

The system's anti-hallucination properties emerge from its structure, not from prompting. Each property maps directly to an architectural decision:

| Failure Mode | Architectural Counter |
|---|---|
| AI invents system state | Every persona reads the impl-log index before acting |
| AI applies wrong domain patterns | Role boundaries + scoped design-principle files |
| AI contradicts prior decisions | Constitution is law; no persona can override it |
| AI "forgets" between sessions | Impl-log index is permanent and maintained in-place |
| AI gold-plates or over-engineers | `vision.md` non-goals + "simplicity first" behavioral guideline |
| AI silently accepts security risk | Tier 1/2 system with hard gates |
| AI produces inconsistent cross-persona output | Append-only sections; no persona edits another's content |
| Context window overflow | Ephemeral stories, scoped indexes, progressive disclosure |

The most important property is that the system's benefits compound over time. As the impl-log grows, each domain index becomes a richer snapshot of system truth. New stories start with more grounded context than earlier ones. The AI personas become more accurate and more consistent as the project matures — not less, as is typical in ad-hoc AI-assisted development where context drift accumulates across sessions.
