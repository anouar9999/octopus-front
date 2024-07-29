import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { loginUser } from "./store"; // Update the path accordingly
import { Eye, EyeOff } from "lucide-react";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const router = useRouter();

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedRememberMe === "true") {
      setRememberMe(true);
      setValue("email", storedEmail);
      setValue("password", storedPassword);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const { email, password, rememberMe } = data;
    const resultAction = await dispatch(loginUser({ email, password }));
    console.log(resultAction);

    if (loginUser.fulfilled.match(resultAction)) {
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      if (resultAction.payload.user.is_admin) {
        router.push("/clients");
      } else {
        router.push("/portals");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Textinput
          name="email"
          label="email"
          placeholder="Email"
          type="email"
          register={register("email", {
            required: "email is required",
          })}
          error={errors?.email}
        />
        <div className="relative">
          <Textinput
            name="password"
            label="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            register={register("password", {
              required: "password is required",
            })}
            error={errors.password}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-[38px] text-gray-500 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            {...register("rememberMe")}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm font-semibold leading-5 text-gray-900">
            Remember me
          </label>
        </div>
        <button className="btn btn-dark font-Inter block w-full text-center">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;