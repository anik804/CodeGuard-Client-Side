import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input"; // Shadcn Input
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "./ui/button";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Registration Data:", data);
    // এখানে API call করতে পারো
    alert(JSON.stringify(data));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/TxBhXYq4/c1-DYNu0y-B7.webp')",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <div className="flex flex-col items-center mb-6">
          {/* Top section with image left and text right */}
          <div className="flex items-center mb-2">
            <img
              src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
              alt="Logo"
              className="w-10 h-10 mr-3"
            />
            <h1 className="text-2xl font-bold">IIUC</h1>
          </div>

          {/* Bottom section, center aligned */}
          <p className="text-sm text-gray-500 text-center">
            CodeGuard - Secure Lab Exam
          </p>
          <p className="my-2 font-medium text-center">Register</p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Student ID */}
        <div className="mb-4">
          <Input
            {...register("studentId", { required: "Student ID is required" })}
            placeholder="Student ID"
          />
          {errors.studentId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.studentId.message}
            </p>
          )}
        </div>

        {/* Section */}
        <div className="mb-4">
          <Input
            {...register("section", { required: "Section is required" })}
            placeholder="Section"
          />
          {errors.section && (
            <p className="text-red-500 text-sm mt-1">
              {errors.section.message}
            </p>
          )}
        </div>

        {/* Semester */}
        <div className="mb-4">
          <Input
            {...register("semester", { required: "Semester is required" })}
            placeholder="Semester"
          />
          {errors.semester && (
            <p className="text-red-500 text-sm mt-1">
              {errors.semester.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4 w-full">
          <label className="block mb-1 font-medium">I am a:</label>
          <select
            {...register("role", { required: "Please select a role" })}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            defaultValue="student"
          >
            <option value="student">Student</option>
            <option value="examiner">Examiner</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <Input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          REGISTER
        </Button>

        {/* Login redirect */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
