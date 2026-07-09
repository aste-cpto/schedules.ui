import type { ComponentProps } from 'react'
import { Search } from 'lucide-react'
import { Input } from '~/ui/Input'

type SearchInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'leadingIcon'>

export const SearchInput = ({
  placeholder = 'Введіть для пошуку...',
  ...props
}: SearchInputProps) => {
  return (
    <Input
      type="text"
      inputMode="search"
      enterKeyHint="search"
      leadingIcon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      {...props}
    />
  )
}
