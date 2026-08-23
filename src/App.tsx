import { Route, Routes } from 'react-router-dom'
import { LoginOverlay } from '~/auth/LoginOverlay'
import { Header } from '~/layout/Header'
import ReportsPage from '~/pages/ReportsPage/ReportsPage'
import SchedulesPage from '~/pages/SchedulesPage/SchedulesPage'
import StudyProgramsPage from '~/pages/StudyProgramsPage/StudyProgramsPage'
import TeachersPage from '~/pages/TeachersPage/TeachersPage'
import { usePageTitle } from '~/hooks/usePageTitle'

export const App = () => {
  usePageTitle()

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SchedulesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/study-programs" element={<StudyProgramsPage />} />
      </Routes>
      <LoginOverlay />
    </>
  )
}
