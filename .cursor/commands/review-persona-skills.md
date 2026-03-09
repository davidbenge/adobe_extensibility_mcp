# /review-persona-skills

**Invoked by**: Cursor User when running a quality review on persona skills (e.g. before updating or releasing changes to `.cursor/skills/`).  
**Scope**: Can target all skills, a named skill, the **currently open file** (if it's under `.cursor/skills/`), or **only updated/changed skills** (via git).  
**Chains to**: None. Output is a review report; user may then edit skills or re-run.

## Pre-check

- Workspace is `pattern_atlas_publishing` (or the project that contains `.cursor/skills/`).
- At least one persona directory exists under `.cursor/skills/` with a `SKILL.md` file.
- Load and use [docs/developer-setup/persona-skill-authoring.md](../docs/developer-setup/persona-skill-authoring.md) as the authoritative spec for this review.

## Execute

1. **List skills to review**  
   Find every `.cursor/skills/*/SKILL.md`. **Limit the review** using the first of these that applies:
   - **User named a skill** (e.g. "review app-builder-actions-developer") → that skill only.
   - **Open or just-edited file** → If the user has open (or just updated) a file under `.cursor/skills/` (e.g. a specific `SKILL.md` or a file in a skill directory), review only that skill (the directory containing that file).
   - **"Updated" or "changed" skills** → If the user asked to review only updated/changed skills, list modified files under `.cursor/skills/` via git (e.g. `git status`, `git diff --name-only`), map those to skill directories, and review only those skills.
   - **Otherwise** → review all skills.

2. **For each SKILL.md, run the checks below.**  
   Record pass (✅) or fail (❌) with a short reason. Use "⚠️" only for optional suggestions that don't affect the result.  
   **Pass criteria**: A skill **Passes** only if every check in sections 3–6 passes (and section 7 when reviewing all skills). Section 5 (project and industry best practices) is required—fail any item there counts as ❌.

3. **Frontmatter**
   - [ ] **name**: Present, lowercase, hyphenated, and matches the directory name (e.g. `app-builder-actions-developer` in `skills/app-builder-actions-developer/`).
   - [ ] **description**: Non-empty, ≤1024 characters. Third person (e.g. "Use when …"). States WHAT the persona does and WHEN to use it (trigger scenarios). Includes relevant trigger terms (e.g. OpenWhisk, Neo4j, plan-new-backlog-story).
   - [ ] **Anti-pattern**: Description is not first or second person ("I …", "You can use me …").

4. **Required body sections**  
   Section headers must exist (order may vary). Check:
   - [ ] **Principles**: Lists what to load (docs, impl-log) and key constraints; aligns with constitution-first approach.
   - [ ] **Role Boundary**: Contains **Does** and **Does NOT** (or equivalent) so scope is clear.
   - [ ] **When to Use**: Present; 3–5 bullets that reinforce trigger scenarios and align with the frontmatter description (not copy-pasted from another persona).
   - [ ] **Instructions**: Present (not a generic "Process" or "Phases" unless the spec is explicitly updated). Contains step-by-step guidance; numbered steps or clear phases preferred.
   - [ ] **Output Contract**: Present if the persona produces a defined artifact (e.g. "Backend section in task-plan; impl-log/backend entries on completion").

5. **Project and industry best practices** (required for Pass)
   - [ ] **Length**: SKILL.md is under ~500 lines; detail is in design-principles or impl-log, not in the skill body.
   - [ ] **When to Use vs description**: "When to Use" bullets match this persona's role (e.g. no block-library/page-import bullets in an actions-developer skill).
   - [ ] **Terminology**: Uses project terms consistently (e.g. "impl-log", "design-principles", persona names as in AGENTS.md).
   - [ ] **Single role**: No overloading; one persona, one scope. Delegate to other personas where appropriate (e.g. "use app-builder-mcp-developer for MCP").

6. **Anti-patterns (must not be present)**
   - [ ] No vague persona name (e.g. "helper", "utils").
   - [ ] No first/second person in description.
   - [ ] No deep nesting or encyclopedic content in SKILL.md (link out instead).
   - [ ] No inconsistent terminology with design-principles or other skills.

7. **AGENTS.md**
   - [ ] If this is a review of all skills: every persona under `.cursor/skills/` is listed in [.cursor/AGENTS.md](../.cursor/AGENTS.md) (persona list or equivalent). Note any missing.

8. **Produce the report**
   - For each skill: summarize **Pass** / **Fail** and list any ❌ or ⚠️ with the section and reason.
   - End with a short **Summary**: count of skills reviewed, how many passed, and a bullet list of recommended fixes (by skill and check). If all passed, say so and note any optional improvements.

## Example report snippet

```text
## app-builder-actions-developer
- Frontmatter: ✅ name and description OK.
- Principles: ✅
- Role Boundary: ✅
- When to Use: ✅ Aligns with actions/OpenWhisk.
- Instructions: ✅ Numbered steps present.
- Output Contract: ✅
- Length: ✅ ~43 lines.
- AGENTS.md: ✅ Listed.
**Result: Pass.**

## some-other-skill
- When to Use: ❌ Bullets describe blocks/authoring; this is a backend skill. Align with description.
- Instructions: ❌ Section is titled "Process"; rename to "Instructions" and use step-by-step.
**Result: Fail.** Fix When to Use and Instructions.
```

## References

- [Persona skill authoring](../docs/developer-setup/persona-skill-authoring.md) — Required structure, templates, anti-patterns.
- [Persona and command reference](../docs/developer-setup/persona-and-command-reference.md) — Discovery and when-to-use by persona.
- [AGENTS.md](../.cursor/AGENTS.md) — Context map; persona list.
