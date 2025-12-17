# Batch CSV Integration Plan

## Overview
Integrate batch artisan creation from CSV/Excel files into the FindArtisan application. This will allow admins to upload multiple artisans at once.

## Current State Analysis

### Frontend (`AddArtisanCsvForm`)
- ✅ CSV/Excel parsing implemented
- ✅ Data validation implemented
- ✅ Preview table implemented
- ❌ Submit handler only logs to console (TODO)
- ❌ No API integration

### Backend
- ✅ Single artisan creation endpoint (`POST /artisans`)
- ✅ Handles profession/zone resolution and creation
- ✅ Handles phone numbers and social links
- ✅ Handles profile photo uploads
- ❌ No batch creation endpoint

## Implementation Plan

### Phase 1: Backend - Batch Creation Endpoint

#### 1.1 Create Batch Endpoint
**File**: `backend/src/api/artisan/controllers/artisan.ts`

**New Method**: `createBatch`
- Accept array of artisan data
- Process each artisan sequentially or in parallel (with concurrency limit)
- Return results with success/failure status for each artisan
- Handle duplicate phone number checks

**Endpoint**: `POST /artisans/batch`
- Route config: `auth: false` (for community submissions) or `auth: true` (for admin)

**Request Format**:
```typescript
{
  data: Array<{
    full_name: string;
    description?: string;
    profession?: string; // name or slug
    zones?: string[]; // array of zone names/slugs
    phone_numbers?: Array<{
      number: string;
      is_whatsapp: boolean;
    }>;
    social_links?: Array<{
      platform: string;
      link: string;
    }>;
    profile_photo?: number; // media ID (if uploaded separately)
    is_community_submitted?: boolean;
    status?: string;
  }>;
}
```

**Response Format**:
```typescript
{
  success: boolean;
  total: number;
  created: number;
  failed: number;
  results: Array<{
    index: number;
    success: boolean;
    artisan?: Artisan;
    error?: string;
  }>;
}
```

#### 1.2 Duplicate Phone Number Check
- Before creating each artisan, check if phone number already exists
- If duplicate found, skip creation and return error for that specific artisan
- Continue processing remaining artisans

#### 1.3 Route Configuration
**File**: `backend/src/api/artisan/routes/artisan.ts`

Add custom route:
```typescript
{
  method: 'POST',
  path: '/artisans/batch',
  handler: 'artisan.createBatch',
  config: {
    auth: false, // or true for admin-only
  },
}
```

### Phase 2: Frontend - Data Transformation

#### 2.1 Transform CSV Data to API Format
**File**: `frontend/app/_components/forms/AddArtisanCsv.form.tsx`

Create transformation function:
```typescript
function transformParsedDataToApiFormat(
  parsedData: ParsedArtisan[]
): CreateBatchArtisanPayload[] {
  return parsedData.map((row) => {
    // Transform phone number
    const phoneNumbers = [];
    if (row["Numéro de téléphone"]?.trim()) {
      phoneNumbers.push({
        number: row["Numéro de téléphone"].trim(),
        is_whatsapp: row.WhatsApp?.toLowerCase() === "oui",
      });
    }

    // Transform social links
    const socialLinks = [];
    if (row.Facebook?.trim()) {
      socialLinks.push({
        platform: "facebook",
        link: ensureUrlProtocol(row.Facebook.trim()),
      });
    }
    if (row.TikTok?.trim()) {
      socialLinks.push({
        platform: "tiktok",
        link: ensureUrlProtocol(row.TikTok.trim()),
      });
    }
    if (row.Instagram?.trim()) {
      socialLinks.push({
        platform: "instagram",
        link: ensureUrlProtocol(row.Instagram.trim()),
      });
    }

    return {
      full_name: row["Nom complet"].trim(),
      description: row.Description?.trim() || "",
      profession: row.Profession?.trim(),
      zones: row.Zone?.split(",").map((z) => z.trim()).filter(Boolean) || [],
      phone_numbers: phoneNumbers,
      social_links: socialLinks.length > 0 ? socialLinks : undefined,
      is_community_submitted: true,
      status: "approved",
    };
  });
}
```

#### 2.2 Helper Functions
- `ensureUrlProtocol(url: string)`: Add `https://` if missing
- `normalizePhoneNumber(phone: string)`: Format phone numbers consistently

### Phase 3: Frontend - Batch Mutation Hook

#### 3.1 Create Batch Mutation
**File**: `frontend/app/lib/services/artisan.ts`

Add new types and mutation:
```typescript
export interface CreateBatchArtisanPayload {
  full_name: string;
  description?: string;
  profession?: string;
  zones?: string[];
  phone_numbers?: Array<{
    number: string;
    is_whatsapp: boolean;
  }>;
  social_links?: Array<{
    platform: string;
    link: string;
  }>;
  is_community_submitted?: boolean;
  status?: string;
}

export interface BatchCreateArtisanResponse {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  results: Array<{
    index: number;
    success: boolean;
    artisan?: Artisan;
    error?: string;
  }>;
}

export const useCreateBatchArtisans = createMutation({
  mutationKey: ['artisans', 'create-batch'],
  mutationFn: async (
    payload: CreateBatchArtisanPayload[]
  ): Promise<BatchCreateArtisanResponse> => {
    const response = await api.post<BatchCreateArtisanResponse>(
      `${routes.artisans.base}/batch`,
      { data: payload }
    );
    return response;
  },
});
```

