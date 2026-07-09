import { type FormEvent } from 'react'
import { Loader2, Lock, User } from 'lucide-react'
import { Button } from '~/ui/Button'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'

type LoginFormProps = {
  state: {
    username: string
    password: string
    error: string | null
    isLoading: boolean
  }
  actions: {
    setUsername: (value: string) => void
    setPassword: (value: string) => void
    submit: (event: FormEvent<HTMLFormElement>) => void
  }
}

export const LoginForm = ({ state, actions }: LoginFormProps) => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 id="login-title" className="text-2xl font-bold text-text">
          З поверненням
        </h2>
        <p className="mt-1 text-sm text-text-secondary">Будь ласка, увійдіть, щоб продовжити</p>
      </header>

      <form onSubmit={(event) => void actions.submit(event)} className="flex flex-col gap-5">
        {state.error && <FormErrorMessage message={state.error} />}

        <Input
          label="Логін"
          type="text"
          value={state.username}
          onChange={(event) => actions.setUsername(event.target.value)}
          placeholder="Введіть ваш логін"
          leadingIcon={<User size={18} />}
          clearable={false}
          required
        />

        <Input
          label="Пароль"
          type="password"
          value={state.password}
          onChange={(event) => actions.setPassword(event.target.value)}
          placeholder="••••••••"
          leadingIcon={<Lock size={18} />}
          clearable={false}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="mt-3 w-full h-[45px]"
          disabled={state.isLoading}
        >
          {state.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Увійти'}
        </Button>
      </form>
    </div>
  )
}
