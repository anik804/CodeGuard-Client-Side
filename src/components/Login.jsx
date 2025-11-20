// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { AuthContext } from "../provider/AuthProvider";
import { SquareGrid } from "./react-bits";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("student");
  const [lottieData, setLottieData] = useState(null);
  const navigate = useNavigate();
  const { createUser } = useContext(AuthContext);
  

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

  useEffect(() => {
    fetch("/Login.json")
      .then((res) => res.json())
      .then((data) => setLottieData(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

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
      } catch {
        // Silently continue if DNS check fails
      }

      const firebaseUser = await createUser(email, password);

      const res = await fetch("http://localhost:3000/api/api/auth/register", {
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

      const res = await fetch("http://localhost:3000/api/auth/login", {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-6">
      {/* Square Grid Background */}
      <SquareGrid
        squareColor="rgba(255, 255, 255, 0.15)"
        squareSize={20}
        spacing={40}
        animate={true}
      />

      {/* Logo and Name Header */}
      <div className="relative z-10 mb-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <motion.img
          src={logo}
          alt="CodeGuard logo"
          className="w-10 h-10 drop-shadow-lg"
          style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }}
          whileHover={{ scale: 1.1, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.span
          className="text-2xl font-black bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          CodeGuard
        </motion.span>
      </div>

      <div className="relative z-10 rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left Section with Lottie */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8">
          <div className="w-full max-w-sm h-64 sm:h-80 mb-4">
            {lottieData ? (
              <Lottie
                animationData={lottieData}
                loop={true}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              className={`px-3 sm:px-4 py-2 font-medium rounded-md transition-colors ${activeTab === "login" ? "bg-indigo-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`px-3 sm:px-4 py-2 font-medium rounded-md transition-colors ${activeTab === "register" ? "bg-indigo-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 text-white">
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
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${role === "examiner"
                        ? "bg-indigo-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
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
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${role === "student"
                        ? "bg-indigo-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                    onClick={() => handleRoleChange("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${role === "examiner"
                        ? "bg-indigo-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
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
