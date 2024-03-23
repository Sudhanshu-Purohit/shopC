import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
    const [gender, setGender] = useState("");
    const [date, setDate] = useState("");
    // RTK Query --> login hook
    const [login] = useLoginMutation();

    const signInWithGoogle = async () => {
        if(!gender ||!date) {
            toast.error("please select all the fields");
            return;
        }
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // storing in mongodb database
            const res = await login({ 
                _id: user.uid, 
                name: user.displayName!, 
                email: user.email!, 
                photo: user.photoURL!,
                gender: gender, 
                dob: date, 
                role: "user" 
            });

            if("data" in res) {
                toast.success(res.data.message);
            } else {
                const error = res.error as FetchBaseQueryError;
                const message = error.data as MessageResponse;
                toast.error(message.message);
            }
        } catch (error) {
            toast.error("Sign In Failed")
            console.log(error);
        }
    }

    return (
        <div className="login">
            <main>
                <h1 className="heading"> Login </h1>
                <div>
                    <label> Gender </label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label>Date of birth</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                    <p>Already Signed In Once</p>
                    <button onClick={signInWithGoogle}>
                        <FcGoogle /> <span>Sign in with Google</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login
