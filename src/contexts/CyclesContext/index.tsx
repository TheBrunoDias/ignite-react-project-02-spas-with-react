import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  addNewCycleAction,
  interruptCycleAction,
  markCurrentCycleasFinishedAction,
} from '../../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../../reducers/cycles/reducer'
import { differenceInSeconds } from 'date-fns'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  onCycleComplete: () => void
  amountSecondsPassed: number
  updateAmountSecondsPassed(amount: number): void
  createNewCycle(data: NewCycleFormData): void
  handleInterruptCycle(): void
}

export const CycleContext = createContext({} as CyclesContextType)

export function CycleContextProvider({ children }: { children: ReactNode }) {
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
      return initialState
    },
  )

  const { activeCycleId, cycles } = cycleState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  function updateAmountSecondsPassed(amount: number) {
    setAmountSecondsPassed(amount)
  }

  function createNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      startDate: new Date(),
      ...data,
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function handleInterruptCycle() {
    dispatch(interruptCycleAction())
    document.title = `Ignite Timer`
  }

  const onCycleComplete = useCallback(() => {
    dispatch(markCurrentCycleasFinishedAction())
    document.title = `Ignite Timer`
    setAmountSecondsPassed(0)
  }, [])

  useEffect(() => {
    const stateJSON = JSON.stringify(cycleState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cycleState])

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        onCycleComplete,
        amountSecondsPassed,
        updateAmountSecondsPassed,
        createNewCycle,
        handleInterruptCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}

export function useCycle() {
  return useContext(CycleContext)
}
