# Developer Process — adobe-extensibility-mcp

**Cursor Multi-Persona AI Development Workflow** — Skills · Commands · Rules · Agents · Personas

---

## Links

**GitHub**

- This repo: [adobe-extensibility-mcp](https://github.com/dbenge/adobe_extensibility_mcp)

---

## Table of Contents

1. [Philosophy & Guiding Principles](#1-philosophy--guiding-principles)
2. [The Constitution — Design Principles](#2-the-constitution--design-principles)
3. [Persona Roster & Skill Definitions](#3-persona-roster--skill-definitions)
4. [File System Architecture](#4-file-system-architecture)
5. [Rules — The Non-Negotiables](#5-rules--the-non-negotiables)
6. [Commands — Process Orchestration](#6-commands--process-orchestration)
7. [End-to-End Workflow](#7-end-to-end-workflow)
8. [Human Touch Points Reference](#8-human-touch-points-reference)
9. [Quick Reference](#9-quick-reference)

---

## 1. Philosophy & Guiding Principles

This system treats Cursor as a multi-agent development team, not a code autocomplete tool. Each AI persona is a scoped specialist with defined expertise, bounded context, and a clear role in the workflow. The **human controls the gates**. The **AI does the cognitive and process work** within those gates. This separation is the entire foundation.

### 1.1 Core Tenets

- **Focused context produces better work.** An agent that knows everything about the system reasons poorly about any specific part of it. Each persona loads only what their role requires; deep knowledge in a narrow lane outperforms shallow knowledge across everything.
- **Personas are specialists, not generalists.** An MCP developer does not opine on architecture. A PM does not write action code.
- **The human controls transitions.** Automation runs within phases. Humans approve movement between phases.
- **The filesystem is ephemeral for stories.** Working files under `docs/stories/` are temporary. Only the impl-log and design principles are permanent.
- **The constitution is law.** `docs/design-principles/` files are non-negotiable. No debate resolution, task-plan, or implementation may contradict them.
- **Risk is explicit.** Accepted risks are named, reasoned, and tracked. Silent omission is not acceptance.
- **Memory is indexed.** Specialists understand the system through maintained index files in `docs/impl-log/`, not by searching history.

### 1.2 The Four Primitives

| Primitive | Role |
|-----------|------|
| **Rules** | Unconditional invariants. Always on, always applied. Guardrails only. No process logic. Stored in `.cursor/rules/multi-persona-workflow.mdc`. |
| **Skills** | Persona expertise. One `SKILL.md` per persona in `.cursor/skills/[persona]/`. The agent routes to skills based on description metadata. Skills load only when relevant to the current task, never ambient. |
| **Commands** | Process orchestration. Sequence, handoffs, file lifecycle, debate rounds, completion gates. If the workflow changes, edit a command. If a persona's expertise changes, edit a skill. |
| **Agents** | Isolated execution environments. Separate Composer sessions with different system prompts, tool access, and optionally different models. Used for true role isolation when skills alone are insufficient. |

**Note:** Skills change what the agent *knows*. Agents change *who* is doing the work. Use skills first. Escalate to separate agents only when you need true isolation or a different model configuration.

### 1.3 Human vs. AI Responsibility

**The User (human)** is responsible for:

- Providing the creative seed and business context
- Engaging authentically in the PM discovery interview
- Reading and evaluating persona outputs at each phase gate
- Making risk disposition decisions on Tier 2 security findings
- Resolving deadlocked debates between personas
- Approving impl plans and task plans before execution
- Deliberate sign-off on task and story completion

**The AI personas** are responsible for:

- Researching, analyzing, and drafting within their domain
- Loading and honoring the design principles
- Surfacing conflicts, risks, and concerns
- Maintaining the impl-log and index files
- Chaining automatically between phases when no human decision is needed

### 1.4 What This Looks Like Day to Day

**The Story Planner**

Run `/plan-new-backlog-story "your idea or feature brief"`. The PM skill runs a discovery interview. After the interview, story-plan writing and reviews run automatically. You get a notification when the Architect, Dev Lead, and Security Expert have all weighed in. When everything looks right, run `/plan-story-complete [id]`.

**The Developer**

Run `/dev-start-implementation-plan [story-id]`. That command creates `docs/stories/[id]/impl/plan.md` and, for each task, a `task-plan.md`. When all task-plans are written and security-reviewed, the workflow **pauses for you**.

Review the plan, then run `/dev-start-implementation [story-id]`. That command acts as a **planner**: it reads the impl plan and task dependency order, hands out tasks to new context windows so that independent tasks run in parallel and dependent tasks run when their dependencies are complete. When all tasks are done, the planner informs you that implementation is **done for review**. Run `/dev-completed-implementation [story-id]` to review and finalize.

---

## 2. The Constitution — Design Principles

The design principles directory is the north star of the entire system. Every specialist skill loads its relevant principle file before doing anything else.

**Rule:** No task-plan, debate resolution, command output, or implementation may contradict `docs/design-principles/`. Conflicts escalate to the Architect persona.

### 2.1 File Structure

```
docs/design-principles/
  vision.md          ← project north star, problem being solved, success metrics
  architecture.md    ← system mandates, patterns, boundaries, ADR conventions
  backend.md         ← MCP server philosophy, action structure, error handling
  skills-content.md  ← skill authoring conventions, SKILL.md structure, routing descriptions
  testing.md         ← quality philosophy, coverage expectations, testing pyramid
  security.md        ← non-negotiables, risk tier definitions
```

### 2.2 Risk Tier Definitions (from security.md)

- **Tier 1 — Must Fix:** Blocks all workflow progression. Cannot be ratified or executed until resolved.
- **Tier 2 — Should Address:** Must appear in the impl plan with either a mitigation approach or a formal risk acceptance. Human must explicitly decide.
- **Tier 3 — Noted:** Logged to the security impl-log for posture tracking. No immediate action required.

---

## 3. Persona Roster & Skill Definitions

Each persona lives in `.cursor/skills/[persona]/SKILL.md`. The description field in the SKILL.md frontmatter is written for agent routing: tight, keyword-dense, specific about when this skill should be loaded.

### 3.1 Active Personas

**App Builder MCP Developer** (PRIMARY for this project)

- **Skill file:** `.cursor/skills/app-builder-mcp-developer/SKILL.md`
- **Principles loaded:** `docs/design-principles/backend.md`, `docs/design-principles/architecture.md`
- **Impl-log loaded:** `docs/impl-log/backend/index.md`, `docs/impl-log/backend/log.md`

**Role:** PRIMARY developer persona. Designs, implements, and maintains the skills MCP server on Adobe I/O Runtime. All MCP tool work, skill registry build pipeline, skill content authoring, deployment.

**Product Manager**

- **Skill file:** `.cursor/skills/product-manager/SKILL.md`
- **Principles loaded:** `vision.md`

**Architect**

- **Skill file:** `.cursor/skills/architect/SKILL.md`
- **Principles loaded:** `architecture.md`, `vision.md`

**Dev Lead**

- **Skill file:** `.cursor/skills/dev-lead/SKILL.md`
- **Principles loaded:** `architecture.md`, `backend.md`

**App Builder Actions Developer**

- **Skill file:** `.cursor/skills/app-builder-actions-developer/SKILL.md`
- **Use when:** General App Builder action structure or error handling patterns (not MCP-specific).

**Test Engineer**

- **Skill file:** `.cursor/skills/test-engineer/SKILL.md`
- **Principles loaded:** `testing.md`
- **Impl-log loaded:** `test/index.md`

**Security Expert**

- **Skill file:** `.cursor/skills/security-expert/SKILL.md`
- **Principles loaded:** `security.md`
- **Impl-log loaded:** `security/index.md`, `security/risk-register.md`

**Orchestrator**

- **Skill file:** `.cursor/skills/orchestrator/SKILL.md`
- **Role:** Loaded when the workflow is stuck or a deadlock has occurred. Reads full current artifact, assesses state, recommends next command.

### 3.2 Archived Personas (not applicable to this project)

- `graph-db-specialist` — ARCHIVED (no Neo4j / no database)
- `ims-login` — ARCHIVED (no IMS auth; `skills-mcp` action is public)
- `app-builder-frontend-developer` — ARCHIVED (no frontend)

---

## 4. File System Architecture

### 4.1 Complete Structure

```
actions/
  skills-mcp/
    index.js            ← MCP server entry point
    registry.js         ← catalog loader
    registry.json       ← GENERATED (do not edit)
    skills/             ← skill content (SKILL.md + references/)

scripts/
  generate-registry.js  ← build script

docs/
  design-principles/    ← PERMANENT. The constitution.
    vision.md
    architecture.md
    backend.md
    skills-content.md
    testing.md
    security.md

  stories/              ← EPHEMERAL. Deleted on completion.
    [story-id]/
      story-plan.md
      impl/
        plan.md
        [task-id]/
          task-plan.md

  impl-log/             ← PERMANENT. System memory.
    architecture/
      log.md
      index.md          ← system brain / topology map
    backend/
      log.md
      index.md          ← current service/API surface map
    test/
      log.md
      index.md
    security/
      log.md
      index.md          ← current threat surface map
      risk-register.md
    stories/            ← Archived story artifacts

  developer-setup/
    developer-process.md
    persona-and-command-reference.md
    persona-skill-authoring.md
    cicd-setup.md
    app-builder-application-points.md
    app-builder-frontend-unified-shell.md

.cursor/
  skills/
    product-manager/SKILL.md
    architect/SKILL.md
    dev-lead/SKILL.md
    app-builder-mcp-developer/SKILL.md     ← PRIMARY
    app-builder-actions-developer/SKILL.md
    test-engineer/SKILL.md
    security-expert/SKILL.md
    orchestrator/SKILL.md
    graph-db-specialist/SKILL.md           ← ARCHIVED
    ims-login/SKILL.md                     ← ARCHIVED
    app-builder-frontend-developer/SKILL.md ← ARCHIVED
  commands/
    (16 command files — see .cursor/commands/)
  rules/
    multi-persona-workflow.mdc
    scripts-conventions.mdc
  AGENTS.md             ← Lightweight context map
```

### 4.2 The Ephemeral vs. Permanent Split

Everything in `docs/stories/` is explicitly temporary. When a story completes, the story-plan and task-plans are **archived** to `docs/impl-log/stories/$STORY_ID/`, then the working folder is removed.

The impl-log is permanent and treated like production code. Index files are updated in-place, not appended.

### 4.3 Story-Plan File Structure

```markdown
# Story: [Story Title]

## Discovery Summary
## User Story
## Acceptance Criteria
## Backlog Conflict Assessment
## Architect Review
## Dev Lead Review
## Security Expert Review
### Threat Assessment
| Risk ID | Description | Tier | Recommendation | Disposition |
## Debate Log
## Status
```

### 4.4 Task-Plan File Structure

```markdown
# Task: [Task Title] | Story: [Story ID]

## Task Overview
## Persona(s) responsible
## App Builder MCP Developer (PRIMARY)
## App Builder Actions Developer (if applicable)
## Test Engineer
## Security Expert Review
## Work items (todo list)
## Sign-off
## Status
```

### 4.5 Impl-Log Entry Format

```markdown
## [STORY-ID] | [Story Title] | [Date]
**What**: 1-2 sentence summary of change
**Why**: Problem or motivation
**Key decisions**: Non-obvious choices, trade-offs, alternatives rejected
**Contracts**: API shapes, data contracts, or interfaces other domains depend on
**See**: [task details](../stories/$STORY_ID/$TASK_ID/task-plan.md)
Story: [STORY-ID]
```

---

## 5. Rules — The Non-Negotiables

**Location:** `.cursor/rules/` — workflow: `multi-persona-workflow.mdc`; scripts: `scripts-conventions.mdc`.

1. Never modify another persona's section in a story-plan or task-plan. Personas append their own section only. Disagreements go in Debate Log.
2. `docs/stories/` files are ephemeral. Never commit them to version control.
3. impl-log index files are updated in-place. Never append new entries to index files. `index.md` = current state. `log.md` = history.
4. `docs/design-principles/` is non-negotiable. No debate resolution, task-plan, or implementation may contradict it.
5. A Tier 1 security finding blocks all progression commands until resolved.
6. A Tier 2 security finding requires an explicit human Disposition entry before any progression command executes.
7. Large artifacts (migration scripts, specs over 50 lines) are extracted to separate files and linked from the task-plan section.

---

## 6. Commands — Process Orchestration

Commands live in `.cursor/commands/` as `.md` files. Claude Code equivalents live in `.claude/commands/`. They encode workflow sequence, not domain expertise. Commands call skills. Skills provide the expertise.

### 6.1 Command Index

| Command | Invoked By | Chains To | Purpose |
|---------|------------|-----------|---------|
| `/plan-new-backlog-story "idea"` | User | `/plan-story-review-with-tech-team` (auto) | Kick off PM discovery and story writing |
| `/plan-story-review-with-tech-team [id]` | Auto or User | Security review (auto) | Architect + Dev Lead + Security review story-plan |
| `/plan-resolve-tech-team-story-debate [id]` | User if needed | Self (rounds) → pause | Threaded debate between personas |
| `/plan-story-complete [id]` | User | Archive story artifacts | Ratify story, archive, clean up |
| `/dev-start-implementation-plan [id]` | User | `/dev-start-implementation-task-plan` (auto) | Break story into impl tasks |
| `/dev-review-implementation-plan [id]` | User if needed | Pause for human | Formal debate on impl plan |
| `/dev-start-implementation-task-plan [id] [task]` | Auto or User | Pause for human approval | Specialists write task-plan sections |
| `/dev-start-implementation [id]` | User | Hand out tasks (parallel when Agent tool available); inform for review when done | Planner: run whole story implementation |
| `/dev-start-implementation-task [id] [task]` | User | Pause for human | Execute implementation for one task |
| `/dev-implementation-plan-status [id]` | User | None | Roll-up status of impl plan |
| `/dev-completed-implementation [id]` | User | Review tasks; optional dev-completed-implementation-task; finalize | Story-level implementation review and close-out |
| `/dev-completed-implementation-task [id] [task]` | User | dev-write-impl-log-entry + dev-update-impl-log-index (auto) | Sign off one task, trigger memory update |
| `/dev-write-impl-log-entry [domain] [id]` | Auto | dev-update-impl-log-index (auto) | Specialist writes impl-log entry |
| `/dev-update-impl-log-index [domain]` | Auto | End | Update domain index.md in-place |
| `/review-persona-skills [scope]` | User | None | Quality review of persona skills |

### 6.2 Task list and orchestration (plan and task structure)

**Plan level (impl/plan.md)**

- **Tasks and Dependency Order** — Table of task, description, deps, owner.
- **Dependency, parallelism, and work areas** — Deps, can-run-in-parallel-with, work areas (paths), collision risk.
- **Sequencing summary** — Waves (e.g. Wave 1: T1, T2 in parallel; Wave 2: T3 after T1).

**Task level (impl/Tn/task-plan.md)**

- **Persona(s) responsible** — Primary persona (e.g. MCP Developer, Test, Security).
- **Work items (todo list)** — A checklist of concrete steps. The persona works through the list and marks items complete (`[x]`).
- **Sign-off** — A table: role/persona, sign-off checkbox, notes.

---

## 7. End-to-End Workflow

### 7.1 Story Planning Phase

> **USER ACTION:** Run `/plan-new-backlog-story "rough idea or feature brief"`.

> **AUTO:** PM skill enters discovery interview mode. No files loaded yet.

> **USER ACTION:** Engage the PM interview authentically. Answer questions about the problem, users, success metrics.

> **AUTO:** PM loads vision.md, checks backlog for overlap. Writes story-plan.md. Chains to `/plan-story-review-with-tech-team`.

> **AUTO:** Architect, Dev Lead, Security Expert each write their review sections in sequence. Security evaluates for risk tiers.

> **USER ACTION (if Tier 2 risks):** Fill Disposition fields for each Tier 2 risk.

> **USER ACTION:** When everything looks right, run `/plan-story-complete [id]`.

> **AUTO:** Verifies no open Tier 1 findings, no undisposed Tier 2 findings. Archives story-plan. Cleans up working folder.

### 7.2 Implementation Planning Phase

> **USER ACTION:** Run `/dev-start-implementation-plan [id]`.

> **AUTO:** Architect and Dev Lead create `impl/plan.md`. All specialist skills write task-plan sections. Workflow pauses when all task-plans are complete.

> **USER ACTION:** Review `impl/plan.md` and each `task-plan.md`. Fill in any Tier 2 risk dispositions. Approve or trigger debate if needed.

### 7.3 Task Execution Phase

> **USER ACTION:** Run `/dev-start-implementation [id]`.

> **AUTO:** Planner reads the impl plan, hands out tasks (parallel for independent tasks, sequential for dependent tasks). When all tasks are done, informs user implementation is done for review.

> **USER ACTION:** Monitor as needed. If a specialist hits something that contradicts the task-plan, decide: update the plan or course-correct the agent.

### 7.4 Completion & Memory Phase

> **USER ACTION:** Run `/dev-completed-implementation [id]` to review task status, complete any remaining tasks, review for principles/skill updates, and finalize.

> **USER ACTION:** Run `/plan-story-complete` at impl level. Review architecture/log.md and architecture/index.md before confirming.

> **AUTO:** impl/ folder archived. Filesystem is clean.

---

## 8. Human Touch Points Reference

| Stage | User Action | Why Human — Not Automation |
|-------|-------------|----------------------------|
| Story seed | Run `/plan-new-backlog-story "idea"` | Entry point. Creative and business judgment. |
| PM interview | Engage exchanges | Input only the human has. |
| Tier 2 disposition (story) | Fill Disposition fields | Decision; formal named risk acceptance. |
| Debate trigger | Run `/plan-resolve-tech-team-story-debate [id]` | Judgment; surface and frame the conflict. |
| Deadlock resolution | Read summary, make the call | Judgment; personas genuinely disagree. |
| Story ratification | Run `/plan-story-complete [id]` | Accountability; formal gate before archiving. |
| Impl kickoff | Run `/dev-start-implementation-plan [id]` | Timing — human controls when impl begins. |
| Task-plan approval | Review + fill Tier 2 dispositions | Quality gate before execution begins. |
| Execution monitoring | Monitor, catch deviations | Quality — no silent plan contradictions. |
| Task sign-off | Run `/dev-completed-implementation-task [id] [task]` | Accountability — deliberate completion. |
| Story impl review | Run `/dev-completed-implementation [id]` | Review all tasks, close out, principles review. |
| Story close (impl) | Run `/plan-story-complete` at impl level | Accountability — sanity check system brain. |

---

## 9. Quick Reference

### 9.1 Decision Framework — Where Does This Belong?

| Question | Answer |
|----------|--------|
| Is it unconditional? Always applies regardless of context? | **Rule** (`.cursor/rules/`) |
| Is it domain expertise for a specific role? | **Skill** (`.cursor/skills/[persona]/SKILL.md`) |
| Is it workflow sequence or process logic? | **Command** (`.cursor/commands/`) |
| Is it project context or guiding philosophy? | **design-principles/** |
| Is it current system state for fast context loading? | **impl-log index file** |
| Is it historical narrative for deep research? | **impl-log log file** |

### 9.2 Context Loading by Persona

| Persona | Principle Files | Index Files | Task Files |
|---------|-----------------|-------------|------------|
| Product Manager | `vision.md` | — | story-plan.md (writing) |
| Architect | `architecture.md` + `vision.md` | All domain indexes | story-plan.md, impl/plan.md |
| Dev Lead | `architecture.md` + `backend.md` | architecture/index.md | story-plan.md, impl/plan.md |
| App Builder MCP Developer | `backend.md`, `architecture.md` | backend/index.md | task-plan.md (PRIMARY) |
| App Builder Actions Developer | `backend.md` | backend/index.md | task-plan.md (if action structure involved) |
| Test Engineer | `testing.md` | test/index.md | task-plan.md (reads all first) |
| Security Expert | `security.md` | security/index.md + risk-register | story-plan + task-plan |
| Orchestrator | — | All domain indexes | Full current artifact |

### 9.3 Key Commands Quick Reference

```bash
npm test                           # pretest generates registry, then runs jest
npm run build                      # prebuild generates registry, then webpack
npm run dev                        # aio app run (local dev server)
npm run deploy                     # build + aio app deploy
node scripts/generate-registry.js  # regenerate registry.json manually
```

See [CLAUDE.md](../../CLAUDE.md) at repo root for full command reference.
