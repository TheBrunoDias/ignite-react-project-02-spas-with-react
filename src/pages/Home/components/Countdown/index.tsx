import { differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'
import { useCycle } from '../../../../contexts/CyclesContext'
import { CountDownContainer, Separator } from './style'

export function Countdown() {
  const {
    activeCycle,
    onCycleComplete,
    amountSecondsPassed,
    updateAmountSecondsPassed,
  } = useCycle()

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutosAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutosAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const diff = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )
        if (diff >= totalSeconds) {
          onCycleComplete()
          clearInterval(interval)
        } else {
          updateAmountSecondsPassed(diff)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, onCycleComplete, updateAmountSecondsPassed])

  useEffect(() => {
    if (activeCycle) {
      document.title = `(${minutes}: ${seconds}) Ignite Timer`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>

      <Separator>:</Separator>

      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
