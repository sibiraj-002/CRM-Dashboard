# Firebase Firestore Permission Debug Guide

## Root Causes of "Missing or Insufficient Permissions" Error

### 1. **Firestore Security Rules Not Configured for Blogs Collection**
- The most common cause is that Firestore security rules don't allow authenticated users to read/write to the "blogs" collection
- Rules might only exist for "categories" but not for "blogs"
- Rules might require additional conditions that aren't being met

### 2. **User Authentication State Not Available at Query Time**
- The `auth.currentUser` might be `null` if the auth state hasn't loaded
- Firestore queries execute before auth is ready in some cases
- The AuthProvider context might not be properly wrapping the components

### 3. **Collection Name Mismatch**
- Collection is named "blogs" in code but might be named differently in Firestore
- Case sensitivity matters: "blogs" vs "Blogs" vs "BLOGS"

### 4. **Missing Auth Token or Invalid Credentials**
- The user's auth token might be expired or invalid
- The user might be logged out in the browser but the app still thinks they're logged in

---

## How to Debug the Issue

### Step 1: Run the Firestore Debug Test

**In Browser Console:**
```javascript
// The debug utility is automatically attached to window.debugFirestore
await debugFirestore()
```

**In Component:**
```jsx
import { debugFirestoreConnection } from "@/lib/firebase/debug";

// Add to a useEffect
useEffect(() => {
  debugFirestoreConnection().then(console.log);
}, []);
```

### Step 2: Check Console Output
The debug test will show:
- ✅ or ❌ Authentication status
- ✅ or ❌ Blogs collection read permission
- ✅ or ❌ Categories collection read permission
- Error codes and specific error messages
- Recommendations to fix issues

### Step 3: Review Enhanced Service Logging
All Firestore operations in blogService.js now include detailed logging:

```javascript
// When you call a Firestore operation, check the console for:
[createBlog] Starting blog creation
[createBlog] Author ID: abc123
[createBlog] Current user: abc123
[createBlog] Collection reference created for: blogs
[createBlog] Document created successfully with ID: doc123
```

**Or errors:**
```javascript
[createBlog] Error occurred: FirebaseError: Permission denied
[createBlog] Error code: permission-denied
[createBlog] Error message: Missing or insufficient permissions.
```

---

## Firestore Security Rules for Development

### For Complete Development Access (Not for Production)

Go to **Firebase Console → Firestore Database → Rules** and use:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### For Production (Recommended)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blogs Collection Rules
    match /blogs/{blogId} {
      // Authenticated users can read all blogs
      allow read: if request.auth != null;
      
      // Only authenticated users can create blogs (author must be current user)
      allow create: if request.auth != null 
        && request.resource.data.authorId == request.auth.uid;
      
      // Users can only update their own blogs
      allow update: if request.auth != null 
        && resource.data.authorId == request.auth.uid;
      
      // Users can only delete their own blogs
      allow delete: if request.auth != null 
        && resource.data.authorId == request.auth.uid;
    }
    
    // Categories Collection Rules
    match /categories/{categoryId} {
      // Authenticated users can read all categories
      allow read: if request.auth != null;
      
      // Only admin users can create/update/delete (requires custom claim)
      allow create, update, delete: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

### For Admin Control (Using Custom Claims)

1. **Set custom claims for admin users:**

```javascript
// In your backend/admin function (Firebase Admin SDK)
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Admin claim set for user");
  });
```

2. **Use in rules:**

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blogs Collection
    match /blogs/{blogId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && (resource.data.authorId == request.auth.uid 
            || request.auth.token.admin == true);
    }
  }
}
```

---

## Step-by-Step Fix

### 1. Verify Authentication is Working
```bash
# Run the debug test
# Check: "Authentication: ✅ PASS"
```

### 2. Check Firestore Rules
```bash
# Go to Firebase Console → Firestore Database → Rules
# Verify "blogs" collection has appropriate rules
```

### 3. Verify Collection Name in Firestore
```bash
# Go to Firebase Console → Firestore Database → Data
# Confirm collection is named exactly "blogs" (lowercase)
```

### 4. Test Individual Operations
```javascript
// In browser console:
import { testFirestoreConnection } from "@/services/blogService";
await testFirestoreConnection();

// Should show results for each operation
```

### 5. Check Network Tab
- Open DevTools → Network tab
- Look for Firestore API calls
- Check for 403 (Forbidden) errors
- Read error details in response

---

## Enhanced Error Messages

The updated blogService now returns readable errors instead of raw Firestore errors:

| Error Code | What It Means | How to Fix |
|-----------|--------------|-----------|
| `permission-denied` | Rules don't allow the operation | Update Firestore security rules |
| `unauthenticated` | User is not logged in | User must log in first |
| `not-found` | Document/collection doesn't exist | Verify collection name and document ID |
| `already-exists` | Document ID already exists | Use a different document ID |
| `invalid-argument` | Bad data sent to Firestore | Check data types and field names |

---

## Common Issues & Solutions

### Issue: "Permission denied" when creating blogs
**Solution:** Update rules to allow authenticated users to write to blogs collection

### Issue: "User must be authenticated" message appears
**Solution:** Make sure user logs in before trying to create/read blogs

### Issue: Rules updated but error still occurs
**Solution:** 
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Clear browser cache
- Check auth token is still valid (sometimes expires)

### Issue: Different errors for different users
**Solution:** Check if rules use custom claims or compare with authorId

---

## Testing Checklist

- [ ] Run `await debugFirestore()` in console
- [ ] Confirm "✅ User is authenticated"
- [ ] Confirm "✅ Successfully read 'blogs' collection"
- [ ] Create a test blog and check console logs
- [ ] Look for `[createBlog] Document created successfully`
- [ ] Check Firebase Console → Firestore → Data for new document
- [ ] Refresh page and check if blogs load in the list
- [ ] Test update and delete operations

---

## References

- [Firebase Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com)
