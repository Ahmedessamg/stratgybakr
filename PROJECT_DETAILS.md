# StrategyPro - Project Documentation

## 📋 Project Overview

**Project Name:** StrategyPro (Strategy365)  
**Description:** A comprehensive strategic planning and management system designed for the Ministry of Transport and Logistic Services. The application provides tools for creating, managing, and tracking strategic plans, initiatives, goals, KPIs, and operational tasks.

**Purpose:** To facilitate strategic planning processes, monitor performance indicators, and provide stakeholders with real-time insights into organizational strategy execution.

---

## 🏗️ Technical Architecture

### **Tech Stack**

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.1.1 |
| **Language** | TypeScript | ~5.9.3 |
| **Build Tool** | Vite | ^7.1.7 |
| **Routing** | React Router DOM | ^7.9.3 |
| **Styling** | Tailwind CSS + SCSS | 3.4.18 + 1.93.2 |
| **State Management** | React Context API | Built-in |
| **Form Management** | React Hook Form | ^7.64.0 |
| **Internationalization** | i18next + react-i18next | ^25.5.3 + ^16.0.0 |
| **Charts** | Chart.js + react-chartjs-2 | ^4.5.0 + ^5.3.0 |
| **Icons** | Lucide React | ^0.545.0 |
| **Date Handling** | date-fns + react-day-picker | ^4.1.0 + ^9.11.0 |
| **Validation** | @hookform/resolvers | ^5.2.2 |

### **Development Tools**

- **ESLint** - Code linting and quality
- **PostCSS + Autoprefixer** - CSS processing
- **@svgr/cli** - SVG to React component conversion
- **SASS** - CSS preprocessing

---

## 📁 Project Structure

