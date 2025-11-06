# Strategy Database Setup Guide

## Database Structure

### Tables Overview

```
strategies (Main Table)
├── strategic_goals
├── operational_goals
├── strategy_values
├── strategy_pillars
└── strategy_attachments
```

## 1. Main Strategy Table

**Table Name:** `strategies`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | VARCHAR(255) | Strategy name (required) |
| description | TEXT | Strategy description |
| start_date | DATE | Start date (required) |
| end_date | DATE | End date (required) |
| strategic_details | TEXT | Strategic details text |
| vision_mission | TEXT | Vision and mission statement |
| focus_areas | TEXT | Focus areas/targets |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

**Maps to UI:** Strategy Information Card & Strategic Details Card

## 2. Strategic Goals Table

**Table Name:** `strategic_goals`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategy_id | UUID | Foreign key to strategies |
| name | VARCHAR(255) | Goal name |
| duration | VARCHAR(50) | Duration (1 year, 2 years, 3 years) |
| element | VARCHAR(255) | Element/category |
| description | TEXT | Goal description |
| status | BOOLEAN | Active status |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

**Maps to UI:** Strategic Goals Card

## 3. Operational Goals Table

**Table Name:** `operational_goals`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategy_id | UUID | Foreign key to strategies |
| name | VARCHAR(255) | Goal name |
| duration | VARCHAR(50) | Duration |
| element | VARCHAR(255) | Element/category |
| description | TEXT | Goal description |
| status | BOOLEAN | Active status |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

**Maps to UI:** Operational Goals Card

## 4. Strategy Values Table

**Table Name:** `strategy_values`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategy_id | UUID | Foreign key to strategies |
| name | VARCHAR(255) | Value name |
| description | TEXT | Value description |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

**Maps to UI:** Values Card

## 5. Strategy Pillars Table

**Table Name:** `strategy_pillars`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategy_id | UUID | Foreign key to strategies |
| name | VARCHAR(255) | Pillar name |
| description | TEXT | Pillar description |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

**Maps to UI:** Pillars Card

## 6. Strategy Attachments Table

**Table Name:** `strategy_attachments`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategy_id | UUID | Foreign key to strategies |
| file_name | VARCHAR(255) | Original file name |
| file_path | TEXT | Storage path |
| file_size | BIGINT | File size in bytes |
| file_type | VARCHAR(100) | MIME type |
| created_at | TIMESTAMP | Auto-generated |

**Maps to UI:** Strategy Attachments Card

## Setup Instructions

### Step 1: Run SQL Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase_migrations.sql`
4. Paste and run the SQL script
5. Verify all tables are created

### Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `strategy-attachments`
4. Set as **Private** (recommended)
5. Click **Create bucket**

### Step 3: Configure Storage Policies

Run this SQL in the SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('strategy-attachments', 'strategy-attachments', false);

-- Allow users to upload files
CREATE POLICY "Users can upload their strategy attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'strategy-attachments' AND 
  auth.uid() IS NOT NULL
);

-- Allow users to view their files
CREATE POLICY "Users can view their strategy attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'strategy-attachments' AND 
  auth.uid() IS NOT NULL
);

-- Allow users to delete their files
CREATE POLICY "Users can delete their strategy attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'strategy-attachments' AND 
  auth.uid() IS NOT NULL
);
```

## API Service Usage

### Import the Service

```typescript
import { strategyService } from '../services/supabase/strategy';
```

### Create a Complete Strategy

```typescript
// 1. Create main strategy
const strategy = await strategyService.createStrategy({
  name: "Digital Transformation 2025",
  description: "Company-wide digital transformation",
  start_date: "2025-01-01",
  end_date: "2025-12-31",
  strategic_details: "Detailed strategic plan...",
  vision_mission: "Our vision and mission...",
  focus_areas: "Key focus areas..."
});

// 2. Add strategic goals
await strategyService.addStrategicGoals([
  {
    strategy_id: strategy.id,
    name: "Increase market share",
    duration: "1 year",
    element: "Growth",
    description: "Expand market presence",
    status: true
  }
]);

// 3. Add operational goals
await strategyService.addOperationalGoals([
  {
    strategy_id: strategy.id,
    name: "Improve customer satisfaction",
    duration: "6 months",
    element: "Operations",
    description: "Enhance customer experience",
    status: true
  }
]);

