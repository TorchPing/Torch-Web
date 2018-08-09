FROM alpine:3.8 as builder
ADD . /app
RUN apk --no-cache add nodejs yarn && \
    cd /app && yarn && yarn build

FROM alpine:3.8
RUN apk --no-cache add ca-certificates nginx
COPY --from=builder /app/build /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
WORKDIR /app

CMD nginx -g "daemon off;"
