# Project Overview

`schedules.ui` is a frontend React application built with Vite and TypeScript. It is designed to manage educational schedules, study programs, and teachers.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Drag and Drop**: `@dnd-kit` (used for interactive scheduling)
- **Date Handling**: `date-fns`, `react-datepicker`
- **Icons**: `lucide-react`
- **UI Components**: `@floating-ui/react` (for tooltips/popovers)
- **Linting**: ESLint

## Directory Structure
- `src/assets`: Static assets
- `src/auth`: Authentication logic
- `src/config`: Application configurations
- `src/constants`: Constants and enums
- `src/contexts`: React contexts for state management
- `src/hooks`: Custom React hooks
- `src/layout`: Application layout components
- `src/lib`: Third-party library configurations
- `src/mappers`: Data mappers (e.g., DTO to domain model)
- `src/pages`: Main application pages (`SchedulesPage`, `StudyProgramsPage`, `TeachersPage`)
- `src/services`: API service calls
- `src/styles`: Global styles
- `src/types`: TypeScript type definitions
- `src/ui`: Reusable UI components
- `src/utils`: Utility functions

## Backend Integration
The app is configured to proxy API requests under `/api` to `http://localhost:8080`. This implies a local backend server running on port 8080.
