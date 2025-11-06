# Executive Goals Feature - Implementation Documentation

## Overview
This document describes the implementation of the Executive Goals feature for Strategic Plans, which allows users to create and manage executive goals associated with their strategic plans.

## Database Schema

### Table: `strategic_plan_executive_goals`
```sql
CREATE TABLE strategic_plan_executive_goals (
  id UUID PRIMARY KEY,
  strategic_plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  owner VARCHAR(255),
  element VARCHAR(255),
  related_to VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Indexes
- `idx_executive_goals_strategic_plan` on `strategic_plan_id`

### Row Level Security (RLS)
- Users can only access executive goals of their own strategic plans
- All operations check through the `strategic_plans` table: `strategic_plan_id IN (SELECT id FROM strategic_plans WHERE user_id = auth.uid())`
- Policies for SELECT, INSERT, UPDATE, and DELETE operations

## Service Layer

### Location
`src/services/supabase/executiveGoal/`

### Files
1. **executiveGoal.service.ts** - Main service with CRUD operations
2. **index.ts** - Service exports

### Interfaces

#### ExecutiveGoalData
```typescript
interface ExecutiveGoalData {
  id: string;
  strategic_plan_id: string;
  name: string;
  description?: string;
  duration?: string;
  owner?: string;
  element?: string;
  related_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

#### ExecutiveGoalFormData
```typescript
interface ExecutiveGoalFormData {
  name: string;
  description?: string;
  duration?: string;
  owner?: string;
  element?: string;
  related_to?: string;
  is_active: boolean;
}
```

### Service Methods

1. **createExecutiveGoal(strategicPlanId, formData)**
   - Creates a new executive goal
   - Automatically associates with the strategic plan
   - Returns: ExecutiveGoalData

2. **updateExecutiveGoal(goalId, formData)**
   - Updates an existing goal
   - Returns: ExecutiveGoalData

3. **deleteExecutiveGoal(goalId)**
   - Deletes a goal
   - Returns: void

4. **getExecutiveGoalsByPlan(strategicPlanId)**
   - Retrieves all goals for a strategic plan
   - Ordered by created_at descending
   - Returns: ExecutiveGoalData[]

5. **toggleExecutiveGoalStatus(goalId, isActive)**
   - Helper to toggle goal active status
   - Returns: ExecutiveGoalData

## Custom Hook

### Location
`src/hooks/useExecutiveGoals.ts`

### Usage
```typescript
const {
  goals,           // ExecutiveGoalData[]
  loading,         // boolean
  error,           // string | null
  createGoal,      // (formData) => Promise<ExecutiveGoalData>
  updateGoal,      // (goalId, formData) => Promise<ExecutiveGoalData>
  deleteGoal,      // (goalId) => Promise<void>
  refetch          // () => Promise<void>
} = useExecutiveGoals(planId);
```

### Features
- Automatic data fetching on mount
- Optimistic UI updates for create/update/delete
- Loading and error state management
- Re-fetch capability

## UI Components

### 1. ExecutiveGoalsTab
**Location:** `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/`

**Features:**
- Displays list of executive goals with checkboxes
- Uses `GoalItem` component from StrategyView
- Shows goal count in header
- "Add Goal" button to open modal
- Loading and error states
- Real-time updates on checkbox change

**Props:**
```typescript
interface ExecutiveGoalsTabProps {
  planId: string; // Strategic plan ID
}
```

### 2. AddExecutiveGoalModal
**Location:** `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/AddExecutiveGoalModal/`

**Features:**
- Modal form for creating new goals
- Fields:
  - Name (required)
  - Duration
  - Owner
  - Element
  - Related To
  - Description (textarea)
  - Active Status (toggle switch)
- Form validation using react-hook-form
- Integration with Input/Textarea components
- Submit and Cancel buttons
- Loading state during submission

**Props:**
```typescript
interface AddExecutiveGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExecutiveGoalFormData) => Promise<void>;
}
```

## Translations

### Arabic (ar.json)
```json
{
  "strategicPlans": {
    "executiveGoals": {
      "title": "الاهداف تنفيذية",
      "addGoal": "إضافة هدف",
      "addGoalModal": {
        "title": "إضافة هدف استراتيجي جديد",
        "name": "الاسم",
        "namePlaceholder": "ادخل الاسم",
        "duration": "المدة",
        "durationPlaceholder": "حدد المدة",
        "owner": "مالك الهدف",
        "ownerPlaceholder": "اختر مالك الهدف",
        "element": "اختر العنصر",
        "elementPlaceholder": "اختر العنصر",
        "relatedTo": "مرتبط بـ",
        "relatedToPlaceholder": "اختر نوع العنصر",
        "description": "الوصف",
        "descriptionPlaceholder": "ادخل الوصف",
        "activationStatus": "حالة التفعيل",
        "active": "مفعل",
        "createGoal": "انشاء الهدف"
      }
    }
  }
}
```

### English (en.json)
```json
{
  "strategicPlans": {
    "executiveGoals": {
      "title": "Executive Goals",
      "addGoal": "Add Goal",
      "addGoalModal": {
        "title": "Add New Strategic Goal",
        "name": "Name",
        "namePlaceholder": "Enter name",
        "duration": "Duration",
        "durationPlaceholder": "Select duration",
        "owner": "Goal Owner",
        "ownerPlaceholder": "Choose goal owner",
        "element": "Choose Element",
        "elementPlaceholder": "Choose element",
        "relatedTo": "Related To",
        "relatedToPlaceholder": "Choose element type",
        "description": "Description",
        "descriptionPlaceholder": "Enter description",
        "activationStatus": "Activation Status",
        "active": "Active",
        "createGoal": "Create Goal"
      }
    }
  }
}
```

## Setup Instructions

### 1. Database Setup
Run the migration file in Supabase SQL Editor:
```bash
src/services/supabase/migrations/create_strategic_plan_executive_goals.sql
```

### 2. Verify RLS Policies
Ensure Row Level Security is enabled and policies are created:
- Users can view executive goals of their strategic plans
- Users can insert executive goals to their strategic plans
- Users can update executive goals of their strategic plans
- Users can delete executive goals of their strategic plans

**Note:** Access is controlled through the `strategic_plans` table, not directly by user_id. This ensures goals are properly associated with strategic plans.

### 3. Test the Feature
1. Navigate to Strategic Plans View
2. Select "Executive Goals" tab
3. Click "Add Goal" button
4. Fill in the form fields
5. Submit to create a goal
6. Toggle checkbox to activate/deactivate goals

## Component Integration

The ExecutiveGoalsTab is integrated into the TabContent component:
```typescript
// src/pages/StrategicPlansView/components/TabContent.tsx
case "executive-goals":
  return <ExecutiveGoalsTab planId={planId} />;
```

## Design Reference
- Figma Design: [Executive Goals Tab & Add Goal Modal](https://www.figma.com/design/OBFnWraDywdev1k3Tzzkyj/Strategy-and-Performance-Excellence--Copy-?node-id=231-149888)
- Modal follows the same design pattern as other modals in the app
- Uses existing UI components (Input, Textarea, Button, Modal)
- Toggle switch for activation status with custom styling

## Future Enhancements
- [ ] Add goal edit functionality
- [ ] Add goal delete confirmation
- [ ] Add goal search/filter
- [ ] Add goal sorting options
- [ ] Link goals to strategic objectives
- [ ] Add goal progress tracking
- [ ] Add goal assignment to users/teams
- [ ] Add goal due dates and reminders

## Files Created/Modified

### New Files
- `src/services/supabase/migrations/create_strategic_plan_executive_goals.sql`
- `src/services/supabase/executiveGoal/executiveGoal.service.ts`
- `src/services/supabase/executiveGoal/index.ts`
- `src/hooks/useExecutiveGoals.ts`
- `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/AddExecutiveGoalModal/index.tsx`
- `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/AddExecutiveGoalModal/styles.scss`

### Modified Files
- `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/index.tsx`
- `src/pages/StrategicPlansView/components/tabs/ExecutiveGoalsTab/styles.scss`
- `src/hooks/index.ts`
- `src/locales/ar.json`
- `src/locales/en.json`

## Notes
- The feature uses the existing `GoalItem` component for consistency
- All data operations are protected by Row Level Security through the strategic_plans relationship
- Executive goals are accessed through their strategic plan, ensuring proper data isolation
- The checkbox state reflects the `is_active` field in the database
- The modal auto-closes on successful submission
- Form validation ensures name is required
- All other fields are optional
- **No user_id field needed** - access control is handled through the strategic_plan_id relationship
