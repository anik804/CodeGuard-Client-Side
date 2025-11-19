import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceID = "service_jq6jtln"; // replace with your EmailJS service ID
    const templateID = "template_xkrphm9"; // replace with your EmailJS template ID
    const publicKey = "nwG4mBCHFcJQKq_Xr"; // replace with your EmailJS public key

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(
        (response) => {
          toast.success(
            "Message sent successfully! We'll get back to you soon.",
            { duration: 3000 }
          );
          setFormData({ name: "", email: "", subject: "", message: "" });
          setIsSubmitting(false);
        },
        (error) => {
          toast.error(
            "Failed to send message. Please try again later.",
            { duration: 3000 }
          );
          console.error("EmailJS Error:", error);
          setIsSubmitting(false);
        }
      );
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      detail: "support_iiuc@gmail.edu",
      link: "mailto:support_iiuc@gmail.edu",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      icon: Phone,
      title: "Phone",
      detail: "+8801252663782",
      link: "tel:+8801252663782",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: MapPin,
      title: "Office",
      detail: "Hi hello Bangladesh",
      link: "#",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 container mx-auto text-gray-200 overflow-hidden"
    >
      {/* Animated Background Glows */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Have a question or feedback? We’d love to hear from you!  
              Fill out the form and we’ll get back to you soon.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white text-xl shadow-md`}
                      >
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-white mb-1">
                          {info.title}
                        </h4>
                        <a
                          href={info.link}
                          className="text-gray-400 hover:text-indigo-400 transition-colors"
                        >
                          {info.detail}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-300 mb-2"
                        >
                          Your Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="bg-transparent border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-300 mb-2"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="bg-transparent border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-gray-300 mb-2"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="bg-transparent border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-300 mb-2"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        className="bg-transparent border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600 min-h-[150px]"
                      />
                    </div>

                    <div>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {isSubmitting && (
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                          />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Google Map Section */}
          <motion.div
            className="mt-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9021676580263!2d90.39136367593935!3d23.750885288714013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b894d99cc5f1%3A0x9a944c2375b3cc!2sDhaka!5e0!3m2!1sen!2sbd!4v1708442283101!5m2!1sen!2sbd"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              className="w-full"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
