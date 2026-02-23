import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import SEO from '../components/SEO';
import { getFaqSchema, getBreadcrumbSchema } from '../utils/seo';

const sections = [
  {
    id: 'como-comprar',
    title: 'Como Comprar',
    content: [
      {
        question: 'Como faço para comprar no site?',
        answer:
          'Navegue pelo nosso catálogo, escolha o produto desejado, selecione o tamanho e clique em "Adicionar ao Carrinho". Quando terminar, vá ao carrinho e clique em "Finalizar Compra". Preencha seus dados e escolha a forma de pagamento.',
      },
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer:
          'Aceitamos cartão de crédito (em até 12x sem juros), Pix e boleto bancário, tudo processado de forma segura pelo Mercado Pago.',
      },
      {
        question: 'Como acompanho meu pedido?',
        answer:
          'Após a confirmação do pagamento, você receberá um e-mail com o número do pedido e o código de rastreio assim que o produto for enviado. Você também pode entrar em contato pelo nosso WhatsApp para acompanhar.',
      },
      {
        question: 'Qual o prazo de entrega?',
        answer:
          'O prazo varia conforme a região. Após a postagem, o prazo estimado é de 3 a 10 dias úteis para capitais e regiões metropolitanas, e até 15 dias úteis para demais localidades.',
      },
      {
        question: 'O frete é grátis?',
        answer:
          'Sim! Para compras acima de R$ 599,00, o frete é grátis para todo o Brasil.',
      },
    ],
  },
  {
    id: 'politica-de-privacidade',
    title: 'Política de Privacidade',
    content: [
      {
        question: 'Quais dados são coletados?',
        answer:
          'Coletamos apenas as informações necessárias para processar seu pedido: nome, e-mail, telefone, CPF e endereço de entrega. Esses dados são utilizados exclusivamente para fins de venda e envio dos produtos.',
      },
      {
        question: 'Como meus dados são protegidos?',
        answer:
          'Utilizamos criptografia SSL em todo o site e o processamento de pagamentos é feito pelo Mercado Pago, uma plataforma segura e certificada. Não armazenamos dados de cartão de crédito.',
      },
      {
        question: 'Meus dados são compartilhados com terceiros?',
        answer:
          'Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Seus dados são compartilhados apenas com a transportadora (para entrega) e com o Mercado Pago (para processamento do pagamento).',
      },
      {
        question: 'Como posso excluir meus dados?',
        answer:
          'Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato pelo nosso WhatsApp (11) 91376-2420 ou pelo e-mail contato@anacurve.com.br. Atenderemos sua solicitação em até 15 dias úteis, conforme a LGPD.',
      },
    ],
  },
  {
    id: 'trocas-e-devolucoes',
    title: 'Trocas e Devoluções',
    content: [
      {
        question: 'Qual o prazo para postagem do pedido?',
        answer:
          'O prazo para postagem nos Correios é de até 3 dias úteis contados após a aprovação do pagamento, sendo possível enviar antes.',
      },
      {
        question: 'Posso trocar um produto?',
        answer:
          'Sim! Aceitamos troca de produtos sem uso em até 7 dias corridos a partir da data de recebimento, sem qualquer custo adicional. O produto deve estar nas mesmas condições em que foi recebido: sem indícios de uso, suor, perfume ou manchas, e com as etiquetas intactas.',
      },
      {
        question: 'Como solicito uma troca?',
        answer:
          'Envie um e-mail para mabecasmodas@hotmail.com com: nome completo, CPF, número do pedido, motivo da troca e por qual produto/numeração deseja trocar. Em até 3 dias úteis você receberá um código de autorização de postagem. Basta levar o produto embalado aos Correios e postar com o código — sem custos para você.',
      },
      {
        question: 'Quem paga o frete da troca?',
        answer:
          'A primeira troca é gratuita! O frete fica por nossa conta, utilizando PAC (Correios) ou Jadlog, independentemente da forma de envio original. A partir da segunda troca, caso existam, o frete poderá ser cobrado do solicitante. Caso o cliente tenha urgência, pode optar e custear o SEDEX.',
      },
      {
        question: 'Posso trocar por outro produto de valor diferente?',
        answer:
          'Sim! Você pode escolher outro item conforme disponibilidade de estoque. Se o produto desejado for de valor superior, será necessário pagar a diferença pelas opções de pagamento do site. O novo produto será despachado somente após o recebimento do item a ser trocado em nosso centro de distribuição.',
      },
      {
        question: 'Posso devolver e receber reembolso?',
        answer:
          'Sim. Em caso de devolução, o cliente pode optar por crédito (sem validade) no site ou pelo estorno do valor do produto na mesma forma de pagamento realizada. O prazo para postagem do produto é de 7 dias corridos após a data de entrega da encomenda.',
      },
      {
        question: 'O que fazer se o produto chegou com defeito ou errado?',
        answer:
          'Entre em contato com nossos canais de atendimento no horário comercial. Comprovada a falha, realizaremos a substituição do produto sem custos. Obs: os produtos podem apresentar pequenas variações de cor devido às configurações de monitores.',
      },
      {
        question: 'Produtos em promoção podem ser trocados ou devolvidos?',
        answer:
          'Não. Não realizamos trocas nem devoluções de produtos em promoção.',
      },
    ],
  },
];

const Faq = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="Perguntas Frequentes"
        description="Tire suas dúvidas sobre compras, entregas, trocas e devoluções na Ana Curve Shop. Como comprar, formas de pagamento, prazo de entrega e política de trocas."
        path="/faq"
        jsonLd={[
          getFaqSchema(sections),
          getBreadcrumbSchema([
            { name: 'Início', url: '/' },
            { name: 'Perguntas Frequentes' },
          ]),
        ]}
      />
      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Início</Link>
          <FiChevronRight size={14} />
          <span className="text-text font-medium">Perguntas Frequentes</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Tire suas dúvidas sobre compras, entregas, trocas e devoluções. Se não encontrar o que procura, fale conosco pelo{' '}
          <a
            href="https://wa.me/5511913762420"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            WhatsApp
          </a>.
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-10">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
            >
              {section.title}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl font-display font-bold text-text mb-6 pb-3 border-b-2 border-primary/30">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-text hover:text-primary transition-colors">
                      {item.question}
                      <span className="ml-4 text-primary transition-transform group-open:rotate-45 text-xl flex-shrink-0">
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-tertiary rounded-lg p-8">
          <h3 className="text-xl font-display font-bold text-text mb-3">
            Ainda tem dúvidas?
          </h3>
          <p className="text-gray-600 mb-5">
            Nossa equipe está pronta para ajudar!
          </p>
          <a
            href="https://wa.me/5511913762420?text=Ol%C3%A1!%20Vim%20pelo%20site%20Ana%20Curve%20Shop%20e%20tenho%20uma%20d%C3%BAvida."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Faq;
