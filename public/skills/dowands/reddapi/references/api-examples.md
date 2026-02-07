# API Examples

## Search

```bash
# Basic search
curl -X POST "$URL/search/semantic" \
  -H "Authorization: Bearer $KEY" \
  -d '{"query": "best python framework", "limit": 50}'

# Find complaints
curl -X POST "$URL/search/semantic" \
  -H "Authorization: Bearer $KEY" \
  -d '{"query": "TOOL_NAME frustrating issues", "limit": 100}'

# Competitive analysis
curl -X POST "$URL/search/semantic" \
  -H "Authorization: Bearer $KEY" \
  -d '{"query": "A vs B comparison", "limit": 200}'
```

## Trends

```bash
curl "$URL/trends" -H "Authorization: Bearer $KEY"
```

## Subreddits

```bash
# List
curl "$URL/subreddits?limit=100" -H "Authorization: Bearer $KEY"

# Get specific
curl "$URL/subreddits/programming" -H "Authorization: Bearer $KEY"
```