```
strategyPro/
├── public/                          # Static assets
│   ├── logo.svg
│   ├── nodata.svg
│   ├── user.svg
│   └── icons/svg/                   # SVG icons for conversion
│       ├── message.svg
│       ├── notification.svg
│       └── search.svg
│
├── src/
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Root component with routing
│   ├── index.css                    # Global Tailwind imports
│   ├── App.css                      # Additional global styles
│   │
│   ├── assets/                      # Static resources
│   │   └── react.svg
│   │
│   ├── components/                  # Reusable components
│   │   ├── index.ts                 # Component exports
│   │   ├── Button/                  # Custom Button component
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── icons/svg/               # React icon components (auto-generated)
│   │   │   ├── message.tsx
│   │   │   ├── notification.tsx
│   │   │   ├── search.tsx
│   │   │   └── index.ts
│   │   ├── LanguageSwitcher/        # Language toggle component
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── index.ts
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.tsx        # Main layout wrapper
│   │   │   ├── Header.tsx           # Top navigation header
│   │   │   ├── Header.scss
│   │   │   ├── Sidebar.tsx          # Sidebar navigation
│   │   │   └── index.ts
│   │   └── ui/                      # UI design system components
│   │       ├── Accordion.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── Breadcrumb.scss
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── CardContent.tsx
│   │       ├── CardContent.scss
│   │       ├── DatePicker.tsx
│   │       ├── EmptyState.tsx
│   │       ├── EmptyState.scss
│   │       ├── FileUpload.tsx
│   │       ├── FormField.tsx
│   │       ├── IconButton.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Modal.scss
│   │       ├── SearchInput.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── Select.tsx
│   │       ├── Tag.tsx
│   │       ├── Textarea.tsx
│   │       └── index.ts
│   │
│   ├── constants/                   # Application constants
│   │   ├── index.ts                 # Central constants export
│   │   └── routes.ts                # Route definitions
│   │
│   ├── contexts/                    # React Context providers
│   │   ├── BreadcrumbContext.ts     # Breadcrumb context definition
│   │   └── BreadcrumbProvider.tsx   # Breadcrumb state provider
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── index.ts
│   │   ├── useBreadcrumb.ts         # Hook for breadcrumb management
│   │   └── useLocalStorage.ts       # Hook for localStorage sync
│   │
│   ├── i18n/                        # Internationalization config
│   │   └── index.ts                 # i18next setup
│   │
│   ├── locales/                     # Translation files
│   │   ├── en.json                  # English translations
│   │   └── ar.json                  # Arabic translations
│   │
│   ├── pages/                       # Application pages/routes
│   │   ├── Home/                    # Dashboard home page
│   │   │   ├── index.tsx
│   │   │   ├── index.scss
│   │   │   └── components/          # Home-specific components
│   │   │       ├── PerformanceChart.tsx
│   │   │       ├── PerformanceChart.scss
│   │   │       ├── StatCard.tsx
│   │   │       ├── StatCard.scss
│   │   │       ├── StrategiesChart.tsx
│   │   │       ├── StrategiesChart.scss
│   │   │       └── index.ts
│   │   ├── CreateStrategy/          # Strategy creation page
│   │   │   ├── index.tsx
│   │   │   ├── CreateStrategy.scss
│   │   │   └── components/          # Strategy creation components
│   │   │       ├── AddOperationalGoalModal.tsx
│   │   │       ├── AddStrategicGoalModal.tsx
│   │   │       ├── GoalItem.tsx
│   │   │       ├── OperationalGoalsCard.tsx
│   │   │       ├── StrategicDetailsCard.tsx
│   │   │       ├── StrategicGoalsCard.tsx
│   │   │       ├── StrategyInfoCard.tsx
│   │   │       ├── AttachmentsCard/
│   │   │       ├── PillarsCard/
│   │   │       ├── ValuesCard/
│   │   │       └── index.ts
│   │   ├── StrategyList.tsx         # List of strategies
│   │   ├── StrategicPlans.tsx
│   │   ├── StrategicInitiatives.tsx
│   │   ├── StrategicServices.tsx
│   │   ├── MainObjectives.tsx       # OKRs management
│   │   ├── KPIs.tsx                 # Key Performance Indicators
│   │   ├── TaskManagement.tsx
│   │   ├── ComparisonsStats.tsx
│   │   ├── Documents.tsx
│   │   ├── Reports.tsx
│   │   ├── Tickets.tsx
│   │   └── Mail.tsx
│   │
│   ├── styles/                      # Global SCSS styles
│   │   ├── _variables.scss          # SCSS/CSS variables
│   │   └── main.scss                # Main stylesheet
│   │
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── utils/                       # Utility functions
│       └── index.ts
│
├── .eslintrc.js                     # ESLint configuration
├── eslint.config.js
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                   # Vite build configuration
└── README.md                        # Project documentation
```

---

## 🎯 Core Features

### **1. Strategic Planning**
- Create and manage organizational strategies
- Define vision, mission, and strategic pillars
- Set strategic and operational goals
- Track strategy lifecycle (draft, active, completed)

### **2. Goals Management**
- **Strategic Goals**: Long-term objectives aligned with vision
- **Operational Goals**: Short-term actionable objectives
- Goal categorization by duration (1-3 years)
- Goal activation status tracking

### **3. Key Performance Indicators (KPIs)**
- Define and track performance metrics
- Real-time performance monitoring
- Target vs. actual performance visualization

### **4. Strategic Initiatives & Services**
- Manage strategic initiatives
- Track service delivery
- Initiative status monitoring

### **5. Task Management**
- Create and assign tasks
- Track task completion
- Task prioritization and deadlines

### **6. Documents & Attachments**
- File upload functionality
- Support for multiple formats (PDF, DOCX, XLSX, PNG, JPG)
- Document management system

### **7. Reporting & Analytics**
- Performance charts and visualizations
- Comparison and statistics
- Monthly performance tracking
- Strategy status overview

### **8. Multi-language Support**
- Arabic (RTL) and English (LTR) support
- Dynamic language switching
- Persistent language preference

---

## 🧩 Key Components & Patterns

### **Layout System**

