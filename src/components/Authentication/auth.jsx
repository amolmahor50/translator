import { auth, googleProvider, doc, getDoc, firebaseStore } from "../../lib/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { toast } from "sonner";

// Get user data from localStorage
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Save the additional profile data to localStorage
export const saveUserProfile = (user, additionalInfo) => {
    const finalData = {
        uid: user?.uid,
        email: user?.email,
        firstName: additionalInfo?.firstName || user?.displayName?.split(" ")[0] || "",
        lastName: additionalInfo?.lastName || user?.displayName?.split(" ")[1] || "",
        photo: additionalInfo?.photo || user?.photoURL || "",
        mobile: additionalInfo?.mobile || "",
        address: additionalInfo?.address || "",
        gender: additionalInfo?.gender || "",
        dateOfBirth: additionalInfo?.dateOfBirth || "",
    };

    localStorage.setItem("user", JSON.stringify(finalData));
};

// Login with Google
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (user?.uid) {
            const userRef = doc(firebaseStore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            const additionalInfo = userDoc.exists()
                ? userDoc.data()
                : {
                    mobile: "",
                    address: "",
                    gender: "",
                    dateOfBirth: "",
                };

            saveUserProfile(user, additionalInfo);
            toast("Login Successfully!", { action: { label: "Close" } });
        }
    } catch (error) {
        console.error("Google Login Error:", error.message);
        toast("Please enter correct info.", { action: { label: "Close" } });
    }
};

// Login with Email and Password
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user?.uid) {
            const userRef = doc(firebaseStore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            const additionalInfo = userDoc.exists() ?
                userDoc.data()
                :
                {
                    mobile: "",
                    address: "",
                    gender: "",
                    dateOfBirth: ""
                };

            saveUserProfile(user, additionalInfo);
            toast("Login Successfully!", { action: { label: "Close" } });
        }
    } catch (error) {
        console.error("email and password login error:", error.message);
        toast("Please Put Your correct Password and Gmail.", {
            action: {
                label: "Close"
            }
        });
    }
};

// Logout account
export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("user"); // Remove user data from localStorage

        toast("Logged out successfully!", {
            action: {
                label: "Close"
            }
        });
    } catch (error) {
        console.error("Error during logout:", error.message);
        toast("Logout failed! Please try again.", {
            action: {
                label: "Close"
            }
        });
    }
};

// Send Password Reset Email
export const sendVerificationLink = async (auth, email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        toast("Check your email and reset password. Please check your inbox.", {
            action: {
                label: "Close"
            }
        });
    } catch (error) {
        console.error("Error sending email:", error.message);
        toast(error.message, {
            action: {
                label: "Close"
            }
        });
    }
};
