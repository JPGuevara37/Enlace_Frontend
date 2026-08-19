#!/bin/sh
set -e

# Inyecta la URL del API en runtime (env var API_URL). Si no está definida,
# se conserva el config.json que viene del build.
if [ -n "$API_URL" ]; then
  mkdir -p /usr/share/nginx/html/assets
  cat > /usr/share/nginx/html/assets/config.json <<EOF
{ "apiUrl": "${API_URL}" }
EOF
fi

exec "$@"
