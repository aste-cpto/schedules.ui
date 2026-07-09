import { useEffect, useState } from 'react'
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { useToast } from '~/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { VALIDATION_REQUIRED_FIELDS } from '~/lib/validationMessages'
import { studyProgramsService } from '~/services/studyProgramsService'
import type { SubjectField } from '../components/SortableSubjectRow'

type StudyProgramFormMode = 'create' | 'edit'

type UseStudyProgramFormOptions = {
  open: boolean
  mode: StudyProgramFormMode
  programId?: number
  onSuccess: () => void
}

const createEmptySubject = (): SubjectField => ({
  id: crypto.randomUUID(),
  name: '',
  hours: 0,
})

export const useStudyProgramForm = ({
  open,
  mode,
  programId,
  onSuccess,
}: UseStudyProgramFormOptions) => {
  const toast = useToast()
  const [programName, setProgramName] = useState('')
  const [subjects, setSubjects] = useState<SubjectField[]>([createEmptySubject()])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const isFormValid =
    programName.trim() !== '' &&
    subjects.every((subject) => subject.name.trim() !== '' && subject.hours > 0)

  useEffect(() => {
    if (isFormValid && validationError) {
      setValidationError(null)
    }
  }, [isFormValid, validationError])

  useEffect(() => {
    if (!open) return

    if (mode === 'create') {
      setProgramName('')
      setSubjects([createEmptySubject()])
      setValidationError(null)
      return
    }

    if (!programId) return

    const loadProgram = async () => {
      setIsLoadingDetails(true)
      setValidationError(null)

      try {
        const data = await studyProgramsService.getById(programId)

        setProgramName(data.name)
        setSubjects(
          [...data.subjects]
            .sort((a, b) => a.order - b.order)
            .map((subject) => ({
              id: crypto.randomUUID(),
              subjectId: subject.id,
              name: subject.name,
              hours: subject.hours,
            })),
        )
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити дані програми'))
      } finally {
        setIsLoadingDetails(false)
      }
    }

    void loadProgram()
  }, [open, mode, programId, toast])

  const addSubject = () => {
    setSubjects((prev) => [...prev, createEmptySubject()])
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects((prev) => prev.filter((subject) => subject.id !== id))
    }
  }

  const updateSubject = (id: string, field: keyof SubjectField, value: string | number) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id
          ? { ...subject, [field]: field === 'hours' ? Number(value) : value }
          : subject,
      ),
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSubjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const submit = async () => {
    if (!isFormValid) {
      setValidationError(VALIDATION_REQUIRED_FIELDS)
      return
    }

    setIsLoading(true)
    setValidationError(null)

    const orderedSubjects = subjects.map((subject, index) => ({
      name: subject.name.trim(),
      hours: subject.hours,
      order: index + 1,
    }))

    try {
      if (mode === 'create') {
        await studyProgramsService.create({
          name: programName.trim(),
          subjects: orderedSubjects,
        })
        toast.success('Програму створено')
      } else if (programId) {
        await studyProgramsService.update(programId, {
          id: programId,
          name: programName.trim(),
          subjects: subjects.map((subject, index) => ({
            id: subject.subjectId ?? 0,
            name: subject.name.trim(),
            hours: subject.hours,
            order: index + 1,
          })),
        })
        toast.success('Програму оновлено')
      }

      onSuccess()
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          mode === 'create' ? 'Не вдалося створити програму' : 'Не вдалося оновити програму',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      programName,
      subjects,
      isLoading,
      isLoadingDetails,
      validationError,
      isFormValid,
      sensors,
      mode,
    },
    actions: { setProgramName, addSubject, removeSubject, updateSubject, handleDragEnd, submit },
  }
}
