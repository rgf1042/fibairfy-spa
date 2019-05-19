FROM nginx:stable-alpine

ENV BASE_URL http://localhost:1337/api/v1

COPY dist /usr/share/nginx/html
COPY ./entrypoint.sh /

ENTRYPOINT ["sh", "/entrypoint.sh"]