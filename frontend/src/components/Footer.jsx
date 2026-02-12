import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaMoneyBillWave, FaCreditCard, FaBarcode } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-white mt-auto">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <img
              src="/assets/logo-ac.webp"
              alt="AC Ana Curve"
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm text-white/80 mb-4">
              Moda Plus Size Moderna e de Qualidade. Valorizamos suas curvas com estilo e elegância.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://wa.me/5511913762420"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/?newest=true" className="hover:text-primary transition-colors">
                  Novidades
                </Link>
              </li>
              <li>
                <Link to="/?promotion=true" className="hover:text-primary transition-colors">
                  Promoções
                </Link>
              </li>
              <li>
                <Link to="/categoria/Blusas" className="hover:text-primary transition-colors">
                  Blusas
                </Link>
              </li>
              <li>
                <Link to="/categoria/Vestidos" className="hover:text-primary transition-colors">
                  Vestidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiPhone size={16} />
                <span>(11) 91376-2420</span>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp size={16} />
                <a
                  href="https://wa.me/5511913762420"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={16} />
                <a
                  href="mailto:contato@anacurve.com.br"
                  className="hover:text-primary transition-colors"
                >
                  contato@anacurve.com.br
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-white/70">
                Rua Nove de Julho, 677<br />
                Jd. Santa Helena - Suzano/SP
              </p>
              <p className="text-xs text-white/70 mt-2">
                Segunda à Sexta: 9h às 18h<br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="font-bold mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded" title="Pix">
                <FaMoneyBillWave size={24} />
              </div>
              <div className="bg-white/10 p-2 rounded" title="Cartão de Crédito">
                <FaCreditCard size={24} />
              </div>
              <div className="bg-white/10 p-2 rounded" title="Boleto">
                <FaBarcode size={24} />
              </div>
              <div className="bg-white/10 p-2 rounded" title="Mercado Pago">
                <SiMercadopago size={24} />
              </div>
            </div>
            <p className="text-xs text-white/70">
              Parcele em até 12x sem juros no cartão de crédito
            </p>
            <div className="mt-4">
              <p className="text-xs text-white/70">
                🔒 Ambiente Seguro<br />
                Seus dados protegidos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>
              © {currentYear} AC Ana Curve Shop. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Trocas e Devoluções
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
