import { useRef, useState } from "react"
import "useShakeButton.scss";

const useShakeButton: (btn: JSX.Element) => ({shaker: () => void, wrappedBtn: JSX.Element}) = (btn) => {
  const [shaking, setShaking] = useState<boolean>(false)
  const shakeTimers = useRef<NodeJS.Timeout[]>()

  const shakeButton = () => {

    if (shakeTimers?.current) {
      for (let timer of shakeTimers?.current) {
        clearTimeout(timer)
      }
    }

    if (shaking) {
      setShaking(false)
      const timer1 = setTimeout(() => {
        setShaking(true)
        const timer2 = setTimeout(() => {
          setShaking(false)
        }, 600)
        shakeTimers.current?.push(timer2)
      }, 10)
      shakeTimers.current?.push(timer1)
      return
    }

    setShaking(true)

    const timer = setTimeout(() => {
      setShaking(false)
    }, 600)
    shakeTimers.current?.push(timer)
  }

  

  return {shaker: shakeButton, wrappedBtn: <div className={`shaker-btn ${shaking ? "shake": ""}`}>{btn}</div>};
}

export default useShakeButton;