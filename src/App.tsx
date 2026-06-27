import { Route, Routes } from 'react-router-dom'
import { Header } from '~/components/layout/Header'
import HomePage from '~/pages/HomePage/HomePage'
import StudyProgramsPage from '~/pages/StudyProgramsPage/StudyProgramsPage'
import TeachersPage from '~/pages/TeachersPage'

export const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/study-programs" element={<StudyProgramsPage />} />
      </Routes>
    </>
  )
}
