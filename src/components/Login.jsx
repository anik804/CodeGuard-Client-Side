import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input"; // Shadcn input
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner"; // Import toast

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // ✅ API call
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // ✅ Success
        toast.success("Login successful!");
        // Optional: save token if backend returns
        localStorage.setItem("token", result.token);
        // Redirect to dashboard or home
        navigate("/dashboard");
      } else {
        // ✅ Error
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
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
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <img
              src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
              alt="Logo"
              className="w-10 h-10 mr-3"
            />
            <h1 className="text-2xl font-bold">IIUC</h1>
          </div>
          <p className="text-sm text-gray-500 text-center">
            CodeGuard - Secure Lab Exam
          </p>
          <p className="my-5 font-medium text-center">Welcome</p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <Input
            {...register("username", { required: "Username is required" })}
            placeholder="Username / ID"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
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
          LOGIN
        </Button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}






// import React from "react";
// import { useForm } from "react-hook-form";
// import { Input } from "./ui/input"; // Shadcn input
// import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
// import { Button } from "./ui/button";

// export default function LoginForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log("Form Data:", data);
//     // এখানে API call করতে পারো
//     alert(JSON.stringify(data));
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundImage:
//           "url('https://i.ibb.co.com/TxBhXYq4/c1-DYNu0y-B7.webp')",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-8 rounded-xl shadow-lg w-96"
//       >
//         <div className="flex flex-col items-center">
//           {/* Top section with image left and text right */}
//           <div className="flex items-center mb-2">
//             <img
//               src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
//               alt="Logo"
//               className="w-10 h-10 mr-3"
//             />
//             <h1 className="text-2xl font-bold">IIUC</h1>
//           </div>

//           {/* Bottom section, center aligned */}
//           <p className="text-sm text-gray-500 text-center">
//             CodeGuard - Secure Lab Exam
//           </p>
//           <p className="my-5 font-medium text-center">Welcome</p>
//         </div>

//         {/* Username */}
//         <div className="mb-4">
//           <Input
//             {...register("username", { required: "Username is required" })}
//             placeholder="Username / ID"
//           />
//           {errors.username && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.username.message}
//             </p>
//           )}
//         </div>

//         {/* Password */}
//         <div className="mb-4">
//           <Input
//             type="password"
//             {...register("password", { required: "Password is required" })}
//             placeholder="Password"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         {/* Role */}
//         {/* <div className="mb-6">
//           <label className="block mb-1 font-medium">I am a:</label>
//           <RadioGroup
//             className="flex gap-4"
//             defaultValue="student"
//             {...register("role")}
//           >
//             <div className="flex items-center gap-1">
//               <RadioGroupItem value="student" id="student" />
//               <label htmlFor="student">Student</label>
//             </div>
//             <div className="flex items-center gap-1">
//               <RadioGroupItem value="examiner" id="examiner" />
//               <label htmlFor="examiner">Examiner</label>
//             </div>
//           </RadioGroup>
//         </div> */}

//         <Button type="submit" className="w-full">
//           LOGIN
//         </Button>

//         {/* Error message */}
//         {/* এইটা API response অনুযায়ী conditionally দেখাবে */}
//         {/* <p className="text-red-600 mt-2 text-center">Invalid credentials. Please try again</p> */}

//         {/* Register redirect */}
//         <p className="mt-4 text-sm text-center text-gray-600">
//           Don't have an account?{" "}
//           <a
//             href="/auth/register"
//             className="text-blue-500 hover:underline font-medium"
//           >
//             Register here
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
