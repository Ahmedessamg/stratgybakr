# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strategy365 is a React-based strategic planning and management application built with TypeScript, Vite, Tailwind CSS, and SCSS. The application focuses on creating and managing organizational strategies, goals, KPIs, and strategic initiatives with full bilingual support (Arabic/English) and RTL layout capabilities.

## Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:5173)
npm run build            # Build for production (runs TypeScript compiler then Vite build)
npm run preview          # Preview production build
npm run lint             # Run ESLint on all files
```

### SVG Icon Management
```bash
npm run svgr             # Convert SVG icons to React components
```
This command processes SVG files from `public/icons/svg` and generates React components in `src/components/icons/svg` with TypeScript, memo, and kebab-case naming.

## Architecture

### Path Aliases
The project uses path aliases for cleaner imports:
- **Alias**: `@/` refers to the `src/` directory
- **Configuration**:
  - Vite: `vite.config.ts` - `resolve.alias` mapping
  - TypeScript: `tsconfig.app.json` - `paths` configuration
- **Usage**: Import modules using `@/` instead of relative paths
  ```typescript
  // Before: import { Button } from '../../../components/ui/Button'
  // After:  import { Button } from '@/components/ui/Button'
  ```

### Internationalization (i18n) System
- **Default language**: Arabic (ar) with RTL support
- **Configuration**: `src/i18n/index.ts`
- **Translation files**: `src/locales/{ar,en}.json`
- **Language persistence**: Stored in localStorage using `STORAGE_KEYS.LANGUAGE`
- **RTL handling**: Document `dir` and `lang` attributes are automatically updated on language change
- **Detection order**: localStorage → browser navigator → HTML tag

The i18n system automatically:
1. Sets document direction (RTL for Arabic, LTR for English)
2. Saves language preference to localStorage
3. Initializes from saved preference or defaults to Arabic

### Routing Architecture
- **Router**: React Router v7 with BrowserRouter
- **Route definitions**: Centralized in `src/constants/routes.ts` as `ROUTES` object
- **Layout structure**: All routes wrapped in `AppLayout` component with nested routes
- **Dynamic routes**: Support for `:id` parameters (e.g., `/strategy/edit/:id`, `/strategy/view/:id`)

Main route categories:
- Strategy management (list, create, edit, view)
- Strategic planning (plans, initiatives, services)
- Performance tracking (KPIs, comparisons/stats)
- Operations (tasks, documents, reports, tickets, mail)

### Layout System
**AppLayout Component** (`src/components/layout/AppLayout.tsx`):
- Fixed header (top)
- Fixed sidebar (left/right based on language direction)
- Main content area with automatic margin adjustment for RTL/LTR
- Integrated breadcrumb navigation with optional header actions
- Main content receives `px-6 py-6` padding

**Directional Layout Logic**:
- Sidebar uses `mr-64` (margin-right) for RTL, `ml-64` (margin-left) for LTR
- Breadcrumb and header actions swap positions based on language direction

### Breadcrumb System
The application uses a centralized breadcrumb context pattern:
- **Context**: `BreadcrumbContext` with `BreadcrumbProvider`
- **Hook**: `useBreadcrumb()` for consuming and setting breadcrumbs
- **Usage in pages**: Call `setBreadcrumb(items, currentPage, headerAction?)` in `useEffect`
- **Display**: Automatically rendered in `AppLayout` when items exist

The breadcrumb context supports:
- Breadcrumb items with labels and URLs
- Current page title
- Optional header action component (e.g., action buttons)

### Form Management
- **Library**: React Hook Form v7
- **Validation**: `@hookform/resolvers` for schema validation
- **Pattern**: Controlled components using `control` prop passed to child components
- **Date handling**: `react-day-picker` for date selection

### Styling System
**Hybrid approach** combining Tailwind CSS and SCSS:

**CSS Custom Properties** (defined in `src/styles/_variables.scss`):
- Theme colors via CSS variables (`--bg`, `--card`, `--text`, `--primary`, etc.)
- Dark theme support via `[data-theme="dark"]` attribute
- Enables runtime theme switching

**Tailwind Configuration**:
- Custom font family: 'Almarai' (Arabic-friendly)
- Content scanning: `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`

**SCSS Variables** (legacy compatibility in `_variables.scss`):
- Color variables (`$primary-color`, `$success-color`, etc.)
- Spacing scale (`$spacing-xs` through `$spacing-2xl`)
- Typography scale (`$text-xs` through `$text-3xl`)
- Border radius scale (`$radius-sm` through `$radius-xl`)
- Breakpoints (`$mobile`, `$tablet`, `$desktop`, `$wide`)

**Component Styling Pattern**:
1. Use Tailwind utilities for layout and common styles
2. Use CSS custom properties (`var(--bg)`, `var(--primary)`) for theme-aware colors
3. Use component-specific SCSS files for complex styling (e.g., `CreateStrategy.scss`)

### Component Organization
Components follow a modular index-based export pattern:

**UI Components** (`src/components/ui/`):
- Atomic UI elements (Button, Card, Input, Modal, etc.)
- Exported via `src/components/ui/index.ts`

**Layout Components** (`src/components/layout/`):
- AppLayout, Header, Sidebar
- Exported via `src/components/layout/index.ts`

**Page-specific Components**:
- Located in `src/pages/{PageName}/components/`
- Complex pages (e.g., CreateStrategy) have multiple card-based sub-components
- Each component group has an `index.ts` for clean imports

**Shared Components for StrategyView** (`src/pages/StrategyView/components/shared/`):
Reusable components used across multiple tabs in the StrategyView page:
- **HeaderItem**: Icon with label and value display
  - Props: `icon`, `label`, `value`
- **CardWithHeader**: Card container with icon header
  - Props: `icon`, `title`, `children`
- **DetailRow**: Label/value pair in grid layout
  - Props: `label`, `children`
- **DataTable**: Generic table for tabular data
  - Props: `columns: { key, label }[]`, `data: Record<string, any>[]`
- **ProgressBar**: Progress indicator with percentage
  - Props: `progress`, `showLabel?`, `showMarker?`
- **GoalItem**: Individual goal with checkbox
  - Props: `id`, `text`, `isRTL?`

All shared components are exported from `src/pages/StrategyView/components/shared/index.ts` for easy importing

### Type System
**Centralized types** (`src/types/index.ts`):
- Common interfaces: `User`, `ApiResponse`, `PaginatedResponse`
- Component prop types: `BaseComponentProps`, `ButtonProps`
- Utility types for routing and form data

**Type-safe constants**:
- Routes use `as const` assertion with derived types (`RouteKey`, `RouteValue`)
- Storage keys use `as const` for type safety

### State Management Patterns
- **Context API**: Used for cross-cutting concerns (BreadcrumbContext)
- **Local state**: React Hook Form for form state
- **localStorage**: Custom `useLocalStorage` hook for persistence

### Mock Data Pattern
Pages use mock data files during development (e.g., `mockStrategies` in `src/pages/StrategyList/mockData.ts`). These should be replaced with API calls when backend integration is implemented.

### Code Quality & Linting
**ESLint Configuration** (`eslint.config.js`):
- Uses TypeScript ESLint with recommended rules
- React Hooks plugin for React-specific linting
- React Refresh plugin for Vite integration
- **Custom rules**:
  - `@typescript-eslint/no-explicit-any: 'off'` - Allows use of `any` type throughout the project

**TypeScript Configuration**:
- Strict mode enabled for type safety
- ESLint integration for code quality checks
- Path aliases configured for cleaner imports

## Development Guidelines

### Using Path Aliases
Always use the `@/` alias for imports instead of relative paths:
```typescript
// ✅ Correct
import { Button } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useBreadcrumb } from '@/hooks'

