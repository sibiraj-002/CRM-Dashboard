/**
 * Firestore Debug Utility
 * 
 * Usage in console or component:
 * import { testFirestoreConnection } from "@/lib/firebase/debug";
 * const results = await testFirestoreConnection();
 * 
 * Or add to a page temporarily:
 * useEffect(() => {
 *   if (typeof window !== 'undefined') {
 *     window.testFirestore = testFirestoreConnection;
 *   }
 * }, []);
 * 
 * Then in browser console: await testFirestore()
 */

import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export async function debugFirestoreConnection() {
    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║       FIREBASE FIRESTORE PERMISSION DEBUG TEST        ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");

    const results = {
        timestamp: new Date().toISOString(),
        environment: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        },
        authentication: {
            isAuthenticated: false,
            user: null,
            uid: null,
            email: null,
        },
        firestore: {
            blogsCollection: {
                canRead: false,
                documentCount: null,
                error: null,
            },
            categoriesCollection: {
                canRead: false,
                documentCount: null,
                error: null,
            },
        },
        recommendations: [],
    };

    try {
        // 1. Check Authentication
        console.log("1️⃣  AUTHENTICATION CHECK");
        console.log("─────────────────────────────");

        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log("✅ User is authenticated");
            console.log(`   UID: ${currentUser.uid}`);
            console.log(`   Email: ${currentUser.email}`);
            console.log(`   Display Name: ${currentUser.displayName || "(not set)"}`);
            console.log(`   Email Verified: ${currentUser.emailVerified}`);

            results.authentication.isAuthenticated = true;
            results.authentication.user = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
            };
            results.authentication.uid = currentUser.uid;
            results.authentication.email = currentUser.email;
        } else {
            console.log("❌ No authenticated user found");
            console.log("   → User must be logged in to access Firestore data");
            results.recommendations.push(
                "AUTHENTICATION: User is not logged in. Log in first before testing.",
            );
        }

        // 2. Test Blogs Collection
        console.log("\n2️⃣  BLOGS COLLECTION READ TEST");
        console.log("─────────────────────────────");

        try {
            const blogsRef = collection(db, "blogs");
            const blogsQuery = query(blogsRef);

            console.log("   Attempting to read 'blogs' collection...");
            const blogsSnapshot = await getDocs(blogsQuery);

            console.log(`✅ Successfully read 'blogs' collection`);
            console.log(`   Documents found: ${blogsSnapshot.docs.length}`);

            results.firestore.blogsCollection.canRead = true;
            results.firestore.blogsCollection.documentCount = blogsSnapshot.docs.length;

            if (blogsSnapshot.docs.length > 0) {
                console.log("   Sample document IDs:");
                blogsSnapshot.docs.slice(0, 3).forEach((doc, index) => {
                    console.log(`     ${index + 1}. ${doc.id}`);
                });
            }
        } catch (error) {
            console.log("❌ Failed to read 'blogs' collection");
            console.log(`   Error Code: ${error.code}`);
            console.log(`   Error Message: ${error.message}`);

            results.firestore.blogsCollection.canRead = false;
            results.firestore.blogsCollection.error = {
                code: error.code,
                message: error.message,
            };

            if (
                error.code === "permission-denied" ||
                error.code === "unauthenticated"
            ) {
                results.recommendations.push(
                    "FIRESTORE RULES: Blogs collection rules may not allow read access. Check Firestore security rules.",
                );
            }
        }

        // 3. Test Categories Collection
        console.log("\n3️⃣  CATEGORIES COLLECTION READ TEST");
        console.log("──────────────────────────────────");

        try {
            const categoriesRef = collection(db, "categories");
            const categoriesQuery = query(categoriesRef);

            console.log("   Attempting to read 'categories' collection...");
            const categoriesSnapshot = await getDocs(categoriesQuery);

            console.log(`✅ Successfully read 'categories' collection`);
            console.log(`   Documents found: ${categoriesSnapshot.docs.length}`);

            results.firestore.categoriesCollection.canRead = true;
            results.firestore.categoriesCollection.documentCount =
                categoriesSnapshot.docs.length;
        } catch (error) {
            console.log("❌ Failed to read 'categories' collection");
            console.log(`   Error Code: ${error.code}`);
            console.log(`   Error Message: ${error.message}`);

            results.firestore.categoriesCollection.canRead = false;
            results.firestore.categoriesCollection.error = {
                code: error.code,
                message: error.message,
            };
        }

        // 4. Recommendations
        console.log("\n4️⃣  RECOMMENDATIONS");
        console.log("──────────────────");

        if (results.recommendations.length === 0) {
            console.log("✅ All tests passed! Firestore is configured correctly.");
        } else {
            results.recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        }

        // 5. Summary
        console.log("\n╔════════════════════════════════════════════════════════╗");
        console.log("║                    TEST SUMMARY                        ║");
        console.log("╠════════════════════════════════════════════════════════╣");
        console.log(
            `║ Authentication: ${results.authentication.isAuthenticated ? "✅ PASS" : "❌ FAIL"}`,
        );
        console.log(
            `║ Blogs Read: ${results.firestore.blogsCollection.canRead ? "✅ PASS" : "❌ FAIL"}`,
        );
        console.log(
            `║ Categories Read: ${results.firestore.categoriesCollection.canRead ? "✅ PASS" : "❌ FAIL"}`,
        );
        console.log("╚════════════════════════════════════════════════════════╝\n");

        console.log("Full results object:", results);
        return results;
    } catch (error) {
        console.error("Unexpected error during debug test:", error);
        results.recommendations.push(
            `UNEXPECTED ERROR: ${error.message}`,
        );
        return results;
    }
}

// Export for use in browser window for quick testing
if (typeof window !== "undefined") {
    window.debugFirestore = debugFirestoreConnection;
}
