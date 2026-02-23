import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { getPreSaleProducts } from '../utils/api';

const PreSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getPreSaleProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao buscar pré-venda:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="section bg-background">
      <SEO
        title="Pré-Venda"
        description="Produtos em pré-venda na Ana Curve Shop. Reserve o seu com antecedência. Envio em até 7 a 10 dias após a compra."
        path="/pre-venda"
      />
      <div className="container">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <FiArrowLeft size={20} />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiClock size={28} className="text-amber-500" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text">
              Pré-Venda
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Reserve agora e receba em até 7 a 10 dias úteis após a confirmação do pagamento.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <FiClock size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Atenção: Produtos em Pré-Venda</p>
            <p className="text-amber-700 text-sm mt-1">
              Estes produtos são fabricados sob encomenda. Após a confirmação do pagamento, o envio ocorre em até 7 a 10 dias úteis.
            </p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center">
            <FiClock size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              Nenhum produto em pré-venda no momento
            </h3>
            <p className="text-gray-600 mb-6">
              Volte em breve para conferir as novidades.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreSale;
