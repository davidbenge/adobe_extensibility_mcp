# CI/CD Setup — adobe-extensibility-mcp

CI/CD runs on **GitHub Actions**. The pipeline is defined in `.github/workflows/`.

## Workflows

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `pr_test.yml` | Pull requests | Lint, test (quality gate) |
| `deploy_stage.yml` | Push to `stage` | Build + deploy to stage |
| `deploy_prod.yml` | Push to `main` (or manual) | Build + deploy to production |

## Credentials

App Builder deploy needs Adobe I/O CLI credentials. `.aio` and `.env` are never committed (both in `.gitignore`). Store credentials as GitHub Actions secrets:

- `AIO_FILE_B64` — base64-encoded `.aio` file
- `ENV_FILE_B64` — base64-encoded `.env` file
- Any required `AIO_*` / `AIO_PROJECT_*` vars

Generate encoded values:
```bash
base64 -i .aio | tr -d '\n' | pbcopy   # → AIO_FILE_B64
base64 -i .env | tr -d '\n' | pbcopy   # → ENV_FILE_B64
```

## Pipeline definition

See `.github/workflows/` for the full configuration.