// 4. Add values
await strategyService.addValues([
  {
    strategy_id: strategy.id,
    name: "Innovation",
    description: "Foster innovation culture"
  }
]);

// 5. Add pillars
await strategyService.addPillars([
  {
    strategy_id: strategy.id,
    name: "Technology",
    description: "Leverage cutting-edge technology"
  }
]);

// 6. Upload attachments
const file = // ... get file from input
const fileUrl = await strategyService.uploadFile(file, strategy.id);
await strategyService.addAttachment({
  strategy_id: strategy.id,
  file_name: file.name,
  file_path: fileUrl,
  file_size: file.size,
  file_type: file.type
});
```

### Get Strategy with All Relations

```typescript
const strategy = await strategyService.getStrategy(strategyId);

console.log(strategy.strategic_goals); // Array of goals
console.log(strategy.operational_goals); // Array of goals
console.log(strategy.values); // Array of values
console.log(strategy.pillars); // Array of pillars
console.log(strategy.attachments); // Array of attachments
```

### Update Strategy

```typescript
await strategyService.updateStrategy({
  id: strategyId,
  name: "Updated Strategy Name",
  description: "Updated description"
});
```

### Delete Strategy

```typescript
// This will cascade delete all related records
await strategyService.deleteStrategy(strategyId);
```

## UI to Database Mapping

### Strategy Information Card
```typescript
{
  name: string,           // → strategies.name
  description: string,    // → strategies.description
  startDate: string,      // → strategies.start_date
  endDate: string         // → strategies.end_date
}
```

### Strategic Details Card
```typescript
{
  strategicDetails: string,  // → strategies.strategic_details
  visionMission: string,     // → strategies.vision_mission
  focusAreas: string         // → strategies.focus_areas
}
```

### Strategic Goals Card
```typescript
{
  id: string,
  name: string,
  duration: string,
  element: string,
  description: string,
  status: boolean
} // → strategic_goals table
```

### Operational Goals Card
```typescript
{
  id: string,
  name: string,
  duration: string,
  element: string,
  description: string,
  status: boolean
} // → operational_goals table
```

### Values Card
```typescript
{
  id: string,
  name: string,
  description: string
} // → strategy_values table
```

### Pillars Card
```typescript
{
  id: string,
  name: string,
  description: string
} // → strategy_pillars table
```

### Attachments Card
```typescript
{
  id: string,
  file_name: string,
  file_path: string,
  file_size: number,
  file_type: string
} // → strategy_attachments table
```

## Security Features

### Row Level Security (RLS)
- ✅ Users can only access their own strategies
- ✅ Users can only access goals/values/pillars of their strategies
- ✅ All operations are user-scoped
- ✅ Automatic user_id validation

### Cascade Deletion
- ✅ Deleting a strategy automatically deletes all related records
- ✅ No orphaned data in database

### Automatic Timestamps
- ✅ `created_at` set automatically on insert
- ✅ `updated_at` updated automatically on update

## Testing the Setup

### 1. Test Strategy Creation
```typescript
const strategy = await strategyService.createStrategy({
  name: "Test Strategy",
  description: "Test Description",
  start_date: "2025-01-01",
  end_date: "2025-12-31"
});
console.log("Strategy created:", strategy.id);
```

### 2. Test Retrieval
```typescript
const strategies = await strategyService.getStrategies();
console.log("My strategies:", strategies);
```

### 3. Test Relations
```typescript
const fullStrategy = await strategyService.getStrategy(strategyId);
console.log("Full strategy with relations:", fullStrategy);
```

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run the SQL migration script in Supabase SQL Editor

### Issue: "permission denied for table"
**Solution:** Check RLS policies are enabled and configured correctly

### Issue: "storage bucket not found"
**Solution:** Create the `strategy-attachments` bucket in Storage section

### Issue: "user not authenticated"
**Solution:** Ensure user is logged in before calling strategy service

## Next Steps

1. ✅ Run SQL migration
2. ✅ Create storage bucket
3. ✅ Configure storage policies
4. ✅ Test with sample data
5. ✅ Integrate with UI components
6. ✅ Add error handling
7. ✅ Add loading states
8. ✅ Add success/error notifications
