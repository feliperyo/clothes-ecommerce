import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  togglePromotion
} from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiLoader,
  FiStar,
  FiTrendingUp,
  FiAlertCircle,
  FiUpload,
  FiImage
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: 'Blusas',
      price: '',
      stock: '',
      sizes: 'P,M,G,GG,XG',
      imageUrl: '',
      discountPrice: '',
      featured: false,
      promotion: false
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProductsAdmin();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('category', product.category);
      setValue('price', product.price);
      setValue('stock', product.stock);
      setValue('sizes', typeof product.sizes === 'string' ? product.sizes : product.sizes.join(','));
      setValue('discountPrice', product.discountPrice || '');
      setValue('featured', product.isFeatured || false);
      setValue('promotion', product.isPromotion || false);
      // Se tem imagem existente, mostrar preview
      if (product.imageUrl) {
        const imgUrl = product.imageUrl.startsWith('/uploads')
          ? `${API_URL}${product.imageUrl}`
          : product.imageUrl;
        setImagePreview(imgUrl);
      }
    } else {
      setEditingProduct(null);
      reset();
      setSelectedFile(null);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setImagePreview(null);
    reset();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Usar FormData para suportar upload de arquivo
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('stock', data.stock);
      formData.append('sizes', data.sizes);
      formData.append('isFeatured', data.featured);
      formData.append('isPromotion', data.promotion);

      if (data.discountPrice) {
        formData.append('discountPrice', data.discountPrice);
      }

      // Se tem arquivo selecionado, enviar
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingProduct) {
        // Atualizar
        const updated = await updateProduct(editingProduct.id, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Criar - imagem é obrigatória para novos produtos
        if (!selectedFile) {
          toast.error('Selecione uma imagem para o produto');
          setSubmitting(false);
          return;
        }
        const created = await createProduct(formData);
        setProducts([created, ...products]);
        toast.success('Produto criado com sucesso!');
      }

      closeModal();
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao salvar produto';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Produto deletado com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar produto');
      }
    }
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const updated = await toggleFeatured(productId);
      setProducts(products.map(p => p.id === productId ? updated : p));
      toast.success('Status de destaque atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar destaque');
    }
  };

  const handleTogglePromotion = async (productId) => {
    try {
      const updated = await togglePromotion(productId);
      setProducts(products.map(p => p.id === productId ? updated : p));
      toast.success('Status de promoção atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar promoção');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary mx-auto mb-3" size={40} />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Produtos</h1>
          <p className="text-gray-600">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Estoque
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl.startsWith('/uploads') ? `${API_URL}${product.imageUrl}` : product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-text truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            {formatPrice(product.discountPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.isFeatured
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Destaque"
                        >
                          <FiStar size={16} />
                        </button>
                        <button
                          onClick={() => handleTogglePromotion(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.isPromotion
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Promoção"
                        >
                          <FiTrendingUp size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FiAlertCircle className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">Nenhum produto cadastrado</p>
            <button
              onClick={() => openModal()}
              className="btn-primary mt-4"
            >
              Criar Primeiro Produto
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-text">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-primary/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Digite a descrição"
                  rows="4"
                  {...register('description', { required: 'Descrição é obrigatória' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-primary/20'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Grid 2 Colunas */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Categoria
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Blusas">Blusas</option>
                    <option value="Calças">Calças</option>
                    <option value="Vestidos">Vestidos</option>
                    <option value="Conjuntos">Conjuntos</option>
                    <option value="Saia">Saia</option>
                    <option value="Saia Short">Saia Short</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Imagem do Produto
                  </label>
                  <div className="space-y-3">
                    {/* Preview */}
                    {imagePreview && (
                      <div className="relative w-24 h-24">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                    {/* Input */}
                    <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <FiUpload className="text-gray-400" size={20} />
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : 'Clique para selecionar'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP ou GIF (máx. 5MB)</p>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...register('price', { required: 'Preço é obrigatório' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-primary/20'
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Preço com Desconto (Opcional)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...register('discountPrice')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Estoque
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    {...register('stock', { required: 'Estoque é obrigatório' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.stock
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-primary/20'
                    }`}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Tamanhos (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="P,M,G,GG"
                    {...register('sizes', { required: 'Tamanhos são obrigatórios' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.sizes
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-primary/20'
                    }`}
                  />
                  {errors.sizes && (
                    <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-text">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('promotion')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-text">Promoção</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      Salvando...
                    </>
                  ) : (
                    editingProduct ? 'Atualizar' : 'Criar Produto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
