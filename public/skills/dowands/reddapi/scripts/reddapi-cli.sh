#!/bin/bash
# reddapi CLI - Reddit Data API Command Line Interface

API_KEY="${REDDAPI_API_KEY:-rdi_gr6vzimz1rg12j6xf5x8tm}"
BASE_URL="https://reddapi.dev/api/v1"

usage() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  search <query>     Search Reddit with semantic search"
    echo "  trends             Get trending topics"
    echo "  subreddits [limit]  List subreddits"
    echo ""
    echo "Options:"
    echo "  --limit N          Results limit (default: 50)"
    echo ""
    echo "Examples:"
    echo "  $0 search 'iphone problems' --limit 100"
    echo "  $0 trends"
    echo "  $0 subreddits 20"
}

search() {
    local query=""
    local limit=50
    while [[ $# -gt 0 ]]; do
        case $1 in
            --limit) limit=$2; shift ;;
            *) query="$1" ;;
        esac
        shift
    done
    
    curl -s -X POST "$BASE_URL/search/semantic" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$query\", \"limit\": $limit}"
}

trends() {
    curl -s "$BASE_URL/trends" \
        -H "Authorization: Bearer $API_KEY"
}

subreddits() {
    local limit=${1:-20}
    curl -s "$BASE_URL/subreddits?limit=$limit" \
        -H "Authorization: Bearer $API_KEY"
}

case "$1" in
    search) shift; search "$@" ;;
    trends) trends ;;
    subreddits) shift; subreddits "$@" ;;
    *) usage ;;
esac
