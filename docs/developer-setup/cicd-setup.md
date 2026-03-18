# CI/CD Setup — adobe-extensibility-mcp

CI/CD runs on **GitHub Actions**. The pipeline is defined in `.github/workflows/`.

## Workflows

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `pr_test.yml` | Pull requests | See two-track logic below |
| `deploy_stage.yml` | Push to `stage` | Auth → Build → Deploy → E2E tests |
| `deploy_prod.yml` | Push to `main` | Auth → Build → Deploy → E2E tests |

### PR workflow — two-track logic

| PR target branch | Jobs run |
|-----------------|----------|
| `stage` | Unit tests (auto-committed report) + validate that `test-results/e2e-report.md` is committed |
| `main` | Live E2E tests run against the stage endpoint as a prod gate |

Before opening a PR to `stage`, you must run e2e tests against your deployed environment and commit the results:

```bash
E2E_URL=<your-action-url> npm run test:e2e:report
git add test-results/e2e-report.md
git commit -m "test: update e2e test results"
```

## Credentials

Deployments use **OAuth STS** authentication via `adobe/aio-apps-action`. All secrets are stored as GitHub Actions secrets with `_STAGE` / `_PROD` suffixes.

### Stage secrets

| Secret | Description |
|--------|-------------|
| `CLIENTID_STAGE` | OAuth client ID |
| `CLIENTSECRET_STAGE` | OAuth client secret |
| `TECHNICALACCID_STAGE` | Technical account ID |
| `TECHNICALACCEMAIL_STAGE` | Technical account email |
| `IMSORGID_STAGE` | IMS org ID |
| `SCOPES_STAGE` | OAuth scopes |
| `AIO_RUNTIME_NAMESPACE_STAGE` | Runtime namespace |
| `AIO_RUNTIME_AUTH_STAGE` | Runtime auth key |
| `AIO_PROJECT_ID_STAGE` | Project ID |
| `AIO_PROJECT_NAME_STAGE` | Project name |
| `AIO_PROJECT_ORG_ID_STAGE` | Project org ID |
| `AIO_PROJECT_WORKSPACE_ID_STAGE` | Workspace ID |
| `AIO_PROJECT_WORKSPACE_NAME_STAGE` | Workspace name |
| `AIO_PROJECT_WORKSPACE_DETAILS_SERVICES_STAGE` | Workspace services JSON |

### Prod secrets

Same set as above with `_PROD` suffix instead of `_STAGE`.

## Pipeline definition

See `.github/workflows/` for the full configuration.
