package main

import (
	"fmt"

	"github.com/elazarl/goproxy"
	"github.com/gin-gonic/gin"
)

var (
	proxy        = goproxy.NewProxyHttpServer()
	proxyHandler = gin.WrapH(proxy)
)

func useGoproxyGin() {
	router := gin.Default()
	proxy.Verbose = true

	router.NoRoute(proxyHandler)
	fmt.Println("Running...")

	router.Run("0.0.0.0:8800")
}

func main() {
	// runBuiltin()
	// runGin()
	useGoproxyGin()
}
