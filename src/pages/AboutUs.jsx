import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, ShieldCheck, Network, BookOpen } from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: Laptop,
      title: "Exam Rooms",
      desc: "Examiners can create secure exam rooms and manage students easily.",
      gradient: "from-indigo-100 via-purple-100 to-pink-100",
    },
    {
      icon: Network,
      title: "Live Screen Sharing",
      desc: "Students must share their screen to access and attempt the questions.",
      gradient: "from-blue-100 via-cyan-100 to-teal-100",
    },
    {
      icon: ShieldCheck,
      title: "AI & Website Blocking",
      desc: "Automatically . restricts access to sites like ChatGPT or other AI tools during the exam.",
      gradient: "from-amber-100 via-orange-100 to-red-100",
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
      className="relative min-h-screen py-24 bg-gray-100 overflow-hidden"
    >
      {/* Light Floating Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full opacity-40 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-200 via-rose-200 to-orange-200 rounded-full opacity-40 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <div className="container mx-auto relative z-10">
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
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
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
          {/* Mission Light Card */}
          <Card className="shadow-md border border-gray-200 bg-white hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-900">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Our goal is to revolutionize how university lab exams are conducted. We built a secure 
                and interactive platform where examiners can create exam rooms, upload questions, 
                and monitor students in real-time — all in one place.
              </p>
            </CardContent>
          </Card>

          {/* Vision Light Card */}
          <Card className="shadow-md border border-gray-200 bg-white hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-900">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                We aim to create a fair, AI-free exam environment that supports academic integrity. 
                By implementing screen sharing, restricted websites, and controlled access, 
                we ensure transparency and authenticity in lab exams.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section (Light Gradient Cards) */}
        <motion.div
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 text-center flex flex-col items-center p-6 bg-gradient-to-br ${feature.gradient}`}
            >
              <div className="w-14 h-14 mb-4 rounded-xl bg-white flex items-center justify-center shadow">
                <feature.icon className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.desc}</p>
            </Card>
          ))}
        </motion.div>

        {/* Developers Section */}
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Meet the Developers
          </h2>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto">
            We are a team of three dedicated university students who love building impactful software for education.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={dev.img}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {dev.name}
                </CardTitle>
                <p className="text-gray-600 text-sm">{dev.role}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