#### 3.2 Update Routes
**File**: `frontend/app/lib/routes.ts`

No changes needed (using `${routes.artisans.base}/batch`)

### Phase 4: Frontend - Integration in Form

#### 4.1 Update Submit Handler
**File**: `frontend/app/_components/forms/AddArtisanCsv.form.tsx`

Replace the TODO in `handleCsvSubmit`:
```typescript
const batchMutation = useCreateBatchArtisans({
  onSuccess: (response) => {
    // Show success notification
    notifications.show({
      title: 'Import terminé',
      message: `${response.created} artisan(s) créé(s) sur ${response.total}`,
      color: 'green',
    });
    
    // Show detailed results if there are failures
    if (response.failed > 0) {
      // Show error details
    }
    
    // Reset form
    setCsvState({
      file: null,
      error: null,
      isValid: false,
      parsedData: [],
      validationErrors: [],
    });
    setShowPreview(false);
    
    if (onSuccess) {
      onSuccess(csvState.parsedData);
    }
  },
  onError: (error) => {
    notifications.show({
      title: 'Erreur lors de l\'import',
      message: error.message || 'Une erreur est survenue',
      color: 'red',
    });
    if (onError) onError(error.message);
  },
});

const handleCsvSubmit = useCallback(async () => {
  if (!csvState.file || !csvState.isValid || csvState.parsedData.length === 0) return;

  setIsProcessing(true);
  try {
    // Transform parsed data to API format
    const apiPayload = transformParsedDataToApiFormat(csvState.parsedData);
    
    // Submit batch
    await batchMutation.mutateAsync(apiPayload);
  } catch (error) {
    // Error handled in onError callback
  } finally {
    setIsProcessing(false);
  }
}, [csvState, batchMutation, onSuccess, onError]);
```

#### 4.2 Progress Tracking (Optional Enhancement)
- Show progress bar during batch upload
- Display "Processing artisan X of Y"
- Update in real-time as each artisan is processed

#### 4.3 Error Display
- Show detailed error messages for failed artisans
- Display row numbers and specific error reasons
- Allow user to download a report of failed items

### Phase 5: Error Handling & Edge Cases

#### 5.1 Duplicate Phone Numbers
- Backend checks for duplicates before creation
- Frontend shows which rows failed due to duplicates
- Option to skip duplicates or show warning

#### 5.2 Partial Failures
- Continue processing even if some artisans fail
- Return detailed results for each artisan
- Allow retry of failed items

#### 5.3 Large Files
- Consider chunking for very large files (100+ artisans)
- Process in batches of 50-100 artisans
- Show progress for each chunk

#### 5.4 Network Errors
- Retry logic for transient failures
- Save progress locally (localStorage) for recovery
- Resume from last successful batch

### Phase 6: Testing & Validation

#### 6.1 Test Cases
- ✅ Valid CSV with all fields
- ✅ Valid CSV with optional fields missing
- ✅ CSV with duplicate phone numbers
- ✅ CSV with invalid phone numbers
- ✅ CSV with invalid social media URLs
- ✅ Large CSV (50+ artisans)
- ✅ Excel file with formatting
- ✅ CSV with special characters (accents, etc.)
- ✅ Empty CSV
- ✅ CSV with validation errors

#### 6.2 Error Scenarios
- Network timeout
- Server error (500)
- Validation errors
- Duplicate entries
- Invalid file format

## Implementation Order

1. **Backend Batch Endpoint** (Phase 1)
   - Create `createBatch` method
   - Add route configuration
   - Test with Postman/curl

2. **Frontend Data Transformation** (Phase 2)
   - Create transformation functions
   - Test with sample data

3. **Frontend Batch Mutation** (Phase 3)
   - Create mutation hook
   - Test API call

4. **Form Integration** (Phase 4)
   - Connect form to mutation
   - Add error handling
   - Add success notifications

5. **Error Handling** (Phase 5)
   - Implement duplicate checks
   - Handle partial failures
   - Add retry logic

6. **Testing** (Phase 6)
   - Test all scenarios
   - Fix edge cases
   - Performance testing

## Files to Modify

### Backend
- `backend/src/api/artisan/controllers/artisan.ts` - Add `createBatch` method
- `backend/src/api/artisan/routes/artisan.ts` - Add batch route

### Frontend
- `frontend/app/lib/services/artisan.ts` - Add batch mutation hook
- `frontend/app/_components/forms/AddArtisanCsv.form.tsx` - Integrate API call
- `frontend/app/lib/utils.ts` - Add helper functions (if needed)

## Success Criteria

- ✅ Users can upload CSV/Excel files with multiple artisans
- ✅ All valid artisans are created successfully
- ✅ Duplicate phone numbers are detected and skipped
- ✅ Detailed error messages for failed artisans
- ✅ Success notification shows count of created artisans
- ✅ Form resets after successful submission
- ✅ Performance is acceptable for files with 50+ artisans

## Future Enhancements

- Progress bar with real-time updates
- Download error report as CSV
- Preview before submission with edit capability
- Batch edit/update functionality
- Import history/logs
- Scheduled batch imports

