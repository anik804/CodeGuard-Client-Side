import { motion } from "framer-motion";
import { Shield, Zap, Lock, ArrowDown } from "lucide-react";
import {
  GradientText,
  AnimatedText,
  ParticleBackground,
  GradientBackground,
  AnimatedButton,
  AnimatedBadge,
  StaggerContainer,
  StaggerItem,
  GlowEffect,
} from "../../components/react-bits";

const HeroSection = () => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: `url('https://i.ibb.co/TxBhXYq4/c1-DYNu0y-B7.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* React Bits: Gradient Background */}
      <GradientBackground
        gradients={[
          "from-indigo-900/80 via-purple-900/70 to-pink-900/80",
          "from-blue-900/60 via-cyan-900/60 to-teal-900/60",
        ]}
        animate={true}
      />
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* React Bits: Particle Background */}
      <ParticleBackground
        count={80}
        colors={[
          "rgba(99, 102, 241, 0.5)",
          "rgba(236, 72, 153, 0.5)",
          "rgba(147, 51, 234, 0.5)",
          "rgba(59, 130, 246, 0.4)",
        ]}
        sizeRange={[3, 8]}
        speedRange={[15, 50]}
      />

      {/* React Bits: Stagger Container */}
      <StaggerContainer
        className="relative z-10 max-w-6xl px-4 sm:px-6 lg:px-8"
        staggerDelay={0.15}
        initialDelay={0.3}
      >
        {/* React Bits: Animated Badge */}
        <StaggerItem variant="scale" className="mb-8">
          <AnimatedBadge
            icon={Shield}
            variant="outline"
            size="md"
            delay={0.2}
          >
            Trusted by 500+ Institutions Worldwide
          </AnimatedBadge>
        </StaggerItem>

        {/* React Bits: Gradient Text Heading */}
        <StaggerItem variant="fadeUp" className="mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold leading-tight">
            <div className="block mb-2">
              <AnimatedText
                text="Welcome to"
                type="fadeIn"
                delay={0.4}
                className="text-white/90"
              />
            </div>
            <div className="block">
              <GradientText
                gradient="from-indigo-300 via-purple-300 to-pink-300"
                size="text-5xl sm:text-6xl md:text-7xl lg:text-6xl"
                animate={true}
              >
                CodeGuard
              </GradientText>
            </div>
          </h1>
        </StaggerItem>

        {/* React Bits: Animated Text Subtitle */}
        <StaggerItem variant="fadeUp" className="mb-12">
          <AnimatedText
            text="A next-gen screen monitoring solution for online exams. Share your screen in real-time, prevent cheating, and ensure a fair, transparent testing environment."
            type="word"
            delay={0.6}
            stagger={0.05}
            className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed"
          />
        </StaggerItem>

        {/* React Bits: Animated Buttons */}
        <StaggerItem variant="fadeUp" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <GlowEffect color="indigo" intensity="high">
            <AnimatedButton
              variant="gradient"
              size="lg"
              iconPosition="right"
            >
              Get Started
            </AnimatedButton>
          </GlowEffect>
          <AnimatedButton variant="secondary" size="lg">
            Learn More
          </AnimatedButton>
        </StaggerItem>

        {/* React Bits: Feature Pills with Animated Badges */}
        <StaggerItem variant="fadeUp" className="flex flex-wrap items-center justify-center gap-4">
          {[
            { icon: Zap, text: "Real-time Monitoring" },
            { icon: Shield, text: "Advanced Security" },
            { icon: Lock, text: "Anti-Cheat System" },
          ].map((feature, index) => (
            <AnimatedBadge
              key={index}
              icon={feature.icon}
              variant="outline"
              size="sm"
              delay={0.8 + index * 0.1}
              className="text-white/80 border-white/20 bg-white/5"
            >
              {feature.text}
            </AnimatedBadge>
          ))}
        </StaggerItem>
      </StaggerContainer>

      {/* Scroll indicator with React Bits animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 backdrop-blur-sm bg-white/5"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;


