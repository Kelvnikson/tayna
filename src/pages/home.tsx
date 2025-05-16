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
    title: "Monitoramento de Métricas de Saúde",
    description:
      "Monitore sinais vitais como pressão arterial, níveis de glicose e frequência cardíaca em tempo real",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "Dados de Pacientes Seguros",
    description:
      "Informações de pacientes criptografadas de ponta a ponta com controles de acesso baseados em função",
  },
  {
    icon: <Calendar className="w-6 h-6 text-emerald-500" />,
    title: "Agendamento de Consultas",
    description:
      "Marque e gerencie consultas com profissionais de saúde facilmente",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
    title: "Mensagens Seguras",
    description:
      "Comunicação criptografada entre pacientes e profissionais de saúde",
  },
] as const;

const TESTIMONIALS = [
  {
    content:
      "A plataforma de monitoramento de pacientes transformou a forma como gerencio meu diabetes. Posso acompanhar meus níveis de glicose e compartilhá-los instantaneamente com meu médico, o que levou a resultados de tratamento muito melhores.",
    author: "Maria Rodriguez",
    role: "Paciente",
    condition: "Diabetes Tipo 2",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    content:
      "Como cardiologista, esta plataforma revolucionou minha prática. Posso monitorar a frequência cardíaca dos meus pacientes remotamente e intervir rapidamente quando anomalias são detectadas. O tempo economizado em consultas de rotina me permite focar em casos críticos.",
    author: "Dr. Carlos Silva",
    role: "Cardiologista",
    hospital: "Centro Médico Central",
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
                Confiado por mais de 10.000 pacientes e profissionais
              </span>
            </div>
            <h1 className="text-6xl font-semibold text-[#1D1D1F] tracking-tight max-w-[800px] leading-[1.1]">
              Plataforma de Monitoramento de Pacientes
            </h1>
            <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed">
              Conecte pacientes e profissionais de saúde com monitoramento de
              saúde em tempo real, mensagens seguras e agendamento de consultas.
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
                      Começar Agora
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="h-12 px-8 text-base rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                  >
                    Ir para o Painel
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
                Como Funciona
              </h2>
              <p className="text-xl text-[#86868B]">
                Nossa plataforma conecta pacientes e profissionais de saúde de
                forma integrada
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Cadastre-se e Conecte-se
                </h3>
                <p className="text-[#86868B]">
                  Crie seu perfil como paciente ou profissional de saúde e
                  conecte-se com sua equipe de cuidados ou pacientes
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Monitore Dados de Saúde
                </h3>
                <p className="text-[#86868B]">
                  Acompanhe sinais vitais e métricas de saúde em tempo real com
                  alertas automáticos para leituras anormais
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Comunique-se e Agende
                </h3>
                <p className="text-[#86868B]">
                  Envie mensagens com segurança para sua equipe de cuidados e
                  agende consultas quando necessário
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">
                Confiado por pacientes e profissionais
              </h2>
              <p className="text-xl text-[#86868B]">
                Veja como nossa plataforma está melhorando os resultados de
                saúde.
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
                        alt={`Foto de ${testimonial.author}`}
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
                Pronto para melhorar o cuidado com pacientes?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Junte-se a milhares de profissionais de saúde e pacientes em
                nossa plataforma.
              </p>
              <div className="flex items-center justify-center gap-5">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button
                      variant="default"
                      className="h-12 px-8 text-base rounded-[14px] bg-white text-blue-600 hover:bg-white/90 transition-all"
                    >
                      Começar Agora
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="h-12 px-8 text-base rounded-[14px] bg-white text-blue-600 hover:bg-white/90 transition-all"
                  >
                    Ir para o Painel
                  </Button>
                </Authenticated>
                <Button className="h-12 px-8 text-base rounded-[14px] border-white/20 text-white hover:bg-white/10 group transition-all">
                  Saiba Mais
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
