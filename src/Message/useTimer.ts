import { useEffect, useRef } from 'react'

export interface TimerProps {
  id: number
  duration?: number
  remove: (id: number) => void
}
function useTimer(props: TimerProps) {
  const { id, duration = 2000, remove } = props

  const timer = useRef<number | null>(null)
  const startTimer = () => {
    timer.current = window.setTimeout(() => {
      remove(id)
      stopTimer()
    }, duration)
  }

  const stopTimer = () => {
    clearTimeout(timer.current as number)
    timer.current = null
  }

  useEffect(() => {
    startTimer()
    return () => stopTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onMouseEnter = () => {
    stopTimer()
  }
  const onMouseLeave = () => {
    startTimer()
  }

  return {
    onMouseEnter,
    onMouseLeave,
  }
}

export default useTimer
