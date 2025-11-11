import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthContext } from "../provider/AuthProvider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole === "examiner") navigate("/examiner-dashboard", { replace: true });
    if (storedRole === "student") navigate("/student-dashboard", { replace: true });
  }, [navigate]);

  const onRegister = async (data) => {
    try {
      const { email, password } = data;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        toast.error("Please use a verified Google email (e.g., yourname@gmail.com)");
        return;
      }

      try {
        const checkRes = await fetch(`https://dns.google/resolve?name=gmail.com&type=MX`);
        const checkData = await checkRes.json();
        if (!checkData || !checkData.Answer || checkData.Answer.length === 0) {
          toast.error("Unable to verify Google email. Try again.");
          return;
        }
      } catch { }

      const firebaseUser = await createUser(email, password);

      const res = await fetch("https://codeguard-server-side-1.onrender.com/api/auth/register", {
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
        toast.error(result.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed! Try again.");
    }
  };

  const onLogin = async (data) => {
    try {
      let bodyData = { role, password: data.password };
      if (role === "student") bodyData.studentId = data.studentId;
      else if (role === "examiner") bodyData.username = data.username;

      const res = await fetch("https://codeguard-server-side-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();

      // if (res.ok) {
      //   toast.success("Login successful!");
      //   if (role === "student") {
      //     sessionStorage.setItem("role", "student");
      //     sessionStorage.setItem("studentId", data.studentId);
      //     sessionStorage.setItem("studentName", result.user?.name || result.user?.studentId || "Student");
      //     navigate("/student-dashboard", { replace: true });
      //   } else if (role === "examiner") {
      //     sessionStorage.setItem("role", "examiner");
      //     sessionStorage.setItem("username", data.username);
      //     sessionStorage.setItem("examinerName", result.user?.name || result.user?.username || "Examiner");
      //     navigate("/examiner-dashboard", { replace: true });
      //   }
      // }
      if (res.ok) {
        toast.success("Login successful!");

        if (role === "student") {
          sessionStorage.setItem("role", "student");
          sessionStorage.setItem("studentId", result.user.studentId); // dynamic
          sessionStorage.setItem("studentName", result.user.name || result.user.studentId);
          sessionStorage.setItem("studentEmail", result.user.email || ""); // extra
          navigate("/student-dashboard", { replace: true });
        } else if (role === "examiner") {
          sessionStorage.setItem("role", "examiner");
          sessionStorage.setItem("username", result.user.username); // dynamic
          sessionStorage.setItem("examinerName", result.user.name || result.user.username);
          sessionStorage.setItem("examinerEmail", result.user.email || ""); // extra
          navigate("/examiner-dashboard", { replace: true });
        }
      }
      else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed! Try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{
        backgroundImage: "url('https://i.ibb.co/TxBhXYq4/c1-DYNu0y-B7.webp')",
      }}
    >
      {/* Faded Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-6 sm:p-8">
          <img
            src="https://i.ibb.co/MDQ3jcf4/Png-Item-5916871.png"
            alt="IIUC Logo"
            className="w-20 sm:w-24 mb-3 sm:mb-4"
          />
          <h1 className="text-xl sm:text-2xl font-bold">IIUC</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 text-center">CodeGuard - Secure Lab Exam</p>

          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              className={`px-3 sm:px-4 py-2 font-medium rounded-md ${activeTab === "login" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`px-3 sm:px-4 py-2 font-medium rounded-md ${activeTab === "register" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <AnimatePresence mode="wait">
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
                <div className="flex gap-3 sm:gap-4 justify-center mb-4 flex-wrap">
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium ${role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium ${role === "examiner"
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
                  <p className="text-red-500 text-sm">{loginErrors.password.message}</p>
                )}

                <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
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
                <div className="flex gap-3 sm:gap-4 justify-center mb-4 flex-wrap">
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium ${role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                    onClick={() => handleRoleChange("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium ${role === "examiner"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                    onClick={() => handleRoleChange("examiner")}
                  >
                    Examiner
                  </button>
                </div>

                {role === "examiner" && (
                  <>
                    <Input
                      {...regRegister("username", { required: "Username required" })}
                      placeholder="Username"
                    />
                    <Input
                      {...regRegister("designation", { required: "Designation required" })}
                      placeholder="Designation"
                    />
                  </>
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
                      {...regRegister("studentId", { required: "Student ID required" })}
                      placeholder="Student ID (e.g. C231109)"
                    />
                    <Input
                      {...regRegister("section", { required: "Section required" })}
                      placeholder="Section"
                    />
                  </>
                )}

                <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
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
