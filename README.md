# Lint base branch

Github Action for check base branch on PR.

## Inputs

## `spec`

**Required** Json definition for allowed base branch for given PR branch.

Example:
```json
{
    "develop": ["/feature\/*/", "/hotfix\/*/"],
    "main": "/(hotfix|release)\/*/"
}
```

## `ignore`

Ignored base branch name list

## Example usage

```yaml
uses: leonardo-ornelas/lint-base-branch-action@main
with:
  spec: >
    {
    "develop": ["feature/.*", "hotfix/.*","release/.*"],
    "main": "(hotfix|release)/.*"
    }
```