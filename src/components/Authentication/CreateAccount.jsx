import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { RiFacebookFill, RiGoogleFill } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { TranslateContextData } from "../../context/TranslateContext";
import {
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore
import { toast } from "sonner";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const required = [
    { regex: /.{8,}/, message: "Password must be at least 8 characters long." },
    { regex: /[0-9]/, message: "Password must contain at least one number." },
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
    { regex: /[a-z]/, message: "Password must contain at least one lowercase letter." },
    { regex: /[^A-Za-z0-9]/, message: "Password must contain at least one special character." }
];

export default function CreateAccount() {
    const { setUser } = useContext(TranslateContextData);
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore(); // Firestore instance
    const [typePassword, setTypePassword] = useState("password");
    const [confirmTypePassword, setConfirmTypePassword] = useState("password");

    // State for form inputs
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false, // Initialize termsAccepted to false
    });

    const [error, setError] = useState("");

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value, // Ensure checkbox updates correctly
        });
    };

    const validatePassword = (password) => {
        for (let rule of required) {
            if (!rule.regex.test(password)) return rule.message;
        }
        return null;
    };

    // Validation function
    const validateForm = () => {
        const { FirstName, LastName, email, password, confirmPassword, termsAccepted } = formData;
        if (!FirstName.trim() || !LastName.trim()) return "First and Last Name are required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
        const passwordError = validatePassword(password);
        if (passwordError) return passwordError;
        if (password !== confirmPassword) return "Passwords do not match.";
        if (!termsAccepted) return "You must accept the Terms and Conditions.";
        return null;
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            setUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            });

            navigate("/translator");
            toast.success("Logged in with Google!");
        } catch (error) {
            toast.error("Google login failed!");
        }
    };

    // Handle Facebook login
    const handleFacebookLogin = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            setUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            });

            navigate("/translator");
            toast.success("Logged in with Facebook!");
        } catch (error) {
            toast.error("Facebook login failed!");
        }
    };

    // Handle form submission
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const { FirstName, LastName, email, password } = formData;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Firebase Auth profile (Only for display purposes)
            await updateProfile(user, {
                displayName: `${FirstName} ${LastName}`,
            });

            // Save FirstName and LastName separately in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                FirstName,
                LastName,
                email,
            });

            setUser({
                uid: user.uid,
                FirstName,
                LastName,
                email: user.email,
            });

            navigate("/");
            toast.success("Account created successfully! Please log in.");
        } catch (err) {
            toast.error("Error: Email already in use or invalid details.");
        }
    };

    const handleShow_hide_password1 = (type) => {
        if (type === "password") {
            setTypePassword("text");
        }
        else if (type === "text") {
            setTypePassword("password");
        }
    }

    const handleShow_hide_password2 = (type) => {
        if (type === "password") {
            setConfirmTypePassword("text");
        }
        else if (type === "text") {
            setConfirmTypePassword("password");
        }
    }

    return (
        <div className="max-w-sm mx-auto my-12">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Account</CardTitle>
                    <CardDescription>Sign up with Google or Facebook</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateAccount}>
                        <div className="grid gap-3">
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="w-full" onClick={handleFacebookLogin}>
                                    <RiFacebookFill color="blue" />
                                    Login with Facebook
                                </Button>
                                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                    <RiGoogleFill color="red" />
                                    Login with Google
                                </Button>
                            </div>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="FirstName">First Name</Label>
                                <Input
                                    type="text"
                                    name="FirstName"
                                    placeholder="First Name"
                                    value={formData.FirstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="LastName">Last Name</Label>
                                <Input
                                    type="text"
                                    name="LastName"
                                    placeholder="Last Name"
                                    value={formData.LastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        type={typePassword}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="absolute right-4 cursor-pointer">
                                        {
                                            typePassword === "password" ?
                                                <IoEyeOutline size={20} onClick={() => handleShow_hide_password1("password")} />
                                                : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password1("text")} />
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Confirm Password</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        type={confirmTypePassword}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="absolute right-4 cursor-pointer">
                                        {
                                            confirmTypePassword === "password" ?
                                                <IoEyeOutline size={20} onClick={() => handleShow_hide_password2("password")} />
                                                : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password2("text")} />
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted} // Make sure checkbox is controlled
                                    onClick={() => setFormData((prevState) => ({
                                        ...prevState,
                                        termsAccepted: !prevState.termsAccepted // Toggle the checkbox state
                                    }))}
                                />
                                <Label htmlFor="terms">
                                    I accept the <Link to="" className="text-blue-800">Terms and Conditions</Link>
                                </Label>
                            </div>
                            {error && <p className="text-red-500 text-sm p-2 rounded bg-accent">{error}</p>}
                            <Button
                                type="submit"
                                variant="blue"
                                className="w-full"
                                disabled={
                                    !formData.FirstName ||
                                    !formData.LastName ||
                                    !formData.email ||
                                    !formData.password ||
                                    !formData.confirmPassword ||
                                    !formData.termsAccepted
                                }
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
