/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
import { useLoginMutation } from "../../../redux/Features/Auth/authApi";
import { setUser } from "../../../redux/Features/Auth/authSlice";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import PasswordInput from "../../../components/Reusable/PasswordInput/PasswordInput";
import Button from "../../../components/Reusable/Button/Button";
import { ICONS } from "../../../assets";
import { FiHelpCircle } from "react-icons/fi";

type TFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSigIn = async (data: TFormData) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      const res = await login(payload).unwrap();
      if (res?.success) {
        dispatch(
          setUser({ user: res?.data?.user, token: res?.data?.accessToken }),
        );
      }
      if (res?.data?.user?.role === "admin") {
        navigate("/dashboard/admin/home");
      } else if (res?.data?.user?.role === "staff") {
        navigate("/dashboard/staff/leads");
      } else {
        navigate("/");
      }
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Helpdesk Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary-10/10 px-4 py-2 rounded-full">
            <FiHelpCircle className="text-primary-10" size={16} />
            <span className="text-primary-10 text-sm font-medium">
              Helpdesk | PRTech Solutions
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form */}
          <form
            onSubmit={handleSubmit(handleSigIn)}
            className="px-6 py-8 space-y-5"
          >
            {/* Email Field */}
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />

            {/* Password Field */}
            <PasswordInput
              label="PAssword"
              placeholder="Enter your password"
              error={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              label="Sign In"
              variant="primary"
              iconWithoutBg={ICONS.topRightArrowWhite}
              className="py-2.5 w-full flex items-center justify-center"
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              Need help? Contact support at{" "}
              <a
                href="mailto:support@prtech.com"
                className="text-primary-10 hover:underline"
              >
                support@prtech.com
              </a>
            </p>
          </div>
        </div>

        {/* Help Desk Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PRTech Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