#### **AppLayout Component**
- Wraps all pages with consistent layout
- Includes Header, Sidebar, and Breadcrumb
- Handles RTL/LTR layout switching
- Provides page content wrapper

```tsx
<AppLayout>
  ├── Header (fixed top)
  ├── Sidebar (fixed left/right based on RTL)
  └── Main Content Area
      ├── Breadcrumb (conditional)
      └── Page Content
</AppLayout>
```

#### **Sidebar Navigation**
- Fixed position sidebar
- Active route highlighting
- Icon + label navigation items
- RTL-aware positioning
- 14 main navigation routes

#### **Header Component**
- Fixed top navigation bar
- Logo and ministry branding
- User profile section
- Notification and message icons
- Language switcher integration

### **Breadcrumb System**

**Context-based Implementation:**
- `BreadcrumbContext` - Provides breadcrumb state
- `BreadcrumbProvider` - Wraps application with context
- `useBreadcrumb` hook - Easy access to breadcrumb state

**Features:**
- Dynamic breadcrumb trails
- Home icon navigation
- Current page highlighting
- Optional header actions (buttons, etc.)

**Usage Pattern:**
```tsx
const { setBreadcrumb } = useBreadcrumb();

useEffect(() => {
  setBreadcrumb(
    [
      { label: <HomeIcon />, url: ROUTES.HOME },
      { label: t('nav.strategy'), url: ROUTES.STRATEGY },
    ],
    t('strategy.addNew'),
    <Button>Action</Button> // Optional header action
  );
}, []);
```

### **UI Component Library**

**Design System Components (`src/components/ui/`):**

| Component | Purpose |
|-----------|---------|
| `Button` | Primary action buttons with variants (primary, secondary, ghost, link) |
| `IconButton` | Icon-only buttons for compact actions |
| `Input` | Text input fields |
| `Textarea` | Multi-line text input |
| `Select` | Dropdown selection |
| `SearchInput` | Search input with icon |
| `DatePicker` | Date selection using react-day-picker |
| `Card` | Content container with consistent styling |
| `CardContent` | Card body with padding |
| `SectionHeader` | Section title with optional actions |
| `EmptyState` | No data placeholder with icon |
| `Tag` | Colored label/badge |
| `Modal` | Overlay dialog with backdrop |
| `FormField` | Form input wrapper with label/error |
| `FileUpload` | Drag-and-drop file upload |
| `Breadcrumb` | Navigation breadcrumb trail |
| `Accordion` | Expandable content sections |

**Component Characteristics:**
- TypeScript typed props
- Responsive design
- RTL support
- SCSS + Tailwind hybrid styling
- Accessible markup
- Loading states where applicable

### **Form Management**

**React Hook Form Integration:**
- `useForm` hook for form state
- `control` prop for controlled inputs
- Form validation with `@hookform/resolvers`
- Structured form data types

**Example:**
```tsx
interface StrategyFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const { control, handleSubmit } = useForm<StrategyFormData>();
```

### **Custom Hooks**

#### **useLocalStorage**
- Syncs state with localStorage
- Type-safe implementation
- Automatic serialization/deserialization
- Error handling

```tsx
const [theme, setTheme] = useLocalStorage<string>('theme', 'light');
```

#### **useBreadcrumb**
- Access breadcrumb context
- Set breadcrumb trail
- Set current page title
- Set header actions

---

## 🎨 Styling Architecture

### **Hybrid Approach: Tailwind + SCSS**

**Tailwind CSS:**
- Utility-first styling
- Responsive classes
- JIT (Just-In-Time) compilation
- Custom font family (Almarai for Arabic)

**SCSS:**
- Component-specific styles
- CSS variables for theming
- Mixins and functions (if needed)
- Complex animations and transitions

### **CSS Variables System**

**Light Theme:**
```css
--bg: #ffffff
--card: #ffffff
--text: #1e293b
--muted: #64748b
--primary: #16a34a
--border: #e2e8f0
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
```

