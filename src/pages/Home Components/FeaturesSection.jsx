import { motion } from "framer-motion";
import {
  Shield,
  Users,
  BarChart3,
  MonitorCheck,
  Lock,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import {
  GradientText,
  AnimatedText,
  AnimatedCard,
  AnimatedBadge,
  StaggerContainer,
  StaggerItem,
  GradientBackground,
  CardSwap,
} from "../../components/react-bits";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "End-to-end encryption and secure authentication ensure maximum data safety.",
      gradientOverlay: "from-indigo-500/20 via-blue-500/20 to-purple-500/20",
      iconBg: "from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-300",
    },
    {
      icon: Lock,
      title: "Anti-Cheat Detection",
      description:
        "AI-powered real-time monitoring to catch suspicious exam activities instantly.",
      gradientOverlay: "from-rose-500/20 via-pink-500/20 to-red-500/20",
      iconBg: "from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30",
      iconColor: "text-rose-600 dark:text-rose-300",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description:
        "Separate dashboards for students and examiners with controlled permissions.",
      gradientOverlay: "from-teal-500/20 via-emerald-500/20 to-cyan-500/20",
      iconBg:
        "from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30",
      iconColor: "text-teal-600 dark:text-teal-300",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Live exam insights with advanced analytics and detailed activity logs.",
      gradientOverlay: "from-purple-500/20 via-pink-500/20 to-indigo-500/20",
      iconBg:
        "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      icon: CheckCircle,
      title: "Easy Setup",
      description: "Start monitoring within minutes using our simple interface.",
      gradientOverlay:
        "from-orange-500/20 via-amber-500/20 to-pink-500/20",
      iconBg:
        "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-300",
    },
    {
      icon: MonitorCheck,
      title: "Screen Sharing",
      description: "Crystal-clear recording and screen monitoring features.",
      gradientOverlay: "from-cyan-500/20 via-blue-500/20 to-teal-500/20",
      iconBg:
        "from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-300",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
    >
      {/* Animated Global Background */}
      <GradientBackground
        gradients={[
          "from-purple-600/10 via-pink-600/10 to-indigo-600/10",
          "from-blue-600/10 via-cyan-600/10 to-teal-600/10",
        ]}
        animate
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <StaggerContainer className="text-center mb-20" staggerDelay={0.15}>
          <StaggerItem variant="scale">
            <AnimatedBadge icon={Sparkles} size="md">
              Feature Rich
            </AnimatedBadge>
          </StaggerItem>

          <StaggerItem variant="fadeUp">
            <h2 className="text-5xl font-extrabold mb-4">
              <GradientText
                gradient="from-indigo-500 via-purple-500 to-pink-500"
                animate
              >
                Powerful Features
              </GradientText>
            </h2>
          </StaggerItem>

          <StaggerItem variant="fadeUp">
            <AnimatedText
              text="Everything you need for intelligent and secure exam monitoring"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* PREMIUM AUTO-SLIDE CARD SWAP */}
        <div className="hidden lg:block">
          <CardSwap
            autoSwap={true}
            swapInterval={3800}
            cards={features.map((f, i) => (
              <AnimatedCard
                key={i}
                gradient
                gradientColors={f.gradientOverlay}
                hoverEffect={false}
                className="h-full w-full rounded-3xl backdrop-blur-xl bg-gray-200 dark:bg-black/10 border border-white/10 shadow-xl"
              >
                <div className="p-12 relative">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${f.iconBg} w-fit shadow-xl`}
                  >
                    <f.icon className={`w-12 h-12 ${f.iconColor}`} />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-black drop-shadow"
                  >
                    {f.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground mt-4 max-w-xl text-lg"
                  >
                    {f.description}
                  </motion.p>
                </div>
              </AnimatedCard>
            ))}
            showControls={false}   // 👈 NO left/right arrows  
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Mobile Grid */}
        <StaggerContainer
          className="grid md:grid-cols-2 lg:hidden gap-6 mt-10"
          staggerDelay={0.1}
        >
          {features.map((f, i) => (
            <StaggerItem key={i} variant="fadeUp">
              <AnimatedCard
                gradient
                gradientColors={f.gradientOverlay}
                className="p-6 rounded-2xl shadow-lg backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/10"
              >
                <div>
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${f.iconBg} w-fit mb-4`}
                  >
                    <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;


// import { motion } from "framer-motion";
// import {
//   Shield,
//   Users,
//   BarChart3,
//   MonitorCheck,
//   Lock,
//   CheckCircle,
//   Sparkles,
// } from "lucide-react";
// import {
//   GradientText,
//   AnimatedText,
//   AnimatedCard,
//   AnimatedBadge,
//   StaggerContainer,
//   StaggerItem,
//   GradientBackground,
//   CardSwap,
// } from "../../components/react-bits";

// const FeaturesSection = () => {
//   const features = [
//     {
//       icon: Shield,
//       title: "Advanced Security",
//       description: "End-to-end encryption and secure authentication protocols ensure your exam data stays protected.",
//       gradient: "from-indigo-500 via-blue-500 to-purple-500",
//       iconBg: "from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30",
//       iconColor: "text-indigo-600 dark:text-indigo-400",
//       gradientOverlay: "from-indigo-500/10 via-blue-500/10 to-purple-500/10",
//     },
//     {
//       icon: Lock,
//       title: "Anti-Cheat Detection",
//       description: "AI-powered monitoring system detects suspicious activities in real-time with high accuracy.",
//       gradient: "from-red-500 via-pink-500 to-rose-500",
//       iconBg: "from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30",
//       iconColor: "text-red-600 dark:text-red-400",
//       gradientOverlay: "from-red-500/10 via-pink-500/10 to-rose-500/10",
//     },
//     {
//       icon: Users,
//       title: "Role-Based Access",
//       description: "Separate dashboards for students and examiners with customized permissions and controls.",
//       gradient: "from-emerald-500 via-teal-500 to-cyan-500",
//       iconBg: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
//       iconColor: "text-emerald-600 dark:text-emerald-400",
//       gradientOverlay: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
//     },
//     {
//       icon: BarChart3,
//       title: "Real-Time Analytics",
//       description: "Live monitoring dashboard with comprehensive reports and detailed activity insights.",
//       gradient: "from-purple-500 via-pink-500 to-indigo-500",
//       iconBg: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
//       iconColor: "text-purple-600 dark:text-purple-400",
//       gradientOverlay: "from-purple-500/10 via-pink-500/10 to-indigo-500/10",
//     },
//     {
//       icon: CheckCircle,
//       title: "Easy Setup",
//       description: "Get started in minutes with our intuitive interface. No technical expertise required.",
//       gradient: "from-amber-500 via-orange-500 to-pink-500",
//       iconBg: "from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
//       iconColor: "text-amber-600 dark:text-amber-400",
//       gradientOverlay: "from-amber-500/10 via-orange-500/10 to-pink-500/10",
//     },
//     {
//       icon: MonitorCheck,
//       title: "Screen Sharing",
//       description: "Record and share sessions for later review and verification with crystal-clear quality.",
//       gradient: "from-teal-500 via-cyan-500 to-blue-500",
//       iconBg: "from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30",
//       iconColor: "text-teal-600 dark:text-teal-400",
//       gradientOverlay: "from-teal-500/10 via-cyan-500/10 to-blue-500/10",
//     },
//   ];

//   return (
//     <section
//       id="features"
//       className="py-24 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden"
//     >
//       {/* React Bits: Gradient Background */}
//       <GradientBackground
//         gradients={[
//           "from-purple-500/5 via-pink-500/5 to-indigo-500/5",
//           "from-indigo-500/5 via-blue-500/5 to-cyan-500/5",
//         ]}
//         animate={true}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         {/* React Bits: Stagger Container for Header */}
//         <StaggerContainer
//           className="text-center mb-20"
//           staggerDelay={0.1}
//           initialDelay={0.2}
//         >
//           <StaggerItem variant="scale" className="mb-4">
//             <AnimatedBadge
//               icon={Sparkles}
//               variant="default"
//               size="md"
//               delay={0.2}
//             >
//               Feature Rich
//             </AnimatedBadge>
//           </StaggerItem>

//           <StaggerItem variant="fadeUp" className="mb-6">
//             <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
//               <GradientText
//                 gradient="from-indigo-600 via-purple-600 to-pink-600"
//                 size="text-4xl sm:text-5xl md:text-6xl"
//                 animate={true}
//               >
//                 Powerful Features
//               </GradientText>
//             </h2>
//           </StaggerItem>

//           <StaggerItem variant="fadeUp">
//             <AnimatedText
//               text="Everything you need for secure and efficient exam monitoring"
//               type="fadeIn"
//               delay={0.4}
//               className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
//             />
//           </StaggerItem>
//         </StaggerContainer>

//         {/* React Bits: Card Swap Feature - Desktop View */}
//         <div className="hidden lg:block mb-12">
//           <CardSwap
//             cards={features.map((feature, index) => (
//               <AnimatedCard
//                 key={index}
//                 hoverEffect={true}
//                 gradient={true}
//                 gradientColors={feature.gradientOverlay}
//                 delay={0}
//                 className="h-full w-full"
//               >
//                 <div className="p-8 lg:p-12">
//                   {/* Icon with React Bits animation */}
//                   <motion.div
//                     initial={{ scale: 0, rotate: -180 }}
//                     animate={{ scale: 1, rotate: 0 }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 200,
//                     }}
//                     className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${feature.iconBg} w-fit shadow-lg`}
//                   >
//                     <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
//                   </motion.div>

//                   {/* Title with React Bits Gradient Text */}
//                   <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
//                     {feature.title}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl max-w-2xl">
//                     {feature.description}
//                   </p>

//                   {/* Decorative elements */}
//                   <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full" />
//                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />
//                 </div>
//               </AnimatedCard>
//             ))}
//             autoSwap={true}
//             swapInterval={4000}
//             showControls={true}
//             className="max-w-4xl mx-auto"
//           />
//         </div>

//         {/* React Bits: Grid Layout for Mobile/Tablet */}
//         <StaggerContainer
//           className="grid md:grid-cols-2 lg:hidden gap-6 lg:gap-8"
//           staggerDelay={0.1}
//           initialDelay={0.3}
//         >
//           {features.map((feature, index) => (
//             <StaggerItem key={index} variant="scale">
//               {/* React Bits: Animated Card */}
//               <AnimatedCard
//                 hoverEffect={true}
//                 gradient={true}
//                 gradientColors={feature.gradientOverlay}
//                 delay={index * 0.1}
//                 className="h-full"
//               >
//                 <div className="p-6 lg:p-8">
//                   {/* Icon with React Bits animation */}
//                   <motion.div
//                     initial={{ scale: 0, rotate: -180 }}
//                     whileInView={{ scale: 1, rotate: 0 }}
//                     viewport={{ once: true }}
//                     transition={{
//                       delay: index * 0.1 + 0.2,
//                       type: "spring",
//                       stiffness: 200,
//                     }}
//                     className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${feature.iconBg} w-fit shadow-md group-hover:shadow-lg transition-shadow`}
//                   >
//                     <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
//                   </motion.div>

//                   {/* Title with React Bits Gradient Text on hover */}
//                   <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
//                     <AnimatedText
//                       text={feature.title}
//                       type="fadeIn"
//                       delay={index * 0.1 + 0.3}
//                     />
//                   </h3>

//                   {/* Description with React Bits Animated Text */}
//                   <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
//                     <AnimatedText
//                       text={feature.description}
//                       type="word"
//                       delay={index * 0.1 + 0.5}
//                       stagger={0.02}
//                     />
//                   </p>

//                   {/* Decorative corner */}
//                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 </div>
//               </AnimatedCard>
//             </StaggerItem>
//           ))}
//         </StaggerContainer>
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;
