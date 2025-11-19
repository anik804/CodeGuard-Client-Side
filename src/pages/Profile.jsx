
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Building, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [examinerInfo, setExaminerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examinerName, setExaminerName] = useState("");
  const [examinerEmail, setExaminerEmail] = useState("");
  const [examinerUsername, setExaminerUsername] = useState("");

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const name = sessionStorage.getItem("examinerName");
    
    if (name) {
      setExaminerName(name);
    } else if (username) {
      setExaminerName(username);
    }
    
    if (username) {
      setExaminerUsername(username);
      // Fetch examiner details from backend
      fetchExaminerDetails(username);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchExaminerDetails = async (username) => {
    try {
      // You may need to create an endpoint to get examiner details
      // For now, use sessionStorage data
      const name = sessionStorage.getItem("examinerName") || username;
      setExaminerInfo({
        name,
        username,
        email: user?.email || ""
      });
      setExaminerName(name);
      setExaminerEmail(user?.email || "");
    } catch (error) {
      console.error("Failed to fetch examiner details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto space-y-6"
    >
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <h2 className="text-3xl font-bold gradient-text">{examinerName || "Examiner"}</h2>
                  <p className="text-muted-foreground mt-1">
                    {examinerUsername ? `Username: ${examinerUsername}` : "Examiner Account"}
                  </p>
                </>
              )}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Profile Information</CardTitle>
          <CardDescription>Update your personal and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={examinerName.split(' ')[0] || examinerName || ""}
                  onChange={(e) => setExaminerName(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={examinerName.split(' ').slice(1).join(' ') || ""}
                  onChange={(e) => setExaminerName(examinerName.split(' ')[0] + ' ' + e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={examinerEmail || user?.email || ""}
                  onChange={(e) => setExaminerEmail(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  defaultValue="+8801310763509"
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Department and Employee ID */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  Department
                </Label>
                <Input
                  id="department"
                  defaultValue="Computer Science"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">User ID</Label>
                <Input
                  id="employeeId"
                  value={examinerUsername || ""}
                  className="bg-secondary/50"
                  disabled
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Teaching Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground mt-1">Total Students</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground mt-1">Exams Conducted</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


// try 1

// import { motion } from "framer-motion";


// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { User, Mail, Shield, Save, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [examiner, setExaminer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

// //   const username = "irfan54"; // static for now, can be from AuthContext/session

// //   useEffect(() => {
// //   const fetchExaminer = async () => {
// //     try {
// //       const res = await axios.get(`http://localhost:3000/api/examiners/${username}`);
// //       setExaminer(res.data);
// //     } catch (error) {
// //       console.error("Failed to fetch examiner:", error);
// //     }
// //   };
// //   fetchExaminer();
// // }, [username]);

// const username = localStorage.getItem("username");

// useEffect(() => {
//   if (!username) {
//     console.warn("Username not found in localStorage");
//     return;
//   }

//   axios.get(`http://localhost:3000/api/examiners/${username}`)
//     .then(res => setExaminer(res.data))
//     .catch(err => console.error(err));
// }, [username]);




//   const fetchExaminer = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/examiners/${username}`);
//       setExaminer(res.data);
//     } catch (error) {
//       console.error("Failed to fetch examiner:", error);
//       toast.error("Failed to load profile data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await axios.put(`http://localhost:3000/api/examiners/${username}`, {
//         name: examiner.name,
//         email: examiner.email,
//         role: examiner.role,
//       });
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       console.error("Update failed:", error);
//       toast.error("Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[300px]">
//         <Loader2 className="w-6 h-6 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//       {/* Profile Header */}
//       <Card className="glass-card">
//         <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
//           <Avatar className="w-32 h-32 border-4 border-primary/20">
//             <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=examiner" />
//             <AvatarFallback>EX</AvatarFallback>
//           </Avatar>
//           <div className="text-center md:text-left flex-1">
//             <h2 className="text-3xl font-bold gradient-text">{examiner?.name}</h2>
//             <p className="text-muted-foreground mt-1">Username: {examiner?.username}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Profile Details */}
//       <Card className="glass-card">
//         <CardHeader>
//           <CardTitle className="gradient-text">Profile Information</CardTitle>
//           <CardDescription>Update your account details</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="flex items-center gap-2">
//                   <User className="w-4 h-4 text-primary" /> Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   value={examiner.name || ""}
//                   onChange={(e) => setExaminer({ ...examiner, name: e.target.value })}
//                   className="bg-secondary/50"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-2">
//                   <Mail className="w-4 h-4 text-primary" /> Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={examiner.email || ""}
//                   onChange={(e) => setExaminer({ ...examiner, email: e.target.value })}
//                   className="bg-secondary/50"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="role" className="flex items-center gap-2">
//                   <Shield className="w-4 h-4 text-primary" /> Role
//                 </Label>
//                 <Input
//                   id="role"
//                   value={examiner.role || ""}
//                   onChange={(e) => setExaminer({ ...examiner, role: e.target.value })}
//                   className="bg-secondary/50"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input id="username" value={examiner.username || ""} disabled className="bg-secondary/50" />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 disabled={saving}
//                 className={`bg-primary hover:bg-primary/90 text-primary-foreground font-semibold ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
//               >
//                 {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
//                 {saving ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }



// try 2


// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { User, Mail, Shield, Save, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [examiner, setExaminer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const username = sessionStorage.getItem("username"); // examiner
// const email = sessionStorage.getItem("examinerEmail");

// useEffect(() => {
//   if (!username) return; // যদি login না করা থাকে
//   const fetchExaminer = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/examiners/${username}`);
//       setExaminer(res.data);
//     } catch (err) {
//       console.error("Failed to fetch examiner:", err);
//       toast.error("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchExaminer();
// }, [username]);


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setSaving(true);
//   //   try {
//   //     await axios.put(`http://localhost:3000/api/examiners/${email}`, {
//   //       name: examiner.name,
//   //       role: examiner.role,
//   //     });
//   //     toast.success("Profile updated successfully!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to update profile");
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSaving(true);
//   try {
//     await axios.put(`http://localhost:3000/api/examiners/${username}`, {
//       name: examiner.name,
//       email: examiner.email,
//       role: examiner.role,
//     });
//     toast.success("Profile updated successfully!");
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to update profile");
//   } finally {
//     setSaving(false);
//   }
// };


//   if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//       {/* Profile Header */}
//       <Card className="glass-card">
//         <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
//           <Avatar className="w-32 h-32 border-4 border-primary/20">
//             <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=examiner" />
//             <AvatarFallback>EX</AvatarFallback>
//           </Avatar>
//           <div className="text-center md:text-left flex-1">
//             <h2 className="text-3xl font-bold gradient-text">{examiner.name}</h2>
//             <p className="text-muted-foreground mt-1">Username: {examiner.username}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Profile Form */}
//       <Card className="glass-card">
//         <CardHeader>
//           <CardTitle className="gradient-text">Profile Information</CardTitle>
//           <CardDescription>Update your account details</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="flex items-center gap-2">
//                   <User className="w-4 h-4 text-primary" /> Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   value={examiner.name || ""}
//                   onChange={(e) => setExaminer({ ...examiner, name: e.target.value })}
//                   className="bg-secondary/50"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="role" className="flex items-center gap-2">
//                   <Shield className="w-4 h-4 text-primary" /> Role
//                 </Label>
//                 <Input
//                   id="role"
//                   value={examiner.role || ""}
//                   onChange={(e) => setExaminer({ ...examiner, role: e.target.value })}
//                   className="bg-secondary/50"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-2">
//                   <Mail className="w-4 h-4 text-primary" /> Email
//                 </Label>
//                 <Input id="email" value={examiner.email || ""} disabled className="bg-secondary/50" />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input id="username" value={examiner.username || ""} disabled className="bg-secondary/50" />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 disabled={saving}
//                 className={`bg-primary hover:bg-primary/90 text-primary-foreground font-semibold ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
//               >
//                 {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
//                 {saving ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