**Dark Theme Support:**
```css
[data-theme="dark"] {
  --bg: #0f172a
  --card: #1e293b
  --text: #f1f5f9
  /* ... */
}
```

### **SCSS Variables**

**Colors:**
```scss
$primary-color: #16a34a
$secondary-color: #64748b
$success-color: #10b981
$warning-color: #f59e0b
$error-color: #ef4444
```

**Spacing:**
```scss
$spacing-xs: 0.25rem
$spacing-sm: 0.5rem
$spacing-md: 1rem
$spacing-lg: 1.5rem
$spacing-xl: 2rem
$spacing-2xl: 3rem
```

**Typography:**
```scss
$text-xs: 0.75rem
$text-sm: 0.875rem
$text-base: 1rem
$text-lg: 1.125rem
$text-xl: 1.25rem
$text-2xl: 1.5rem
$text-3xl: 1.875rem
```

**Border Radius:**
```scss
$radius-sm: 0.25rem
$radius-md: 0.375rem
$radius-lg: 0.5rem
$radius-xl: 0.75rem
```

**Breakpoints:**
```scss
$mobile: 640px
$tablet: 768px
$desktop: 1024px
$wide: 1280px
```

### **Styling Guidelines**

1. **Use variables for colors** - Never hardcode color values
2. **Use spacing variables** - Consistent spacing across components
3. **Component-specific SCSS files** - Keep styles modular
4. **Tailwind for utility classes** - Quick styling for common patterns
5. **SCSS for complex styles** - Animations, complex layouts

---

## 🌐 Internationalization (i18n)

### **Configuration**

**Supported Languages:**
- **Arabic (ar)** - Default, RTL
- **English (en)** - LTR

**Libraries:**
- `i18next` - Core i18n framework
- `react-i18next` - React bindings
- `i18next-browser-languagedetector` - Auto language detection

**Storage:**
- Language preference saved to localStorage
- Key: `STORAGE_KEYS.LANGUAGE`

### **i18n Setup (`src/i18n/index.ts`)**

```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, ar },
    fallbackLng: 'ar',
    lng: savedLanguage,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });
```

**Features:**
- Automatic HTML `dir` attribute update (rtl/ltr)
- Automatic HTML `lang` attribute update
- Language change listener
- LocalStorage persistence

### **Translation Files Structure**

**Categories:**
```json
{
  "app": {},           // Application branding
  "nav": {},           // Navigation labels
  "strategy": {},      // Strategy-related translations
  "common": {},        // Common actions (save, cancel, etc.)
  "validation": {},    // Form validation messages
  "messages": {},      // Success/error messages
  "language": {},      // Language switcher
  "home": {}          // Home page content
}
```

### **Usage in Components**

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return <h1>{t('nav.home')}</h1>;
};
```

### **RTL Support**

**Automatic Direction Handling:**
- HTML `dir="rtl"` or `dir="ltr"`
- Flexbox `flex-row-reverse` for RTL
- Margin/padding adjustments (`mr-` vs `ml-`)
- Text alignment (`text-right` vs `text-left`)

**Layout Adjustments:**
```tsx
<div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
```

---

## 🗺️ Routing Structure

### **Route Configuration (`src/constants/routes.ts`)**

```typescript
export const ROUTES = {
  HOME: '/',
  STRATEGY: '/strategy',
  STRATEGY_NEW: '/strategy/new',
  STRATEGIC_PLANS: '/strategic-plans',
  STRATEGIC_INITIATIVES: '/strategic-initiatives',
  STRATEGIC_SERVICES: '/strategic-services',
  MAIN_OBJECTIVES: '/main-objectives',
  KPIS: '/kpis',
  TASK_MANAGEMENT: '/task-management',
  COMPARISONS_STATS: '/comparisons-stats',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  TICKETS: '/tickets',
  MAIL: '/mail',
} as const;
```

### **Route Mapping**

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home` | Dashboard with stats and charts |
| `/strategy` | `StrategyList` | List all strategies |
| `/strategy/new` | `CreateStrategy` | Create new strategy |
| `/strategic-plans` | `StrategicPlans` | Manage strategic plans |
| `/strategic-initiatives` | `StrategicInitiatives` | Track initiatives |
| `/strategic-services` | `StrategicServices` | Service management |
| `/main-objectives` | `MainObjectives` | OKRs management |
| `/kpis` | `KPIs` | KPI tracking |
| `/task-management` | `TaskManagement` | Task management |
| `/comparisons-stats` | `ComparisonsStats` | Analytics and comparisons |
| `/documents` | `Documents` | Document library |
| `/reports` | `Reports` | Report generation |
| `/tickets` | `Tickets` | Support tickets |
| `/mail` | `Mail` | Internal messaging |

