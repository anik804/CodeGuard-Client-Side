import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Users, TrendingUp } from "lucide-react";
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

const CTASection = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Institutions" },
    { icon: TrendingUp, value: "98%", label: "Satisfaction" },
    { icon: CheckCircle2, value: "1M+", label: "Exams Monitored" },
  ];

  return (
    <section
      id="cta"
      className="relative py-32 overflow-hidden"
      style={{
        backgroundImage: `url('https://i.ibb.co.com/3yVwv2Rd/robert-bye-Cyv-K-Z2p-YXg-unsplash.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* React Bits: Gradient Background */}
      <GradientBackground
        gradients={[
          "from-indigo-900/90 via-purple-900/85 to-pink-900/90",
          "from-blue-900/80 via-cyan-900/80 to-teal-900/80",
        ]}
        animate={true}
      />
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* React Bits: Particle Background */}
      <ParticleBackground
        count={60}
        colors={[
          "rgba(99, 102, 241, 0.6)",
          "rgba(236, 72, 153, 0.6)",
          "rgba(147, 51, 234, 0.6)",
          "rgba(59, 130, 246, 0.5)",
        ]}
        sizeRange={[4, 10]}
        speedRange={[20, 60]}
      />

      {/* React Bits: Stagger Container */}
      <StaggerContainer
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        staggerDelay={0.15}
        initialDelay={0.3}
      >
        {/* React Bits: Animated Badge */}
        <StaggerItem variant="scale" className="mb-8">
          <AnimatedBadge
            icon={Sparkles}
            variant="outline"
            size="md"
            delay={0.2}
          >
            Trusted Worldwide
          </AnimatedBadge>
        </StaggerItem>

        {/* React Bits: Gradient Text Heading */}
        <StaggerItem variant="fadeUp" className="mb-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <div className="block mb-2">
              <GradientText
                gradient="from-white via-indigo-100 to-purple-100"
                size="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                animate={true}
              >
                Ready to Secure
              </GradientText>
            </div>
            <div className="block">
              <GradientText
                gradient="from-indigo-300 via-purple-300 to-pink-300"
                size="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                animate={true}
              >
                Your Exams?
              </GradientText>
            </div>
          </h2>
        </StaggerItem>

        {/* React Bits: Animated Text Description */}
        <StaggerItem variant="fadeUp" className="mb-12">
          <AnimatedText
            text="Join hundreds of institutions using CodeGuard for fair and transparent examinations. Start your journey today."
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
              variant="primary"
              size="lg"
              iconPosition="right"
            >
              Get Started Now
            </AnimatedButton>
          </GlowEffect>
          <AnimatedButton variant="secondary" size="lg">
            Schedule a Demo
          </AnimatedButton>
        </StaggerItem>

        {/* React Bits: Stats with Animated Badges */}
        <StaggerItem variant="fadeUp" className="grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5, type: "spring" }}
            >
              <div className="mb-2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                <AnimatedText
                  text={stat.value}
                  type="scale"
                  delay={0.9 + index * 0.1}
                />
              </div>
              <div className="text-sm md:text-base text-white/70 font-medium">
                <AnimatedText
                  text={stat.label}
                  type="fadeIn"
                  delay={1.0 + index * 0.1}
                />
              </div>
            </motion.div>
          ))}
        </StaggerItem>
      </StaggerContainer>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default CTASection;
