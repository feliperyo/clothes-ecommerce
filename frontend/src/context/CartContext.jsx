import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Carregar carrinho do localStorage
    try {
      const savedCart = localStorage.getItem('anacurve_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Frete selecionado: { id, name, company, price, delivery_time } | null
  const [selectedShipping, setSelectedShipping] = useState(() => {
    try {
      const saved = localStorage.getItem('anacurve_selected_shipping');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [shippingCep, setShippingCep] = useState(
    () => localStorage.getItem('anacurve_shipping_cep') || ''
  );

  const selectShipping = (option) => {
    setSelectedShipping(option);
    if (option) {
      localStorage.setItem('anacurve_selected_shipping', JSON.stringify(option));
    } else {
      localStorage.removeItem('anacurve_selected_shipping');
    }
  };

  const saveShippingCep = (cep) => {
    setShippingCep(cep);
    if (cep) localStorage.setItem('anacurve_shipping_cep', cep);
    else localStorage.removeItem('anacurve_shipping_cep');
  };

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('anacurve_cart', JSON.stringify(cart));
  }, [cart]);

  // Adicionar produto ao carrinho
  const addToCart = (product, size, quantity = 1, color = null, sizeStock = null) => {
    if (!size) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }

    const price = product.discountPrice || product.price;
    const maxStock = sizeStock ?? product.stock;

    setCart(prevCart => {
      // Verificar se o produto com o mesmo tamanho E cor já está no carrinho
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === size && item.color?.name === color?.name
      );

      if (existingItemIndex > -1) {
        // Atualizar quantidade do item existente respeitando o estoque do tamanho
        const existing = prevCart[existingItemIndex];
        const itemMax = existing.sizeStock ?? maxStock;
        const newQty = Math.min(itemMax, existing.quantity + quantity);
        if (newQty === existing.quantity) {
          toast.error('Quantidade máxima disponível já atingida');
          return prevCart;
        }
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = { ...existing, quantity: newQty };
        toast.success('Quantidade atualizada no carrinho!');
        return updatedCart;
      } else {
        // Adicionar novo item
        toast.success('Produto adicionado ao carrinho!');
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price,
            size,
            color: color || null,
            quantity: Math.min(maxStock, quantity),
            imageUrl: color?.imageUrl || product.imageUrl,
            stock: product.stock,
            sizeStock: maxStock
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  // Remover produto do carrinho
  const removeFromCart = (productId, size) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.size === size))
    );
    toast.success('Produto removido do carrinho');
  };

  // Atualizar quantidade
  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId && item.size === size) {
          const maxStock = item.sizeStock ?? item.stock;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    toast.success('Carrinho limpo');
  };

  // Calcular total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Calcular quantidade total de itens
  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Abrir/fechar drawer do carrinho
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cart,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    toggleCart,
    openCart,
    closeCart,
    selectedShipping,
    selectShipping,
    shippingCep,
    saveShippingCep
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