// ❌ Avoid
import { Button } from '../../../components/ui'
import { ROUTES } from '../../constants'
```

### Using Shared Components
When building features in StrategyView, utilize the shared components:
```typescript
import {
  HeaderItem,
  CardWithHeader,
  DetailRow,
  DataTable,
  ProgressBar,
  GoalItem
} from '@/pages/StrategyView/components/shared'

// Example usage
<CardWithHeader
  icon={<DocumentText width={20} height={20} />}
  title={t('strategy.details.title')}
>
  <DetailRow label={t('strategy.name')}>
    {strategy.name}
  </DetailRow>
</CardWithHeader>
```

If creating reusable components for other pages, follow the same pattern:
1. Create component in `shared/` directory within page components
2. Include TypeScript interfaces for all props
3. Create accompanying `.scss` file using CSS custom properties
4. Export from `shared/index.ts`

### Adding New Pages
1. Create page component in `src/pages/{PageName}/`
2. Add route constant to `src/constants/routes.ts`
3. Add route to `src/App.tsx` within `AppLayout` wrapper
4. Set breadcrumb in page component using `useBreadcrumb()` in `useEffect`
5. Add translations to both `src/locales/en.json` and `src/locales/ar.json`
6. Use `@/` path aliases for all imports

### Working with Forms
1. Use React Hook Form with TypeScript interface for form data
2. Pass `control` to child components for field registration
3. Use `FormField` component wrapper for consistent styling
4. Handle submission with `handleSubmit(onSubmit)`

### RTL/LTR Considerations
- Check `i18n.language === 'ar'` for conditional styling
- Use margin/padding directional utilities (`mr-*` vs `ml-*`)
- Test components in both Arabic and English modes
- Icons and text alignment should adapt to text direction

### SVG Icon Workflow
1. Place SVG files in `public/icons/svg/`
2. Run `npm run svgr` to generate React components
3. Import from `src/components/icons/svg/`
4. Icons are memoized and TypeScript-ready

### API Integration
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Default: `http://localhost:3000/api`
- Use `ApiResponse<T>` and `PaginatedResponse<T>` types for consistent API contracts

### Theme System
The application is prepared for dark mode:
- CSS variables enable runtime theme switching
- Toggle theme by setting `data-theme="dark"` on root element
- All color references should use CSS custom properties, not hardcoded values

## Key Files

### Core Configuration
- `vite.config.ts` - Vite build configuration with path aliases
- `tsconfig.app.json` - TypeScript configuration with path aliases
- `eslint.config.js` - ESLint configuration (allows `any` type)
- `tailwind.config.js` - Tailwind CSS configuration

### Application Structure
- `src/main.tsx` - Application entry point, imports i18n and global styles
- `src/App.tsx` - Main routing configuration
- `src/constants/routes.ts` - Centralized route definitions
- `src/i18n/index.ts` - i18n configuration and language change handlers

### Layout & Contexts
- `src/components/layout/AppLayout.tsx` - Main layout structure
- `src/contexts/BreadcrumbContext.ts` - Breadcrumb context definition

### Styling
- `src/styles/_variables.scss` - Theme variables and CSS custom properties

### Shared Components
- `src/pages/StrategyView/components/shared/` - Reusable components for StrategyView tabs
  - `HeaderItem/`, `CardWithHeader/`, `DetailRow/`, `DataTable/`, `ProgressBar/`, `GoalItem/`
  - `index.ts` - Central export file
