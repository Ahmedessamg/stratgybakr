# Strategic Plan Policies - Supabase Setup Guide

## Overview
This guide covers the complete setup for the Policies feature in Strategic Plans, including database tables, storage buckets, and RLS policies.

## 1. Database Setup

### Run the Migration SQL

Go to your Supabase Dashboard → SQL Editor and run the migration file:
```bash
src/services/supabase/migrations/create_strategic_plan_policies.sql
```

This will create:
- ✅ `strategic_plan_policies` table
- ✅ `strategic_plan_policy_attachments` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance

### Tables Structure

#### strategic_plan_policies
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| strategic_plan_id | UUID | Foreign key to strategic_plans |
| name | VARCHAR(255) | Policy name |
| description | TEXT | Policy description |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

#### strategic_plan_policy_attachments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| policy_id | UUID | Foreign key to strategic_plan_policies |
| file_name | VARCHAR(255) | Original file name |
| file_url | TEXT | Public URL of the file |
| file_size | BIGINT | File size in bytes |
| created_at | TIMESTAMP | Auto-generated |

## 2. Storage Bucket Setup

### Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `strategic-plan-policy-attachments`
   - **Public**: No (Private)
   - **File size limit**: 50 MB (recommended)
   - **Allowed MIME types**: 
     - application/pdf
     - application/vnd.openxmlformats-officedocument.wordprocessingml.document (docx)
     - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (xlsx)
     - image/png
     - image/jpeg
     - image/jpg
4. Click **Create bucket**

### Storage Policies

The storage policies are included in the migration SQL file. They allow:
- ✅ Users can upload policy attachments
- ✅ Users can view their policy attachments
- ✅ Users can delete their policy attachments

## 3. Integration with Application

### Service Layer
The policy service is located at:
```
src/services/supabase/policy/policy.service.ts
```

#### Available Methods:
- `createPolicy(strategicPlanId, formData)` - Create a new policy with attachments
- `updatePolicy(policyId, formData)` - Update an existing policy
- `deletePolicy(policyId)` - Delete a policy and its attachments
- `getPoliciesByPlan(strategicPlanId, page, limit)` - Get paginated policies
- `getPolicyById(policyId)` - Get a single policy with attachments
- `uploadPolicyAttachment(file, policyId, userId)` - Upload an attachment
- `deletePolicyAttachment(attachmentId)` - Delete an attachment

### Custom Hook
Use the `usePolicies` hook for easy integration:

```typescript
import { usePolicies } from '@/hooks';

const {
  policies,           // Array of policies
  total,             // Total count
  totalPages,        // Total pages
  loading,           // Loading state
  error,             // Error message
  createPolicy,      // Function to create policy
  updatePolicy,      // Function to update policy
  deletePolicy,      // Function to delete policy
  deleteAttachment,  // Function to delete attachment
  refetch,           // Function to refetch data
} = usePolicies(strategicPlanId, page, limit);
```

### Component Integration
The PoliciesTab component is located at:
```
src/pages/StrategicPlansView/components/tabs/PoliciesTab/
```

Features:
- ✅ Display policies list with pagination
- ✅ Add new policies via modal
- ✅ Upload file attachments
- ✅ View policy details
- ✅ Loading and error states
- ✅ Empty state
- ✅ RTL support
- ✅ Responsive design

## 4. Security Features

### Row Level Security (RLS)
All policies are user-scoped through RLS:
- Users can only view policies of their own strategic plans
- Users can only create policies for their own strategic plans
- Users can only update/delete policies of their own strategic plans

### Cascade Deletion
- Deleting a strategic plan automatically deletes all its policies
- Deleting a policy automatically deletes all its attachments (database records)
- File deletion from storage is handled in the application layer

## 5. Usage Example

### Create a Policy

```typescript
import { policyService } from '@/services/supabase/policy';

// Prepare form data
const formData = {
  name: "Risk Management Policy",
  description: "Review risk register and ensure preventive measures are properly implemented.",
  attachments: [file1, file2], // Array of File objects
};

// Create policy
try {
  const policy = await policyService.createPolicy(strategicPlanId, formData);
  console.log('Policy created:', policy);
} catch (error) {
  console.error('Failed to create policy:', error);
}
```

### Get Policies with Pagination

```typescript
// Get page 1 with 10 items
const result = await policyService.getPoliciesByPlan(strategicPlanId, 1, 10);

console.log('Policies:', result.data);
console.log('Total:', result.total);
console.log('Total pages:', result.totalPages);
```

### Update a Policy

```typescript
await policyService.updatePolicy(policyId, {
  name: "Updated Policy Name",
  description: "Updated description",
});
```

