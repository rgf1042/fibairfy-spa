#!/bin/sh
echo "{\"baseUrl\":\"$BASE_URL\"}" > /usr/share/nginx/html/constants.json
nginx -g 'daemon off;'