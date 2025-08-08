# Advertisement API Changes - Frontend Migration Guide

## Overview

We've restructured how advertisement images handle their active/inactive states and soft deletion. The main change is replacing the single `isActive` field with the `isApproved` field to represent Admin approval status, and two separate fields for clearer semantics around enabled/disabling and soft deleting.

## Breaking Changes

### Advertisement Image Object Structure

#### Previous Structure

```typescript
{
  id: number;
  advertisementId: number;
  imageType: 'DESKTOP' | 'MOBILE' | 'DEFAULT';
  imageUrl: string;
  isActive: boolean; // ❌ REMOVED
  width: number | null;
  height: number | null;
  fileSize: number | null;
  fileType: string | null;
  metadata: object | null;
  createdAt: string;
  updatedAt: string;
}
```

#### New Structure

```typescript
{
  id: number;
  advertisementId: number;
  imageType: 'DESKTOP' | 'MOBILE' | 'DEFAULT';
  imageUrl: string;
  isApproved: boolean; // ✅ NEW - Admin approval status (previously isActive)
  isEnabled: boolean; // ✅ NEW - User control (on/off)
  width: number | null;
  height: number | null;
  fileSize: number | null;
  fileType: string | null;
  metadata: object | null;
  createdAt: string;
  updatedAt: string;
}
```

**Note:** The `deletedAt` field exists internally but is **never exposed** in API responses.

## Field Semantics

### Understanding the New Fields

| Field        | Default | Who Controls | Purpose                                          |
| ------------ | ------- | ------------ | ------------------------------------------------ |
| `isApproved` | `false` | Admin only   | Whether admin has approved the image for display |
| `isEnabled`  | `true`  | Vendor/User  | Whether the vendor wants the image active        |

### Image Visibility Logic

An image is visible to the public when:

- `isApproved === true` AND
- `isEnabled === true` AND
- Image is not soft-deleted (handled internally)

## Affected Endpoints

### 1. `GET /advertisements`

- **Change**: Image objects in responses now have `isApproved` and `isEnabled` instead of `isActive`
- **Query param changes**:
  - `is_active` → Use `is_approved` and/or `is_enabled`
  - New: `deleted_at` param available (but rarely needed)

### 2. `GET /advertisements/active`

- **Change**: Image objects in responses now have `isApproved` and `isEnabled`
- **Behavior**: Returns only advertisements with images where `isApproved=true` AND `isEnabled=true`

### 3. `GET /advertisements/:id`

- **Change**: Image objects now have `isApproved` and `isEnabled` instead of `isActive`

### 4. `GET /advertisements/:id/images`

- **Change**: Each image now has `isApproved` and `isEnabled` instead of `isActive`
- **Query param changes**:
  - `is_active=true` → Use `is_approved=true` and/or `is_enabled=true`

### 5. `GET /advertisements/images/:id`

- **Change**: Image object now has `isApproved` and `isEnabled` instead of `isActive`

### 6. `POST /advertisements/:id/images`

- **Request body changes**:
  - Remove: `isActive`
  - Add: `isApproved` (optional, defaults to `false`)
  - Add: `isEnabled` (optional, defaults to `true`)

### 7. `POST /advertisements/:id/images/confirm-upload`

- **Request body changes**:
  - Remove: `isActive`
  - Add: `isApproved` (optional, defaults to `false`)
  - Add: `isEnabled` (optional, defaults to `true`)

### 8. `PUT /advertisements/:id/images/:imageId` and `PATCH /images/:imageId`

- **Request body changes**:
  - Remove: `isActive`
  - Add: `isApproved` (optional)
  - Add: `isEnabled` (optional)

### 9. `DELETE /images/:imageId`

- **Behavior change**: Now performs **hard delete** (permanent removal)
- **Permission change**: Admin only, do not use

### 10. `POST /images/:imageId/soft-delete` ✅ NEW

- **Purpose**: Soft delete an image (user action)
- **Permission**: Vendor can soft-delete their own images
- **Effect**: Image becomes invisible but can be restored by admin

## Migration Checklist for Frontend

### 1. Update Type Definitions

- [ ] Replace `isActive: boolean` with `isApproved: boolean` and `isEnabled: boolean` in image interfaces

### 2. Update Display Logic

- [ ] Replace checks for `image.isActive` with appropriate logic:
  - For public display: `image.isApproved && image.isEnabled`
  - For vendor's own view: Check `image.isEnabled`
  - For admin view: Show all with status indicators

### 3. Update Forms

- [ ] Image upload forms: Remove `isActive` field
- [ ] Admin panels: Add separate controls for `isApproved`
- [ ] Vendor panels: Add toggle for `isEnabled`

### 4. Update API Calls

- [ ] Review all endpoints that create/update images
- [ ] Replace `isActive` in request bodies
- [ ] Update query parameters in GET requests

### 5. Handle Soft Delete

- [ ] Change DELETE button to call `POST /images/:imageId/soft-delete` for vendors
- [ ] Only admins should see permanent delete option

## Example Code Changes

### Before

```typescript
// Checking if image should be displayed
if (image.isActive) {
  displayImage(image);
}

// Creating an image
await api.post('/advertisements/1/images', {
  imageUrl: 'https://...',
  imageType: 'DESKTOP',
  isActive: true
});
```

### After

```typescript
// Checking if image should be displayed publicly
if (image.isApproved && image.isEnabled) {
  displayImage(image);
}

// Creating an image (vendor upload)
await api.post('/advertisements/1/images', {
  imageUrl: 'https://...',
  imageType: 'DESKTOP',
  isEnabled: true // Optional, defaults to true
  // isApproved defaults to false, admin must approve
});

// Soft deleting an image (vendor action)
await api.post(`/images/${imageId}/soft-delete`);
```

## Summary

The main change is semantic: instead of one ambiguous `isActive` field, we now have:

- `isApproved`: Admin approval (content moderation)
- `isEnabled`: User control (on/off switch)
- Soft delete: Invisible but recoverable deletion

This provides clearer separation of concerns and better control over image visibility.