### **Route Types**

```typescript
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
```

---

## 📊 Data Flow & State Management

### **State Management Approach**

**React Context API:**
- Lightweight state management
- No external state library
- Context for global state (breadcrumb, theme, etc.)
- Component state for local state

**Patterns:**
1. **Context + Provider** - Global state
2. **useState** - Local component state
3. **useForm** - Form state
4. **useLocalStorage** - Persisted state

### **Breadcrumb State Flow**

```
BreadcrumbProvider (Context)
    ↓
useBreadcrumb (Hook)
    ↓
Page Components (Set breadcrumb)
    ↓
AppLayout (Consume breadcrumb)
    ↓
Breadcrumb Component (Render)
```

### **Form State Flow**

```
useForm (React Hook Form)
    ↓
control prop
    ↓
Input Components
    ↓
handleSubmit
    ↓
onSubmit function
    ↓
API call / State update
```

---

## 🧱 Component Development Guidelines

### **Coding Standards (from instructions)**

1. **Act as Senior Frontend Engineer** - 10 years experience mindset
2. **Follow project structure** - Maintain consistency in naming and patterns
3. **Clean code** - No spaghetti code
4. **Split logic** - Small components, hooks, and files
5. **Minimal comments** - Code should be self-explanatory
6. **No code repetition** - Use global files and hooks
7. **Follow current structure** - Match existing patterns
8. **Don't edit design system** - Unless explicitly asked
9. **Don't edit page designs** - Unless explicitly asked
10. **Don't break existing code** - Only edit what's necessary
11. **No console logs** - Unless explicitly asked
12. **Use SCSS variables** - For colors, spacing, font sizes, etc.
13. **Analyze before editing** - Understand related files and code
14. **Multi-language support** - Use i18n for all hardcoded text

### **Component Structure Template**

