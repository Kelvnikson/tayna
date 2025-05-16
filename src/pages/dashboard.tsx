import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Database, Clock, Shield } from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { HealthMetricsDashboard } from "../components/health/HealthMetricsDashboard";
import { PatientProfile } from "../components/profiles/PatientProfile";
import { ProfessionalProfile } from "../components/profiles/ProfessionalProfile";
import { AppointmentScheduling } from "../components/appointments/AppointmentScheduling";
import { ChatInterface } from "../components/chat/ChatInterface";

export default function Dashboard() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const [activeTab, setActiveTab] = useState("health");

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="relative mb-12">
            <div className="absolute inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
              Seu Painel
            </h1>
            <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed mb-8">
              Visualize e gerencie suas informações de saúde em um só lugar.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger
                value="health"
                className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >
                Métricas de Saúde
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >
                Consultas
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
              >
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health">
              <HealthMetricsDashboard />
            </TabsContent>

            <TabsContent value="profile">
              {userData?.userType === "professional" ? (
                <ProfessionalProfile />
              ) : (
                <PatientProfile />
              )}
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentScheduling />
            </TabsContent>

            <TabsContent value="chat">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
