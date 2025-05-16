import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  ArrowRight,
  Heart,
  Shield,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router";

const FEATURES = [
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: "Health Metrics Tracking",
    description:
      "Monitor vital signs like blood pressure, glucose levels, and heart rate in real-time",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "Secure Patient Data",
    description:
      "End-to-end encrypted patient information with role-based access controls",
  },
  {
    icon: <Calendar className="w-6 h-6 text-emerald-500" />,
    title: "Appointment Scheduling",
    description:
      "Easily book and manage appointments with healthcare professionals",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
    title: "Secure Messaging",
    description:
      "Encrypted communication between patients and healthcare providers",
  },
] as const;

const TESTIMONIALS = [
  {
    content:
      "The patient monitoring platform has transformed how I manage my diabetes. I can track my glucose levels and share them instantly with my doctor, which has led to much better treatment outcomes.",
    author: "Maria Rodriguez",
    role: "Patient",
    condition: "Type 2 Diabetes",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    content:
      "As a cardiologist, this platform has revolutionized my practice. I can monitor my patients' heart rates remotely and intervene quickly when abnormalities are detected. The time saved on routine check-ups allows me to focus on critical cases.",
    author: "Dr. James Chen",
    role: "Cardiologist",
    hospital: "Central Medical Center",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop",
  },
];

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <div className="relative flex flex-col items-center text-center space-y-6 pb-24">
            <div className="absolute inset-x-0 -top-24 -bottom-24 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <div className="inline-flex items-center gap-2 rounded-[20px] bg-blue-500/10 px-4 py-2">
              <Heart className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">
                Trusted by 10,000+ Patients & Providers
              </span>
            </div>
            <h1 className="text-6xl font-semibold text-[#1D1D1F] tracking-tight max-w-[800px] leading-[1.1]">
              Patient Monitoring Platform
            </h1>
            <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed">
              Connect patients and healthcare providers with real-time health
              monitoring, secure messaging, and appointment scheduling.
            </p>

            {!isUserLoaded ? (
              <div className="flex gap-4 pt-4">
                <div className="h-12 px-8 w-[145px] rounded-[14px] bg-gray-200 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-5 pt-4">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="h-12 px-8 text-base rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="h-12 px-8 text-base rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                  >
                    Go to Dashboard
                  </Button>
                </Authenticated>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-24">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[20px] bg-white p-6 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="mb-4 transform-gpu transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-[#86868B] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">
                How It Works
              </h2>
              <p className="text-xl text-[#86868B]">
                Our platform connects patients and healthcare providers
                seamlessly
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Register & Connect
                </h3>
                <p className="text-[#86868B]">
                  Create your profile as a patient or healthcare provider and
                  connect with your care team or patients
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Monitor Health Data
                </h3>
                <p className="text-[#86868B]">
                  Track vital signs and health metrics in real-time with
                  automated alerts for abnormal readings
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Communicate & Schedule
                </h3>
                <p className="text-[#86868B]">
                  Message securely with your care team and schedule appointments
                  when needed
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">
                Trusted by patients and providers
              </h2>
              <p className="text-xl text-[#86868B]">
                See how our platform is improving healthcare outcomes.
              </p>
            </div>
            <div className="space-y-24">
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-16 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-1">
                    <div className="max-w-xl">
                      <p className="text-[32px] font-medium text-[#1D1D1F] mb-8 leading-tight">
                        {testimonial.content}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xl font-semibold text-[#1D1D1F]">
                          {testimonial.author}
                        </div>
                        <div className="text-lg text-[#86868B]">
                          {testimonial.role}{" "}
                          {testimonial.condition
                            ? `• ${testimonial.condition}`
                            : ""}{" "}
                          {testimonial.hospital
                            ? `• ${testimonial.hospital}`
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-[#F5F5F7]">
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.author}'s portrait`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-24">
            <div className="rounded-[32px] bg-gradient-to-b from-blue-600 to-blue-700 p-16 text-center text-white">
              <h2 className="text-4xl font-semibold mb-4">
                Ready to improve patient care?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of healthcare providers and patients on our
                platform.
              </p>
              <div className="flex items-center justify-center gap-5">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button
                      variant="default"
                      className="h-12 px-8 text-base rounded-[14px] bg-white text-blue-600 hover:bg-white/90 transition-all"
                    >
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="h-12 px-8 text-base rounded-[14px] bg-white text-blue-600 hover:bg-white/90 transition-all"
                  >
                    Go to Dashboard
                  </Button>
                </Authenticated>
                <Button className="h-12 px-8 text-base rounded-[14px] border-white/20 text-white hover:bg-white/10 group transition-all">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
