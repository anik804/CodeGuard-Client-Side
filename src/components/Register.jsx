import React from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUser, setUser } = React.useContext(AuthContext);

  const onSubmit = (data) => {
    const { name, roll, section, email, role, password } = data;
    toast.success("Registration successful!");

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        updateUser({ displayName: name })
          .then(() => {
            const updatedUser = { ...user, displayName: name };
            setUser(updatedUser);

            const saveUser = { name, roll, section, email, role };
            fetch("http://localhost:3000/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(saveUser),
            })
              .then((res) => res.json())
              .then(() => {
                toast.success("Registered successfully!");
              });
          })
          .catch((err) => toast.error(err.message));
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/TxBhXYq4/c1-DYNu0y-B7.webp')",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg flex w-[900px] overflow-hidden">
        {/* Left side with logo */}
        <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8">
          <img
            src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
            alt="IIUC Logo"
            className="w-24 mb-4"
          />
          <h1 className="text-2xl font-bold">IIUC</h1>
          <p className="text-gray-600 text-sm mt-2">
            CodeGuard - Secure Lab Exam
          </p>
          <h2 className="text-lg font-semibold mt-4">Welcome</h2>
        </div>

        {/* Right side with form */}
        <div className="w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            {/* Roll */}
            <div>
              <input
                type="text"
                {...register("roll", { required: "Roll is required" })}
                placeholder="Roll"
                className="input input-bordered w-full"
              />
              {errors.roll && (
                <p className="text-red-500 text-sm">{errors.roll.message}</p>
              )}
            </div>
            {/* Section */}
            <div>
              <input
                type="text"
                {...register("section", { required: "Section is required" })}
                placeholder="Section"
                className="input input-bordered w-full"
              />
              {errors.section && (
                <p className="text-red-500 text-sm">{errors.section.message}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {/* Role */}{" "}
            <div className="mb-4 w-full">
              {" "}
              <label className="block mb-1 font-medium">I am a:</label>{" "}
              <select
                {...register("role", { required: "Please select a role" })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                defaultValue="student"
              >
                {" "}
                <option value="student">Student</option>{" "}
                <option value="examiner">Examiner</option>{" "}
              </select>{" "}
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}{" "}
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                placeholder="Password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                placeholder="Confirm Password"
                className="input input-bordered w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Button */}
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
