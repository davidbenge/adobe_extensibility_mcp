# Frontend Log

## [AARCH-73] | React Spectrum TypeScript Fixes | 2026-02

**What**: Fixed 21 TypeScript errors across 7 web components. `npm run type-check` now exits 0.
**Why**: Pre-existing type errors from React Spectrum API mismatches blocked the CircleCI quality gate from passing.
**Key decisions**: Invalid Spectrum background color tokens (`blue-100`, `green-100`, `yellow-100`) replaced with `UNSAFE_style` hex values (visual parity maintained). Clickable `Well` components replaced with `div[role="button"]` (Well doesn't support onClick/tabIndex). `alignItems="flex-start"` → `"start"` (Spectrum uses CSS logical properties). `Badge variant="accent"/"notice"` → valid variants (`"neutral"`, `"yellow"`). Added `src/types/react-cytoscapejs.d.ts` module declaration. `cytoscape.Stylesheet` → `cytoscape.StylesheetStyle`.
**See**: [T1 task details](../stories/AARCH-73/T1/task-plan.md)

Jira: AARCH-73 | Related: AARCH-13 (original component authors)

## [AARCH-13] | Navigation Simplification + Knowledge Browser | 2026-02

**Navigation**: Reduced SideBar from 17 items to 7 (Home, Ask Assistant, Content Browser, Knowledge Browser, Diagram Library, Admin, About). All 22 existing routes preserved in App.tsx for canonical URL contracts. Added `/knowledge-browser` and `/admin` routes.

**Admin Hub**: New `AdminHub.tsx` at `/admin` — card-based dashboard linking to admin sub-pages. Currently links to Knowledge Base (`/admin/knowledge-base`).

**Knowledge Browser**: New component suite (`KnowledgeBrowser/`) using `cytoscape` + `react-cytoscapejs` for interactive graph visualization. Features: graph snapshot loading, node expansion (double-click), search with highlighting, type filtering, and a slide-out node details panel with connection list. Lazy-loaded via `React.lazy` with error boundary.

Dependencies added: `cytoscape`, `react-cytoscapejs`, `@types/cytoscape`.

Jira: AARCH-13 | Related: query-graph action, Neo4j
