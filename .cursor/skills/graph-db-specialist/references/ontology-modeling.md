# Graph RAG Specialist — Ontology & RDF/OWL Modeling

> Core design philosophy and RDF/OWL standards. For SHACL and Neo4j see [shacl-neo4j.md](shacl-neo4j.md). For retrieval pipeline see [retrieval-pipeline.md](retrieval-pipeline.md).

---

## Core Design Philosophy

### 1. Ontology-First, Implementation-Second

Every data modeling decision starts in RDF/OWL and flows down to Neo4j. The ontology is the source of truth; the property graph is an optimized materialization.

```
OWL Ontology (meaning & constraints)
    ↓ derivation
SHACL Shapes (validation & cardinality)
    ↓ materialization
Neo4j Schema (labels, rels, indexes)
    ↓ query patterns
Graph RAG Retrieval (subgraph → LLM context)
```

Never design a Neo4j schema without first establishing the ontological commitment it represents. Ask: "What does this node/edge *mean* in the domain?" before "How do I store it?"

### 2. Temporal-Native Design

All entities and relationships exist in time. The knowledge graph is a **4D model** where the temporal dimension is first-class.

**Temporal patterns to apply:**

- **Entity versioning**: Every significant entity has temporal validity intervals (`schema:validFrom`, `schema:validUntil`). The current state is where `schema:validUntil` is null or future.
- **Relationship temporality**: Relationships carry their own temporal bounds, independent of their endpoint entities.
- **Event sourcing at the graph level**: Changes to the graph are themselves events that can be queried.
- **Bitemporal when needed**: Distinguish *valid time* from *transaction time*.

**Temporal implementation patterns:**

```
Pattern 1: Temporal Properties on Relationships
(:Product {id: "aem"})-[:INTEGRATES_WITH {since: date, until: date, version_range: "6.5+"}]->(:Product {id: "assets"})

Pattern 2: Versioned Entity Chains
(:ProductVersion {version: "2024.10", valid_from: date, valid_to: date})-[:VERSION_OF]->(:Product {id: "aem"})

Pattern 3: Temporal Snapshot Nodes (for complex state)
(:ProductState {captured_at: datetime, state_hash: "..."})-[:STATE_OF]->(:Product)
```

Choose the lightest pattern that satisfies query needs.

### 3. Graph Structure Serves Retrieval

Every modeling decision must answer: **"How does this help an LLM understand and reason about our products?"**

**Design for these retrieval patterns:**

| Retrieval Pattern | Graph Structure Required |
|---|---|
| "What does Product X do?" | Product → Capability → Description subgraph |
| "How do X and Y work together?" | Integration paths with temporal validity |
| "What changed in the last release?" | Temporal diff between version states |
| "What's the right product for use case Z?" | Use Case → satisfiedBy → Product paths |
| "What are the dependencies?" | Transitive dependency closure |
| "Who does X?" / "What does persona Y care about?" | Persona → performsActivity, measuresSuccess, memberOf |
| "Which use cases does feature Z support?" | UseCase → implementedByFeature, primaryActor, goal |
| "What sales plays apply to solution S?" | SalesPlay with playType, maturityLevel, value propositions |

### 4. Ontology Design Patterns (ODPs)

Use established ODPs: **Content ODP**, **Participation Pattern**, **Sequence Pattern**, **Collection Pattern**, **Situation Pattern**, **Information Realization**, **Time-Indexed Value**.

---

## RDF/OWL Modeling Standards

### Namespace Management

**Pattern Atlas** uses the `adobe:` vocabulary. Instance IRIs live under `https://architecture.adobe.com/` with versioned resources at `.../v{semver}`.

```turtle
@prefix adobe:  <https://architecture.adobe.com/vocab#> .
@prefix schema: <https://schema.org/> .
@prefix skos:   <http://www.w3.org/2004/02/skos/core#> .
@prefix pav:    <http://purl.org/pav/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix time:   <http://www.w3.org/2006/time#> .
@prefix prov:   <http://www.w3.org/ns/prov#> .
@prefix dcat:   <http://www.w3.org/ns/dcat#> .
```

- **adobe:** — Pattern Atlas OWL vocabulary. Source of truth: `data/RDF/ontology/pattern-atlas.ttl`.
- **pav:** / **dcterms:** — Versioning and lifecycle.
- **schema:** — Validity window (`schema:validFrom`, `schema:validUntil`).

### Pattern Atlas Entity Types

The ontology defines: **System**, **Product**, **Connector**, **Persona**, **PersonaGroup**, **Activity**, **Capability**, **KPI**, **FutureVersion**, **UseCase**, **SalesPlay**, **ProductFeature**, **TemporalEvent**. Ensure every entity type in instance data has a corresponding OWL class and SHACL shape.

### Class Hierarchy Principles

- Prefer **polyhierarchy** over deep single-inheritance
- Use `owl:equivalentClass` for cross-ontology alignment
- Every class: `rdfs:label`, `rdfs:comment`, `skos:definition`
- Use `owl:disjointWith` to prevent modeling errors

### Property Design

- **Object properties** for relationships (verbs or verb phrases); **datatype properties** for literals
- Specify `rdfs:domain` and `rdfs:range` on all properties
- Use `owl:inverseOf` for bidirectional traversal
- Property chains (`owl:propertyChainAxiom`) for derived relationships
- Prefer specific properties: `adobe:integratesWith` not generic `adobe:relatedTo`

### Reification Strategy

For relationships that carry their own properties (temporal bounds, confidence, provenance):

1. **RDF-star** (preferred): `<<:aem adobe:integratesWith :assets>> schema:validFrom "2023-01"^^xsd:date .`
2. **Named graphs** for provenance/temporal contexts
3. **Intermediate nodes** (n-ary relation pattern) when relationships are complex entities
