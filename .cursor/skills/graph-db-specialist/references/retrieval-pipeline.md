# Graph RAG Specialist — Retrieval Pipeline & Knowledge Layer

> Subgraph-to-context serialization, retrieval strategy, embedding, and knowledge layer design. For ontology see [ontology-modeling.md](ontology-modeling.md). For SHACL and Neo4j see [shacl-neo4j.md](shacl-neo4j.md).

---

## Graph RAG Pipeline Design

### Subgraph-to-Context Serialization

Design serialization formats that maximize LLM comprehension while fitting context windows.

**Serialization hierarchy (use the lightest format that works):**

1. **Structured natural language** (best for most queries): Summarize the subgraph in readable prose with entity names, capabilities, integrations, and temporal context.
2. **Typed triple statements** (for precise reasoning): `[Product: AEM] --integratesWith--> [Product: Adobe Assets] (since: 2023-01)`.
3. **JSON-LD snippets** (when downstream needs structured data).
4. **Raw Cypher paths** (only for technical debugging, never for LLM consumption).

### Retrieval Strategy Layers

Design retrieval as a **cascade**:

```
Layer 1: Intent Classification — User question → retrieval pattern type (product-info, comparison, integration, temporal-diff, how-to)
Layer 2: Entity Resolution — Extract entity mentions → resolve to graph node IDs (vector + full-text + alias)
Layer 3: Subgraph Extraction — Execute Cypher template; apply temporal filtering; bound traversal depth (2-3 hops default)
Layer 4: Context Serialization — Serialize subgraph; apply token budget; include provenance metadata
Layer 5: Prompt Assembly — System prompt + retrieved subgraph + user question + graph schema summary
```

### Embedding Strategy for Graph Nodes

- **What to embed**: Node descriptions, capability summaries, integration documentation
- **Chunking**: One embedding per *logical concept*, not per text chunk
- **Graph-aware embeddings**: Consider node2vec or GraphSAGE for structural embeddings
- **Hybrid scoring**: `final_score = α * vector_similarity + β * graph_distance + γ * temporal_recency`

### Context Window Budget Management

| Component | Token Budget (approx) |
|---|---|
| System prompt + instructions | 500-1000 |
| Graph schema summary | 200-400 |
| Retrieved subgraph context | 2000-4000 |
| Conversation history | 1000-2000 |
| User query + response space | remaining |

Summarize distant nodes; detail near nodes. Always include temporal context: "as of [date]" or "valid since [date]".

---

## Knowledge Layer Design Principles

### For LLM Consumption

1. **Self-describing nodes**: Every node should carry enough metadata (name, description, type, status) that an LLM can understand it without external context.
2. **Labeled edges**: Relationship types must be human-readable and unambiguous.
3. **Contextual completeness**: When extracting a product subgraph, include: product properties, capabilities, integrations, lineage, temporal state.
4. **Disambiguation**: Use qualified names when entities could be confused.
5. **Provenance markers**: Every fact traceable to a source (source_doc, last_verified, confidence).

### For Knowledge Completeness

- **Closed-world sections**: Product catalogs and feature matrices — if a capability isn't listed, it doesn't exist.
- **Open-world sections**: Use cases, best practices, integrations — the graph is inherently incomplete.
- **Confidence scoring**: Verified (1.0), Inferred (0.7), Community-reported (0.5), Deprecated/uncertain (0.3).
