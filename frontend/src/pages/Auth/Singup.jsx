import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

import {Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPath";
import { uploadImage } from "../../utils/uploadImages";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();


  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {

    e.preventDefault();
    let profileImgUrl = '';

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // SignUp API Call

try {
  if (profilePic) {
    const imgUploadRes = await uploadImage(profilePic);
    profileImgUrl = imgUploadRes.imgUrl || "";
  }

  const response = await axiosInstance.post(
    API_PATHS.AUTH.REGISTER,
    {
      name: fullName,
      email,
      password,
      profileImgUrl,
      adminInviteToken,
     
    }
  );

  const { token, role } = response.data;

  if (token) {
    localStorage.setItem("token", token);
    updateUser(response.data);

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  }
} catch (error) {
  if (error.response && error.response.data.message) {
    setError(error.response.data.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
}
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        
        <h3 className="text-xl font-semibold text-black">
          Create an Account
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="Full Name"
              className="input-box"
              type="text"
            />

            <input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email Address"
              className="input-box"
              type="text"
            />

            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
              className="input-box"
              type="password"
            />

            <input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder="Admin Invite Token (optional)"
              className="input-box"
              type="text"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>
          )}

          <button type="submit" className="btn-primary mt-4">
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  );
};

export default SignUp;