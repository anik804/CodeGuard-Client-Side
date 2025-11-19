import { Users, MonitorCheck, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  GradientText,
  AnimatedText,
  AnimatedCard,
  AnimatedBadge,
  StaggerContainer,
  StaggerItem,
  GradientBackground,
} from "../../components/react-bits";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Users,
      step: "01",
      title: "Create & Join",
      description:
        "Examiners create exam rooms with unique identifiers. Students join seamlessly using room IDs for instant access.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      gradientOverlay: "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
    },
    {
      icon: MonitorCheck,
      step: "02",
      title: "Screen Share",
      description:
        "Real-time screen monitoring ensures complete transparency. Advanced tracking captures every activity during exams.",
      gradient: "from-pink-500 via-rose-500 to-orange-500",
      gradientOverlay: "from-pink-500/10 via-rose-500/10 to-orange-500/10",
    },
    {
      icon: BarChart3,
      step: "03",
      title: "Track & Analyze",
      description:
        "Comprehensive analytics dashboard. Monitor activities, detect anomalies, and generate detailed reports instantly.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      gradientOverlay: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
      {/* React Bits: Gradient Background */}
      <GradientBackground
        gradients={[
          "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
          "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
        ]}
        animate={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* React Bits: Stagger Container for Header */}
        <StaggerContainer
          className="text-center mb-20"
          staggerDelay={0.1}
          initialDelay={0.2}
        >
          <StaggerItem variant="scale" className="mb-4">
            <AnimatedBadge variant="default" size="md" delay={0.2}>
              Simple Process
            </AnimatedBadge>
          </StaggerItem>

          <StaggerItem variant="fadeUp" className="mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
              <GradientText
                gradient="from-indigo-600 via-purple-600 to-pink-600"
                size="text-4xl sm:text-5xl md:text-6xl"
                animate={true}
              >
                How It Works
              </GradientText>
            </h2>
          </StaggerItem>

          <StaggerItem variant="fadeUp">
            <AnimatedText
              text="Simple, secure, and efficient exam monitoring in three easy steps"
              type="fadeIn"
              delay={0.4}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* React Bits: Stagger Container for Cards */}
        <StaggerContainer
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
          staggerDelay={0.2}
          initialDelay={0.3}
        >
          {steps.map((item, index) => (
            <StaggerItem key={index} variant="scale" className="group relative">
              {/* Connecting line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent z-0 transform -translate-y-1/2 translate-x-5">
                  <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                  />
                </div>
              )}

              {/* React Bits: Animated Card */}
              <AnimatedCard
                className="h-full"
                hoverEffect={true}
                gradient={true}
                gradientColors={item.gradientOverlay}
                delay={index * 0.2}
              >
                <div className="p-8 lg:p-10">
                  {/* Step number with React Bits animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-bold text-xl mb-6 shadow-lg`}
                  >
                    {item.step}
                  </motion.div>

                  {/* Icon with React Bits animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.2 + 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${item.gradient} w-fit shadow-lg`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title with React Bits Gradient Text */}
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    <AnimatedText
                      text={item.title}
                      type="fadeIn"
                      delay={index * 0.2 + 0.6}
                    />
                  </h3>

                  {/* Description with React Bits Animated Text */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base lg:text-lg">
                    <AnimatedText
                      text={item.description}
                      type="word"
                      
                      delay={index * 0.2 + 0.8}
                      stagger={0.03}
                    />
                  </p>

                  {/* Learn more link */}
                  <motion.div
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowItWorksSection;
