#!/bin/bash
docker run -it --rm \
--name certbot \
-v ./certbot/conf/:/etc/letsencrypt/ \
-v ./certbot/www/:/var/www/certbot/ \
certbot/certbot:latest \
certonly \
--webroot --webroot-path /var/www/certbot/ \
-d btlz-api.ru -d www.btlz-api.ru
