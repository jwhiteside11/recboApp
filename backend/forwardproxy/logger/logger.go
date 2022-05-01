package logger

import "fmt"

func Logln(e ...interface{}) {
	fmt.Println(e...)
}

func Log(e ...interface{}) {
	fmt.Print(e...)
}