### Delete a Policy

```typescript
// This will delete the policy and all its attachments
await policyService.deletePolicy(policyId);
```

## 6. Translations

Translation keys are available in:
- `src/locales/ar.json` (Arabic)
- `src/locales/en.json` (English)

Under the namespace: `strategicPlans.policies`

Available keys:
- `title` - "Policies" / "السياسات"
- `addNew` - "Add New" / "إضافة جديد"
- `addPolicy` - "Add Policy" / "إضافة سياسة"
- `viewDetails` - "View Details" / "عرض التفاصيل"
- `itemsPerPage` - "Items per page" / "عدد العناصر المعروضة"
- `noPolicies` - "No policies available" / "لا توجد سياسات"
- `name` - "Name" / "الاسم"
- `description` - "Description" / "الوصف"
- `attachments` - "Attachments" / "المرفقات"
- `attachmentsCount` - "{{count}} attachments" / "{{count}} مرفق"

## 7. Testing

### Test Policy Creation

1. Navigate to a Strategic Plan view
2. Click on the **Policies** tab
3. Click **Add New** button
4. Fill in the form:
   - Name: "Test Policy"
   - Description: "This is a test policy"
   - Upload some test files
5. Click **Add**
6. Verify the policy appears in the list

### Test Pagination

1. Create multiple policies (at least 15)
2. Change the items per page to 5
3. Navigate through pages
4. Verify correct data is displayed on each page

### Test File Upload

1. Click **Add New** policy
2. Try uploading different file types (PDF, DOCX, images)
3. Verify files are uploaded successfully
4. Check the attachment count is displayed correctly

## 8. Troubleshooting

### Issue: "relation 'strategic_plan_policies' does not exist"
**Solution**: Run the migration SQL in Supabase SQL Editor

### Issue: "storage bucket not found"
**Solution**: Create the `strategic-plan-policy-attachments` bucket in Storage

### Issue: "permission denied"
**Solution**: 
1. Check RLS policies are enabled
2. Verify user is authenticated
3. Verify user owns the strategic plan

### Issue: "Failed to upload file"
**Solution**:
1. Check storage bucket exists
2. Check storage policies are configured
3. Verify file size is within limits
4. Check file type is allowed

## 9. Performance Considerations

### Indexes
The migration creates indexes on:
- `strategic_plan_policies.strategic_plan_id` - For fast policy lookup by plan
- `strategic_plan_policy_attachments.policy_id` - For fast attachment lookup by policy

### Pagination
Always use pagination when fetching policies to avoid loading too much data:
```typescript
// Good - Paginated
const policies = await policyService.getPoliciesByPlan(planId, 1, 10);

// Bad - Would load all policies
// const policies = await policyService.getPoliciesByPlan(planId, 1, 10000);
```

### File Size Limits
Recommended maximum file size: 50 MB per file

## 10. Next Steps

- [ ] Implement policy details view
- [ ] Add policy edit functionality
- [ ] Add policy delete with confirmation
- [ ] Add attachment preview/download
- [ ] Add file type icons
- [ ] Add search and filter for policies
- [ ] Add policy status (draft, active, archived)
- [ ] Add policy versioning
- [ ] Add policy approval workflow
- [ ] Add activity logs for policies

## 11. API Reference

### PolicyService Methods

#### createPolicy
```typescript
createPolicy(
  strategicPlanId: string,
  formData: PolicyFormData
): Promise<PolicyData>
```

#### updatePolicy
```typescript
updatePolicy(
  policyId: string,
  formData: Partial<PolicyFormData>
): Promise<PolicyData>
```

#### deletePolicy
```typescript
deletePolicy(policyId: string): Promise<void>
```

#### getPoliciesByPlan
```typescript
getPoliciesByPlan(
  strategicPlanId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedPolicies>
```

#### getPolicyById
```typescript
getPolicyById(policyId: string): Promise<PolicyData>
```

### Type Definitions

```typescript
interface PolicyData {
  id: string;
  strategic_plan_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  attachments?: PolicyAttachment[];
}

interface PolicyFormData {
  name: string;
  description: string;
  attachments: File[];
}

interface PolicyAttachment {
  id: string;
  policy_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

interface PaginatedPolicies {
  data: PolicyData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Summary

The Policies feature is now fully integrated with Supabase:
- ✅ Database tables created with RLS
- ✅ Storage bucket configured
- ✅ Service layer implemented
- ✅ Custom hook available
- ✅ UI components integrated
- ✅ Translations added
- ✅ Pagination working
- ✅ File upload working
- ✅ Security policies in place

You're ready to start using the Policies feature! 🎉
