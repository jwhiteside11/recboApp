# syntax=docker/dockerfile:1

FROM golang:latest as builder

WORKDIR /src

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN GOOS=linux GARCH=amd64 CGO_ENABLED=0 go build -o forwardproxy

### App
FROM alpine:latest
WORKDIR /app
# Copy the binary to the production image from the builder stage.
COPY --from=builder /src/forwardproxy /app/

EXPOSE 8800

CMD [ "/app/forwardproxy" ]