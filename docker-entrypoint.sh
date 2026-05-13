#!/bin/sh
set -e

# Railway uses dynamic PORT — update nginx to listen on it
if [ -n "$PORT" ]; then
  echo "Setting nginx port to: $PORT"
  sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/conf.d/default.conf
fi

echo "Starting Ethara Frontend..."
exec nginx -g 'daemon off;'
