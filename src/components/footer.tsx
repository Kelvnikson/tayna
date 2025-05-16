export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/50 bg-[#F5F5F7]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Plataforma de Monitoramento de Pacientes
            </h3>
            <p className="text-base text-[#86868B] leading-relaxed">
              Conectando pacientes e profissionais de saúde para melhores
              resultados de saúde.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Recursos</h4>
            <ul className="space-y-3">
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Monitoramento de Métricas de Saúde
              </li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Mensagens Seguras
              </li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Agendamento de Consultas
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Recursos</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/help"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Blog de Saúde
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacy"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a
                  href="/hipaa"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Conformidade LGPD
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-neutral-200/50">
          <p className="text-center text-sm text-[#86868B]">
            © {new Date().getFullYear()} Plataforma de Monitoramento de
            Pacientes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
