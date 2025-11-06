# Strategy365 - React + Vite + Tailwind + SCSS

A modern React application built with Vite, TypeScript, Tailwind CSS, and SCSS for optimal development experience and performance.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **SCSS** - CSS preprocessor
- **i18next** - Internationalization (i18n)
- **ESLint** - Code linting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Button component
│   ├── LanguageSwitcher/ # Language switcher component
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts
│   └── index.ts
├── i18n/               # Internationalization
│   └── index.ts        # i18n configuration
├── locales/            # Translation files
│   ├── en.json         # English translations
│   └── ar.json         # Arabic translations
├── styles/             # SCSS styles
│   ├── _variables.scss # SCSS variables
│   └── main.scss       # Main stylesheet
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants
├── assets/             # Static assets
├── App.tsx             # Main App component
└── main.tsx            # App entry point
```

## 🛠️ Development

### Prerequisites

- Node.js (v20.18.0 or higher)
- npm

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for utility-first styling. All Tailwind classes are available throughout the application.

### SCSS Variables
Custom SCSS variables are defined in `src/styles/_variables.scss` for consistent theming:
- Colors (primary, secondary, accent, etc.)
- Spacing values
- Font sizes
- Border radius
- Shadows
- Breakpoints

### Component Styling
Components can use:
- Tailwind utility classes
- Custom SCSS classes defined in `main.scss`
- Component-specific SCSS files

## 🧩 Components

### Button Component
A reusable button component with variants and sizes:

```tsx
import { Button } from './components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Language Switcher Component
A component for switching between Arabic and English:

```tsx
import { LanguageSwitcher } from './components';

<LanguageSwitcher />
```

## 🔧 Custom Hooks

### useLocalStorage
A hook for managing localStorage with type safety:

```tsx
import { useLocalStorage } from './hooks';

const [value, setValue] = useLocalStorage('key', defaultValue);
```

## 🌐 Internationalization (i18n)

The app supports Arabic and English languages with RTL support:

### Adding New Translations
1. Add new keys to `src/locales/en.json` and `src/locales/ar.json`
2. Use the `useTranslation` hook in components:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
};
```

### RTL Support
- Arabic text automatically switches to RTL layout
- SCSS includes RTL-specific styles
- Document direction updates automatically

## 📝 Code Style

- Use TypeScript for all components and functions
- Follow the established project structure
- Use SCSS variables for consistent styling
- Write clean, readable code with minimal comments
- Split logic into small, reusable components and hooks
- Use translation keys for all user-facing text