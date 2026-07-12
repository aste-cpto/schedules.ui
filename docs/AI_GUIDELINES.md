# AI Development Guidelines

When modifying or generating code for `schedules.ui`, please adhere to the following guidelines to maintain consistency and quality.

## Code Style and Architecture
1. **TypeScript First**: Ensure all new code is strongly typed. Avoid using `any`; use `unknown` if a type is truly dynamic, or create appropriate interfaces/types in `src/types`.
2. **Imports**:
   - The project uses `~` as an absolute path alias to the `src` directory (configured in `vite.config.ts` and `tsconfig.json`).
   - Example: `import { Something } from '~/components/Something';`
3. **Components**:
   - Use functional components and React hooks.
   - Reusable UI components should be placed in `src/ui`.
   - Page-specific components should be placed within their respective page directories in `src/pages`.
4. **Styling**:
   - Use Tailwind CSS classes for styling.
   - Avoid creating custom CSS files unless necessary. If needed, use SCSS/CSS modules or put global styles in `src/styles`.
5. **Data Fetching and Services**:
   - API calls should be placed in `src/services`.
   - Use `src/mappers` to transform API DTOs into frontend domain models when the data structure differs.
6. **State Management**:
   - Use React Contexts (`src/contexts`) for global state.
   - Use Custom Hooks (`src/hooks`) to encapsulate complex component logic.
7. **Routing**:
   - Configure routes using `react-router-dom`.
8. **Dates**:
   - Always use `date-fns` for date manipulation to maintain consistency across the app.

## Workflow Optimization
- Always check existing components in `src/ui` before creating new ones.
- When creating new pages or large features, create a subdirectory within `src/pages` or `src/ui` and include an `index.ts` to export the public API of that feature.
- Follow ESLint and Prettier formatting rules.
