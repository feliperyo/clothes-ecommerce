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
    const savedCart = localStorage.getItem('anacurve_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('anacurve_cart', JSON.stringify(cart));
  }, [cart]);

  // Adicionar produto ao carrinho
  const addToCart = (product, size, quantity = 1) => {
    if (!size) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }

    const price = product.discountPrice || product.price;

    setCart(prevCart => {
      // Verificar se o produto com o mesmo tamanho já está no carrinho
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Atualizar quantidade do item existente
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
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
            quantity,
            imageUrl: product.imageUrl,
            stock: product.stock
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
      prevCart.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
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
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