```tsx
// imports
import { useTranslation } from 'react-i18next';
import './ComponentName.scss';

// types
interface ComponentNameProps {
  // props
}

// component
const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  const { t } = useTranslation();
  
  // component logic
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### **File Naming Conventions**

- **Components**: PascalCase (`StrategyCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useBreadcrumb.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase interfaces/types (`UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **SCSS**: kebab-case or match component (`StrategyCard.scss`)

### **Export Pattern**

**Component folders:**
```
ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.scss (if needed)
  └── index.ts         // export { default } from './ComponentName'
```

**Barrel exports:**
```typescript
// components/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';
```

---

## 🔧 Development Workflow

### **Available Scripts**

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run svgr     # Convert SVG icons to React components
```

### **SVG Icon Workflow**

**Process:**
1. Add SVG files to `public/icons/svg/`
2. Run `npm run svgr`
3. React components generated in `src/components/icons/svg/`
4. Import and use: `import { MessageIcon } from '@/components/icons/svg'`

**SVGR Configuration:**
- Output: `src/components/icons/svg`
- Options: `--icon --typescript --memo --filename-case kebab`
- Auto-optimized for React
- TypeScript typed

### **Adding New Pages**

1. **Create page component** in `src/pages/`
2. **Add route** to `src/constants/routes.ts`
3. **Add route** to `App.tsx` routing configuration
4. **Add navigation item** to `Sidebar.tsx` (if needed)
5. **Add translations** to `locales/en.json` and `locales/ar.json`
6. **Set breadcrumb** in page component using `useBreadcrumb`

### **Adding New Translations**

1. Add keys to `src/locales/en.json`
2. Add keys to `src/locales/ar.json`
3. Use in component: `t('category.key')`

### **Creating New Components**

1. **Decide location**:
   - `components/ui/` - Reusable UI elements
   - `components/layout/` - Layout components
   - `pages/[PageName]/components/` - Page-specific components

2. **Create component file** with TypeScript
3. **Create SCSS file** if needed
4. **Create index.ts** for clean exports
5. **Add to parent index.ts** barrel export
6. **Use SCSS variables** for styling
7. **Add i18n** for all text content

---

## 🎯 Page-Specific Details

### **Home Page (`src/pages/Home/`)**

**Features:**
- Welcome message
- Stat cards (Active Strategies, Ongoing Initiatives, Completed Tasks)
- Performance chart (monthly targets vs. actual)
- Strategies status chart (completed, in progress, delayed, pending)

**Components:**
- `StatCard` - Display key metrics with icons
- `PerformanceChart` - Line chart using Chart.js
- `StrategiesChart` - Doughnut/Pie chart using Chart.js

### **Create Strategy Page (`src/pages/CreateStrategy/`)**

**Multi-section Form:**
1. **Strategy Information** - Basic details (name, description, dates)
2. **Strategic Details** - Vision, mission, pillars
3. **Strategic Goals** - Long-term objectives
4. **Operational Goals** - Short-term actionable goals
5. **Values** - Organization values
6. **Pillars** - Strategic pillars/themes
7. **Attachments** - Supporting documents

**Components:**
- `StrategyInfoCard` - Basic information form
- `StrategicDetailsCard` - Vision and mission form
- `StrategicGoalsCard` - Strategic goals management
- `OperationalGoalsCard` - Operational goals management
- `ValuesCard` - Values management
- `PillarsCard` - Pillars management
- `AttachmentsCard` - File upload
- `AddStrategicGoalModal` - Modal for adding strategic goals
- `AddOperationalGoalModal` - Modal for adding operational goals
- `GoalItem` - Display individual goal

**Form Management:**
- React Hook Form for form state
- Validation with resolvers
- Multi-step form pattern

---

## 🔐 Constants & Configuration

### **App Constants (`src/constants/index.ts`)**

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const APP_NAME = 'Strategy365';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
```

### **Environment Variables**

**Expected variables:**
- `VITE_API_BASE_URL` - Backend API endpoint

**Usage:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📦 Type System

### **Common Types (`src/types/index.ts`)**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}
```

---

## 🚀 Build & Deployment

### **Build Configuration**

**Vite Config (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**TypeScript Config:**
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node-specific config

**Build Output:**
- Output directory: `dist/`
- Optimized bundle
- Code splitting
- Tree shaking enabled

### **Production Build**

```bash
npm run build
```

**Output:**
- `dist/index.html`
- `dist/assets/` - JS, CSS, images

### **Preview Production Build**

```bash
npm run preview
```

---

## 🎨 Design Tokens

### **Color Palette**

| Usage | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | `#ffffff` | `#0f172a` |
| Card | `#ffffff` | `#1e293b` |
| Text | `#1e293b` | `#f1f5f9` |
| Muted | `#64748b` | `#94a3b8` |
| Primary | `#16a34a` | `#22c55e` |
| Border | `#e2e8f0` | `#334155` |
| Success | `#10b981` | `#10b981` |
| Warning | `#f59e0b` | `#f59e0b` |
| Danger | `#ef4444` | `#ef4444` |

### **Typography**

**Font Family:**
- Primary: Almarai (Arabic support)
- Fallback: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif

**Font Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)

### **Spacing Scale**

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### **Border Radius**

- sm: 0.25rem (4px)
- md: 0.375rem (6px)
- lg: 0.5rem (8px)
- xl: 0.75rem (12px)

### **Shadows**

- sm: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- md: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- lg: `0 10px 15px -3px rgb(0 0 0 / 0.1)`

---

## 📚 Key Libraries Documentation

### **React Hook Form**
- **Purpose**: Form state management
- **Usage**: Form validation, controlled inputs
- **Docs**: https://react-hook-form.com/

### **React Router DOM v7**
- **Purpose**: Client-side routing
- **Usage**: Navigation, nested routes
- **Docs**: https://reactrouter.com/

### **i18next**
- **Purpose**: Internationalization
- **Usage**: Multi-language support, RTL
- **Docs**: https://www.i18next.com/

### **Chart.js**
- **Purpose**: Data visualization
- **Usage**: Performance charts, statistics
- **Docs**: https://www.chartjs.org/

### **Lucide React**
- **Purpose**: Icon library
- **Usage**: UI icons throughout app
- **Docs**: https://lucide.dev/

### **date-fns**
- **Purpose**: Date manipulation
- **Usage**: Date formatting, calculations
- **Docs**: https://date-fns.org/

### **React Day Picker**
- **Purpose**: Date picker component
- **Usage**: Date selection in forms
- **Docs**: https://react-day-picker.js.org/

---

## 🔍 Project Patterns & Best Practices

### **Component Patterns**

1. **Functional Components** - Always use function components
2. **TypeScript Props** - Define interfaces for all props
3. **React.FC** - Use React.FC type for components
4. **Hooks at Top** - Call hooks at component top level
5. **Early Returns** - Conditional rendering with early returns
6. **Destructuring** - Destructure props and hooks

### **State Management Patterns**

1. **Local State First** - Use useState for component-specific state
2. **Context for Global** - Use Context for cross-component state
3. **Form State** - Use React Hook Form for forms
4. **Persistent State** - Use useLocalStorage for persistence

### **Styling Patterns**

1. **BEM-like Classes** - Use descriptive class names
2. **Tailwind Utilities** - Use for common patterns
3. **SCSS for Complex** - Use for complex styles
4. **CSS Variables** - Use for theming
5. **Responsive Design** - Mobile-first approach

### **Code Organization**

1. **Group by Feature** - Page-specific components in page folders
2. **Barrel Exports** - Use index.ts for clean imports
3. **Single Responsibility** - One component, one purpose
4. **Composition** - Build complex UI from simple components

---

## 🧪 Testing Strategy (Future)

**Recommended Testing Tools:**
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **MSW** - API mocking

**Test Coverage Goals:**
- Util functions: 100%
- Hooks: 90%
- Components: 80%
- Pages: 70%

---

## 📱 Responsive Design

### **Breakpoints**

```scss
$mobile: 640px   // sm
$tablet: 768px   // md
$desktop: 1024px // lg
$wide: 1280px    // xl
```

### **Layout Strategy**

- **Mobile First** - Design for mobile, scale up
- **Flexible Grid** - Use flexbox/grid
- **Responsive Typography** - Scale font sizes
- **Touch Targets** - Min 44x44px for mobile
- **Sidebar** - Hidden on mobile (future: hamburger menu)

---

## 🌟 Future Enhancements

### **Planned Features**
- User authentication & authorization
- Role-based access control (RBAC)
- Real-time notifications
- Advanced reporting (PDF export)
- Data export (Excel, CSV)
- Mobile responsive sidebar (hamburger menu)
- Dark mode toggle
- Advanced search & filters
- Dashboard customization
- Audit logs
- Integration with external systems

### **Technical Improvements**
- Add unit tests
- Add E2E tests
- Implement API layer with Axios
- Add error boundaries
- Add loading skeletons
- Optimize bundle size
- Add PWA support
- Implement service worker for offline
- Add performance monitoring
- Add analytics integration

---

## 🤝 Contributing Guidelines

### **Before Making Changes**

1. **Analyze the code** - Understand existing patterns
2. **Check related files** - See how similar features work
3. **Follow structure** - Match current naming and organization
4. **Review instructions** - Follow the project instructions file

### **When Adding Features**

1. **Don't break existing code** - Only modify what's necessary
2. **Use global files** - Reuse existing components and hooks
3. **Add translations** - Support both English and Arabic
4. **Use SCSS variables** - Don't hardcode colors or spacing
5. **Test RTL** - Ensure Arabic/RTL layout works
6. **No console logs** - Remove debugging logs

### **Code Review Checklist**

- [ ] TypeScript types defined
- [ ] Translation keys added (en.json + ar.json)
- [ ] SCSS variables used for styling
- [ ] Component exported in index.ts
- [ ] RTL layout tested
- [ ] No console.log statements
- [ ] No hardcoded text
- [ ] Follows existing file structure
- [ ] No duplicate code

---

## 📞 Support & Resources

### **Project Resources**
- **Repository**: [GitHub URL if applicable]
- **Documentation**: This file
- **Design System**: See `src/components/ui/`
- **Style Guide**: See `src/styles/_variables.scss`

### **External Resources**
- React Docs: https://react.dev/
- TypeScript Docs: https://www.typescriptlang.org/docs/
- Vite Docs: https://vitejs.dev/
- Tailwind Docs: https://tailwindcss.com/docs
- SASS Docs: https://sass-lang.com/documentation/

---

## 📝 Notes & Reminders

### **Important Conventions**

- **Language**: Default is Arabic (RTL)
- **Primary Color**: Green (`#16a34a`)
- **Font**: Almarai for Arabic support
- **Spacing**: Use variables, not arbitrary values
- **Icons**: Lucide React library
- **Forms**: React Hook Form + validation
- **Routes**: Defined in constants, typed
- **State**: Context API for global state

### **Common Pitfalls to Avoid**

- ❌ Hardcoding colors/spacing
- ❌ Forgetting RTL support
- ❌ Not using translation keys
- ❌ Breaking existing components
- ❌ Inconsistent naming conventions
- ❌ Duplicate logic across components
- ❌ Editing design system without permission
- ❌ Console logs in production code

### **Quick Reference**

**Import translation:**
```tsx
const { t, i18n } = useTranslation();
```

**Check RTL:**
```tsx
const isRTL = i18n.language === 'ar';
```

**Use breadcrumb:**
```tsx
const { setBreadcrumb } = useBreadcrumb();
setBreadcrumb([...], 'Current Page');
```

**Import UI components:**
```tsx
import { Button, Card, Input } from '@/components/ui';
```

**Use SCSS variables:**
```scss
color: var(--primary);
padding: $spacing-md;
```

---

## 🎓 Learning Path for New Developers

### **Week 1: Setup & Basics**
1. Clone and run the project
2. Explore project structure
3. Read this documentation thoroughly
4. Understand routing and navigation
5. Learn i18n implementation

### **Week 2: Component System**
1. Study UI component library
2. Understand styling approach (Tailwind + SCSS)
3. Learn form management with React Hook Form
4. Explore custom hooks (useBreadcrumb, useLocalStorage)

### **Week 3: Page Development**
1. Study Home page implementation
2. Study CreateStrategy page (complex form)
3. Understand breadcrumb system
4. Learn data flow patterns

### **Week 4: Advanced Topics**
1. Chart.js integration
2. File upload functionality
3. Modal patterns
4. RTL implementation details

---

## 📊 Project Statistics

- **Total Pages**: 14
- **UI Components**: 20+
- **Custom Hooks**: 2
- **Routes**: 14
- **Supported Languages**: 2 (Arabic, English)
- **Dependencies**: 15 production + 14 dev
- **Build Tool**: Vite 7
- **Framework**: React 19

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Maintained By**: Beetleware Development Team  
**Project Status**: Active Development

---

*This documentation is a living document and will be updated as the project evolves.*
