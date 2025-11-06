# Supabase Authentication Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=https://frvaavoxnwogyjztiziz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydmFhdm94bndvZ3lqenRpeml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTk1MjQsImV4cCI6MjA3NTQ5NTUyNH0.akgeqJKPwbKFDpth7eDvqV0E83KgyZVBHMXg7CC5VXE
```

## Supabase Database Setup

The authentication system uses Supabase's built-in auth system. The user metadata includes:
- `email` (string, required)
- `password` (string, required)
- `username` (string, stored in user metadata)

### Enable Email Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Email provider
4. Configure email templates if needed

### User Metadata

The username is stored in the user's metadata. You can access it via:
```typescript
const { data: { user } } = await supabase.auth.getUser();
const username = user?.user_metadata?.username;
```

## Project Structure

```
src/
├── services/
│   └── supabase/
│       ├── config.ts          # Supabase configuration
│       ├── client.ts          # Supabase client instance
│       ├── auth.service.ts    # Authentication service
│       └── index.ts           # Exports
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── pages/
│   ├── Login/
│   │   ├── index.tsx         # Login page component
│   │   └── Login.scss        # Login page styles
│   └── Register/
│       ├── index.tsx         # Register page component
│       └── Register.scss     # Register page styles
└── locales/
    ├── ar.json               # Arabic translations
    └── en.json               # English translations
```

## Usage

### Using Auth Context

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Auth Service Directly

```typescript
import { authService } from '../services/supabase';

// Login
await authService.login({ email, password });

// Register
await authService.register({ email, password, username });

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();
```

## Routes

- `/login` - Login page
- `/register` - Register page
- `/` - Home page (protected)

## Features

✅ Email/Password authentication
✅ User registration with username
✅ Login/Logout functionality
✅ Auth state management with Context
✅ Protected routes
✅ RTL/LTR support
✅ Internationalization (Arabic/English)
✅ Form validation
✅ Error handling
✅ Loading states

## Next Steps

1. Create `.env.local` file with your Supabase credentials
2. Enable Email authentication in Supabase dashboard
3. Optionally customize email templates
4. Add protected route wrapper if needed
5. Customize user profile fields as needed
