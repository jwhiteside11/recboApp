# syntax=docker/dockerfile:1

FROM golang:latest as builder

WORKDIR /src

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN GOOS=linux GARCH=amd64 CGO_ENABLED=0 go build -o recbo-auth

### App
FROM alpine:latest
WORKDIR /app
# Copy the binary to the production image from the builder stage.
COPY --from=builder /src/recbo-auth /app/
COPY --from=builder /src/verificationTemplate.html /app/
COPY --from=builder /src/public.pem /app/
COPY --from=builder /src/private.pem /app/

EXPOSE 8120

CMD [ "/app/recbo-auth" ]