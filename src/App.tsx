import { Route, Routes } from 'react-router-dom'
import { Header } from '~/components/layout/Header'
import SchedulesPage from '~/pages/SchedulesPage/SchedulesPage'
import StudyProgramsPage from '~/pages/StudyProgramsPage/StudyProgramsPage'
import TeachersPage from '~/pages/TeachersPage/TeachersPage'
import { LoginOverlay } from '~/components/auth/LoginOverlay'

export const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SchedulesPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/study-programs" element={<StudyProgramsPage />} />
      </Routes>
      <LoginOverlay />
    </>
  )
}
