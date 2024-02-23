FROM postgres:15.1-alpine
COPY ./schema.sql /docker-entrypoint-initdb.d/schema.sql
COPY ./docker/seed_admin.sql /docker-entrypoint-initdb.d/seed-admin.sql
RUN chmod a+r /docker-entrypoint-initdb.d/*