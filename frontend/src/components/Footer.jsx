import { Link } from 'react-router-dom';
import { FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Navegue no site */}
          <div>
            <h4 className="font-bold text-text mb-4">Navegue no site</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/categoria/Blusas" className="hover:text-primary transition-colors">
                  Blusas
                </Link>
              </li>
              <li>
                <Link to="/categoria/Calças" className="hover:text-primary transition-colors">
                  Calças
                </Link>
              </li>
              <li>
                <Link to="/categoria/Vestidos" className="hover:text-primary transition-colors">
                  Vestidos
                </Link>
              </li>
              <li>
                <Link to="/categoria/Conjuntos" className="hover:text-primary transition-colors">
                  Conjuntos
                </Link>
              </li>
              <li>
                <Link to="/categoria/Short / Short Saia" className="hover:text-primary transition-colors">
                  Short / Short Saia
                </Link>
              </li>
              <li>
                <Link to="/categoria/Macaquinho/Macacão" className="hover:text-primary transition-colors">
                  Macaquinho/Macacão
                </Link>
              </li>
              <li>
                <Link to="/categoria/Blazer/Jaqueta" className="hover:text-primary transition-colors">
                  Blazer/Jaqueta
                </Link>
              </li>
              <li>
                <Link to="/categoria/Acessórios" className="hover:text-primary transition-colors">
                  Acessórios
                </Link>
              </li>
              <li>
                <Link to="/pre-venda" className="hover:text-primary transition-colors">
                  Pré-Venda
                </Link>
              </li>
            </ul>
          </div>

          {/* Ajuda & Atendimento */}
          <div>
            <h4 className="font-bold text-text mb-4">Ajuda & Atendimento</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://wa.me/5511913762420"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Fale Conosco
                </a>
              </li>
              <li>
                <Link to="/faq#como-comprar" className="hover:text-primary transition-colors">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link to="/faq#politica-de-privacidade" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/faq#trocas-e-devolucoes" className="hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/faq#envio-e-entrega" className="hover:text-primary transition-colors">
                  Envio e Entrega
                </Link>
              </li>
            </ul>
          </div>

          {/* Quem Somos */}
          <div>
            <h4 className="font-bold text-text mb-4">Quem Somos</h4>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">Moda Mid e Plus Size</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Nascemos do desejo de valorizar todos os corpos, oferecendo peças que abraçam curvas com estilo, conforto e personalidade — porque vestir bem é para todos os tamanhos.
            </p>
          </div>

          {/* Fale Conosco */}
          <div>
            <h4 className="font-bold text-text mb-4">Fale Conosco</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://wa.me/5511913762420"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  (11) 91376-2420
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@anacurve.com.br"
                  className="hover:text-primary transition-colors"
                >
                  contato@anacurve.com.br
                </a>
              </li>

            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <a
              href="https://www.instagram.com/anacurveshop"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
            >
              <FiInstagram size={28} />
              <div>
                <span className="block text-xs text-gray-400 group-hover:text-primary transition-colors">SIGA-NOS NO INSTAGRAM</span>
                <span className="block text-sm font-bold text-text group-hover:text-primary transition-colors">@ANACURVESHOP</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-4">
          <p className="text-center text-xs text-gray-400">
            © Ana Curve Shop - CNPJ: 24.025.650/0001-50 - {currentYear}. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            Desenvolvido por{' '}
            <a
              href="https://ryart.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              RyArt Design
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
