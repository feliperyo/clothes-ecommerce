import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const STORAGE_KEY = 'clothes_popup_dismissed';

const CouponPopup = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // Só mostra se ainda não foi fechado/enviado nessa sessão (ou nas últimas 24h)
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const ts = parseInt(dismissed, 10);
      // Mostra de novo depois de 24h
      if (Date.now() - ts < 24 * 60 * 60 * 1000) return;
    }
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSent(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setTimeout(() => setVisible(false), 3000);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col sm:flex-row">
        {/* Botão fechar */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <FiX size={18} />
        </button>

        {/* Lado esquerdo — Formulário */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <img src="/assets/logo-ac.webp" alt="Clothes Shop" className="h-16 w-auto" />
          </div>

          {!sent ? (
            <>
              <p className="text-center text-text font-semibold text-base mb-1">
                Ganhe <span className="text-primary font-bold">10% OFF</span> na sua primeira compra!
              </p>
              <p className="text-center text-sm text-gray-500 mb-5">
                Use o cupom: <span className="font-bold text-primary tracking-widest">BEMVINDA10</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="submit"
                  className="w-full btn-primary py-3 font-bold tracking-wide text-sm"
                >
                  QUERO MEU DESCONTO
                </button>
              </form>

              <button
                onClick={dismiss}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 text-center w-full transition-colors"
              >
                Não, obrigada
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-bold text-text text-lg mb-2">Cupom enviado!</p>
              <p className="text-gray-500 text-sm mb-3">
                Use <span className="font-bold text-primary">BEMVINDA10</span> no checkout
              </p>
              <p className="text-xs text-gray-400">Esta janela vai fechar em instantes...</p>
            </div>
          )}
        </div>

        {/* Lado direito — Imagem (apenas em telas maiores) */}
        <div className="hidden sm:block w-48 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"
            alt="Clothes Shop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;
