# Graph RAG Specialist — SHACL & Neo4j

> SHACL validation strategy and Neo4j implementation layer. For ontology and RDF/OWL see [ontology-modeling.md](ontology-modeling.md). For retrieval pipeline see [retrieval-pipeline.md](retrieval-pipeline.md).

---

## SHACL Validation Strategy

### Shape Organization

```
data/RDF/shapes/
├── odp-shapes.ttl          # Core ODP pattern shapes
```

### Shape Design Rules

- Every OWL class gets a corresponding `sh:NodeShape`
- Temporal properties (`schema:validFrom`, `schema:validUntil`) validated via custom SPARQL constraints
- Cardinality constraints mirror business rules (a Product MUST have at least one Capability)
- Use `sh:severity` levels: `sh:Violation` for hard constraints, `sh:Warning` for recommendations
- SHACL shapes serve double duty: validation AND documentation of the data model
- Include `sh:description` and `sh:message` on every constraint for human-readable error reporting

### Critical Validation Patterns

Use `adobe:` and `schema:` for Pattern Atlas. Temporal consistency and capability constraints are enforced in `data/RDF/shapes/odp-shapes.ttl`.

```turtle
# Temporal consistency: schema:validFrom must precede schema:validUntil
adobe:TemporalConsistencyShape a sh:NodeShape ;
    sh:targetClass adobe:System ;
    sh:sparql [
        sh:message "schema:validFrom must be before schema:validUntil" ;
        sh:select """
            SELECT $this WHERE {
                $this schema:validFrom ?from .
                $this schema:validUntil ?to .
                FILTER (?from >= ?to)
            }
        """ ;
    ] .

# No orphaned capabilities (every Capability must be linked from at least one System/Product)
adobe:CapabilityShape a sh:NodeShape ;
    sh:targetClass adobe:Capability ;
    sh:property [
        sh:path [ sh:inversePath adobe:hasCapability ] ;
        sh:minCount 1 ;
        sh:message "Every Capability must belong to at least one System/Product" ;
    ] .
```

---

## Neo4j Implementation Layer

### Label Strategy

- One-to-one mapping from OWL classes to Neo4j labels
- Use multi-labels for class hierarchy: `(:Product:SoftwareProduct:CloudService)`
- Reserved labels: `_Deleted`, `_Archived`, `_Draft` for lifecycle state (prefix with underscore)
- Temporal marker labels: `_Current`, `_Historical` for fast filtering

### Relationship Type Naming

- ALL_CAPS_SNAKE_CASE for relationship types
- Verb phrases that read naturally: `(:Product)-[:INTEGRATES_WITH]->(:Product)`
- Temporal relationships carry `since`, `until` properties
- Version-scoped relationships include `min_version`, `max_version`

### Index Strategy

```cypher
// Composite indexes for temporal queries
CREATE INDEX product_temporal FOR (n:Product) ON (n.id, n.valid_from, n.valid_to)

// Full-text index for natural language retrieval
CREATE FULLTEXT INDEX product_search FOR (n:Product) ON EACH [n.name, n.description, n.keywords]

// Vector index for embedding-based similarity (Neo4j 5.x+)
CREATE VECTOR INDEX product_embedding FOR (n:Product) ON (n.embedding)
OPTIONS {indexConfig: {`vector.dimensions`: 1536, `vector.similarity_function`: 'cosine'}}

// Relationship property indexes for temporal traversal
CREATE INDEX integration_temporal FOR ()-[r:INTEGRATES_WITH]-() ON (r.since, r.until)
```

### Query Patterns for RAG Retrieval

```cypher
// Pattern: Contextual subgraph extraction for a product question
MATCH (p:Product {id: $productId})
OPTIONAL MATCH (p)-[:HAS_CAPABILITY]->(cap:Capability)
    WHERE cap.valid_to IS NULL OR cap.valid_to > datetime()
OPTIONAL MATCH (p)-[int:INTEGRATES_WITH]->(other:Product)
    WHERE int.until IS NULL OR int.until > datetime()
OPTIONAL MATCH (p)-[:BELONGS_TO]->(suite:ProductSuite)
RETURN p, collect(DISTINCT cap) AS capabilities,
       collect(DISTINCT {product: other, integration: int}) AS integrations,
       collect(DISTINCT suite) AS suites

// Pattern: Temporal diff — what changed between versions
MATCH (v1:ProductVersion {version: $fromVersion})-[:VERSION_OF]->(p:Product)
MATCH (v2:ProductVersion {version: $toVersion})-[:VERSION_OF]->(p)
OPTIONAL MATCH (v1)-[:HAS_CAPABILITY]->(c1:Capability)
OPTIONAL MATCH (v2)-[:HAS_CAPABILITY]->(c2:Capability)
WITH p, collect(c1) AS before_caps, collect(c2) AS after_caps
RETURN p,
       [c IN after_caps WHERE NOT c IN before_caps] AS added,
       [c IN before_caps WHERE NOT c IN after_caps] AS removed

// Pattern: Multi-hop reasoning path for "how do X and Y connect?"
MATCH path = shortestPath(
    (a:Product {id: $productA})-[*..5]-(b:Product {id: $productB})
)
WHERE ALL(r IN relationships(path)
    WHERE r.until IS NULL OR r.until > datetime())
RETURN path
```
