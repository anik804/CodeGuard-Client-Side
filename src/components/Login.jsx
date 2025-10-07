import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthContext } from "../provider/AuthProvider";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const { createUser, signInUser } = useContext(AuthContext);

  const {
    register: loginRegister,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm();

  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: regErrors },
    reset: resetRegister,
  } = useForm();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    resetRegister();
  };

  const onRegister = async (data) => {
    try {
      const { email, password } = data;

      // Firebase registration
      const firebaseUser = await createUser(email, password);

      // Backend registration
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role, firebaseUid: firebaseUser.uid }),
      });

      const result = await res.json();
      if (result.inserted) {
        toast.success("Registration successful! Please login.");
        setActiveTab("login");
        resetRegister();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed!");
    }
  };

  const onLogin = async (data) => {
    try {
      let bodyData = { role, password: data.password };

      if (role === "student") {
        bodyData.studentId = data.studentId;
      } else if (role === "examiner") {
        bodyData.username = data.username;
      }

      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        if (role === "student") navigate("/student-join");
        else if (role === "examiner") navigate("/examiner-dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://i.ibb.co/TxBhXYq4/c1-DYNu0y-B7.webp')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex flex-col md:flex-row w-[800px] overflow-hidden">
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8">
          <img
            src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
            alt="IIUC Logo"
            className="w-24 mb-4"
          />
          <h1 className="text-2xl font-bold">IIUC</h1>
          <p className="text-gray-600 text-sm mt-2">
            CodeGuard - Secure Lab Exam
          </p>
          <div className="mt-8 flex gap-4">
            <button
              className={`px-4 py-2 font-medium rounded-md ${
                activeTab === "login"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-md ${
                activeTab === "register"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <AnimatePresence mode="wait">
            {/* ---------- LOGIN ---------- */}
            {activeTab === "login" && (
              <motion.form
                key="login"
                onSubmit={handleLogin(onLogin)}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex gap-4 justify-center mb-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-medium ${
                      role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-medium ${
                      role === "examiner"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setRole("examiner")}
                  >
                    Examiner
                  </button>
                </div>

                {role === "student" && (
                  <Input
                    {...loginRegister("studentId", {
                      required: "Student ID required",
                    })}
                    placeholder="Student ID (e.g. C231109)"
                  />
                )}
                {role === "examiner" && (
                  <Input
                    {...loginRegister("username", {
                      required: "Username required",
                    })}
                    placeholder="Username"
                  />
                )}

                <Input
                  type="password"
                  {...loginRegister("password", {
                    required: "Password required",
                  })}
                  placeholder="Password"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm">
                    {loginErrors.password.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  LOGIN
                </Button>
              </motion.form>
            )}

            {activeTab === "register" && (
              <motion.form
                key="register"
                onSubmit={handleRegister(onRegister)}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex gap-4 justify-center mb-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-medium ${
                      role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handleRoleChange("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-medium ${
                      role === "examiner"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handleRoleChange("examiner")}
                  >
                    Examiner
                  </button>
                </div>

                {role === "examiner" && (
                  <Input
                    {...regRegister("username", {
                      required: "Username required",
                    })}
                    placeholder="Username"
                  />
                )}

                <Input
                  {...regRegister("name", { required: "Full Name required" })}
                  placeholder="Full Name"
                />
                <Input
                  {...regRegister("email", { required: "Email required" })}
                  type="email"
                  placeholder="Email"
                />
                <Input
                  {...regRegister("password", {
                    required: "Password required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  type="password"
                  placeholder="Password"
                />

                {role === "student" && (
                  <>
                    <Input
                      {...regRegister("studentId", {
                        required: "Student ID required",
                      })}
                      placeholder="Student ID (e.g. C231109)"
                    />
                    <Input
                      {...regRegister("section", {
                        required: "Section required",
                      })}
                      placeholder="Section"
                    />
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  REGISTER
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
