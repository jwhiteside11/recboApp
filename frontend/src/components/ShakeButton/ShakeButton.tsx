import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./ShakeButton.scss"

type ShakeButtonProps = {
  btn: JSX.Element,
  btnKey: string
}

const ShakeButton = ({btn, btnKey}: ShakeButtonProps) => {
  const [shaking, setShaking] = useState<boolean>(false)
  const shakeTimers = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {

    const shakeButton = () => {
      if (!shakeTimers?.current) {
        return
      }

      if (shakeTimers.current.length > 1) {
        return
      }
      
      for (let timer of shakeTimers?.current) {
        clearTimeout(timer)
      }

      shakeTimers.current = []
  
      setShaking(false)
      
      const timer1 = setTimeout(() => {
        setShaking(true)
        const timer2 = setTimeout(() => {
          setShaking(false)
          clearTimeout(timer1)
          shakeTimers.current?.shift()
        }, 600)
        shakeTimers.current?.push(timer2)
      }, 0)
      shakeTimers.current?.unshift(timer1)
    }

    document.addEventListener(`shake_${btnKey}`, shakeButton)
    return () => document.removeEventListener(`shake_${btnKey}`, shakeButton)

  }, [btnKey])

  return  (
    <div className={`ShakeButton ${shaking ? "shake": ""}`}>
      { btn }
    </div>
  )
}

export default ShakeButton;