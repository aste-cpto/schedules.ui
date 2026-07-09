import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import type { ComboboxOption } from '../types'

type UseComboboxOptions = {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  id?: string
  label?: string
}

export const useCombobox = ({ options, value, onChange, id, label }: UseComboboxOptions) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    () => options.find((option) => option.value === value)?.label ?? value,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  const getLabelForValue = useCallback(
    (nextValue: string) => options.find((option) => option.value === nextValue)?.label ?? nextValue,
    [options],
  )

  useEffect(() => {
    setInputValue(getLabelForValue(value))
  }, [value, getLabelForValue])

  useClickOutside(
    containerRef,
    () => {
      setOpen(false)
      setInputValue(getLabelForValue(value))
    },
    open,
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    setOpen(true)
  }

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options

    const selectedLabel = getLabelForValue(value)
    if (inputValue === selectedLabel) return options

    const lowerInput = inputValue.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(lowerInput))
  }, [options, inputValue, value, getLabelForValue])

  const exactMatch = options.find(
    (option) => option.label.toLowerCase() === inputValue.trim().toLowerCase(),
  )

  const displayValue = open ? inputValue : getLabelForValue(value)

  const openDropdown = () => setOpen(true)

  const toggleDropdown = () => {
    setOpen((prev) => {
      if (!prev) {
        setInputValue(value)
      }
      return !prev
    })
  }

  const selectOption = (optionValue: string, optionLabel: string) => {
    onChange(optionValue)
    setInputValue(optionLabel)
    setOpen(false)
  }

  const createOption = (newValue: string) => {
    const trimmed = newValue.trim()
    onChange(trimmed)
    setInputValue(trimmed)
    setOpen(false)
  }

  return {
    open,
    inputValue,
    containerRef,
    selectId,
    filteredOptions,
    exactMatch,
    displayValue,
    actions: {
      handleInputChange,
      openDropdown,
      toggleDropdown,
      selectOption,
      createOption,
    },
  }
}
