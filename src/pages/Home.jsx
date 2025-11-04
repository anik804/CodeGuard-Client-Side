import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HomeChart from "../pages/Home Components/HomeChart";
import {
  Shield,
  Users,
  BarChart3,
  MonitorCheck,
  Lock,
  CheckCircle,
} from "lucide-react";
import ScrollToTopButton from "./Home Components/ScrollToTopButton";

const Home = () => {
  // Keep the animated heading style as before
  const animatedHeading = {
    background: "linear-gradient(90deg, #6366f1, #ec4899, #9333ea)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientAnimation 8s linear infinite",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('https://i.ibb.co/TxBhXYq4/c1-DYNu0y-B7.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <motion.div
          className="relative z-10 max-w-3xl px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6"
            style={animatedHeading}
          >
            Welcome to <span className="font-extrabold">CodeGuard</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            A next-gen screen monitoring solution for online exams. Share your
            screen in real-time, prevent cheating, and ensure a fair,
            transparent testing environment.
          </motion.p>

          <motion.button
            className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg"
            whileHover={{
              scale: 1.1,
              backgroundColor: "#9333ea",
              boxShadow: "0px 15px 25px rgba(147, 51, 234, 0.5)",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute top-10 left-10 w-16 h-16 bg-indigo-500/40 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500/40 rounded-full blur-2xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={animatedHeading}
            >
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, secure, and efficient exam monitoring in three easy steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Users,
                step: "01",
                title: "Create & Join",
                description:
                  "Examiners create exam rooms. Students join using unique room IDs.",
                bg: "from-indigo-400 via-purple-400 to-pink-400",
              },
              {
                icon: MonitorCheck,
                step: "02",
                title: "Screen Share",
                description:
                  "Real-time screen monitoring ensures transparency during exams.",
                bg: "from-pink-400 via-red-400 to-yellow-400",
              },
              {
                icon: BarChart3,
                step: "03",
                title: "Track & Analyze",
                description:
                  "Monitor activities, detect anomalies, and generate reports.",
                bg: "from-green-400 via-teal-400 to-blue-400",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative rounded-3xl p-8 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-lg bg-gradient-to-br ${item.bg}`}
              >
                <div className="absolute inset-0 bg-black/20 z-0 rounded-3xl"></div>

                <div className="absolute -top-6 left-8 bg-white/20 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                  {item.step}
                </div>

                <div className="mt-10 mb-4 relative z-10 p-4 bg-white/20 rounded-xl inline-block shadow-md">
                  <item.icon className="w-12 h-12 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-white relative z-10">
                  {item.title}
                </h3>
                <p className="text-white/90 relative z-10 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={animatedHeading}
            >
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for secure and efficient exam monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Advanced Security",
                description: "End-to-end encryption and secure authentication",
                bg: "from-indigo-400 via-blue-400 to-purple-400",
              },
              {
                icon: Lock,
                title: "Anti-Cheat Detection",
                description:
                  "AI-powered monitoring detects suspicious activities",
                bg: "from-red-400 via-pink-400 to-yellow-400",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Separate dashboards for students and examiners",
                bg: "from-green-400 via-teal-400 to-blue-400",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Live monitoring and comprehensive reports",
                bg: "from-purple-400 via-pink-400 to-indigo-400",
              },
              {
                icon: CheckCircle,
                title: "Easy Setup",
                description: "Get started in minutes with intuitive interface",
                bg: "from-yellow-400 via-orange-400 to-pink-400",
              },
              {
                icon: MonitorCheck,
                title: "Screen Sharing",
                description:
                  "Record sessions for later review and verification",
                bg: "from-teal-400 via-cyan-400 to-blue-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`relative rounded-xl p-6 shadow-lg overflow-hidden transition-all duration-300 bg-gradient-to-br ${feature.bg}`}
              >
                <div className="absolute inset-0 bg-black/20 z-0 rounded-xl"></div>
                <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white relative z-10">
                  {feature.title}
                </h3>
                <p className="text-white/90 text-sm relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <HomeChart />

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground" style={animatedHeading}>
            Ready to Secure Your Exams?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join hundreds of institutions using CodeGuard for fair and
            transparent examinations
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-xl bg-white text-primary font-bold shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section> */}
      {/* CTA Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://i.ibb.co.com/3yVwv2Rd/robert-bye-Cyv-K-Z2p-YXg-unsplash.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={animatedHeading}
          >
            Ready to Secure Your Exams?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of institutions using CodeGuard for fair and
            transparent examinations
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-4 rounded-xl bg-white text-indigo-600 font-bold shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>
      <ScrollToTopButton></ScrollToTopButton>
    </div>
  );
};

export default Home;
