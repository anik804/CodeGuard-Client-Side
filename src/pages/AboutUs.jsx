import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, ShieldCheck, Network, BookOpen } from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: Laptop,
      title: "Exam Rooms",
      desc: "Examiners can create secure exam rooms and manage students easily.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      icon: Network,
      title: "Live Screen Sharing",
      desc: "Students must share their screen to access and attempt the questions.",
      gradient: "from-blue-500 via-cyan-500 to-teal-400",
    },
    {
      icon: ShieldCheck,
      title: "AI & Website Blocking",
      desc: "Automatically restricts access to sites like ChatGPT or other AI tools during the exam.",
      gradient: "from-amber-500 via-orange-500 to-red-500",
    },
  ];

  const developers = [
    { name: "Anonymous-1", role: "Backend Developer", img: "/c2.png" },
    { name: "Anonymous-2", role: "Backend Developer", img: "/c3.png" },
    { name: "Anonymous-3", role: "Frontend Developer", img: "/c1.png" },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen py-24 bg-black overflow-hidden"
    >
      {/* Floating Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-full opacity-30 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            About Our Platform
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Built by passionate developers to make university lab exams smarter, secure, and seamless.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="animate-gradient shadow-lg border border-transparent hover:scale-105 transition-all duration-500 text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-white" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed">
              <p>
                Our goal is to revolutionize how university lab exams are conducted. We built a secure 
                and interactive platform where examiners can create exam rooms, upload questions, 
                and monitor students in real-time — all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-gradient shadow-lg border border-transparent hover:scale-105 transition-all duration-500 text-white bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-white" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed">
              <p>
                We aim to create a fair, AI-free exam environment that supports academic integrity. 
                By implementing screen sharing, restricted websites, and controlled access, 
                we ensure transparency and authenticity in lab exams.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`animate-gradient shadow-md hover:shadow-xl transition-all duration-500 text-white border border-transparent text-center flex flex-col items-center p-6 bg-gradient-to-br ${feature.gradient}`}
            >
              <div className="w-14 h-14 mb-4 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-md">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.desc}</p>
            </Card>
          ))}
        </motion.div>

        {/* Developers */}
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-white mb-4">
            Meet the Developers
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            We are a team of three dedicated university students who love building 
            impactful software for education.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className="flex flex-col items-center text-center p-6 bg-black shadow-md hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-2 border-white/40">
                  <img
                    src={dev.img}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg font-semibold text-white">
                  {dev.name}
                </CardTitle>
                <p className="text-gray-300 text-sm">{dev.role}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradient Animation CSS */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientBG 5s ease infinite;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
