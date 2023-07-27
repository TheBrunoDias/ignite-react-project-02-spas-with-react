import { useFormContext } from 'react-hook-form'
import { useCycle } from '../../../../contexts/CyclesContext'
import { FormContainer, MinutesAmountInput, TaskInput } from './style'

export function NewCycleForm() {
  const { activeCycle } = useCycle()
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>

      <TaskInput
        type="text"
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register('task')}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Projeto 4" />
        <option value="Projeto 5" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>

      <MinutesAmountInput
        placeholder="00"
        type="number"
        id="minutesAmount"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
