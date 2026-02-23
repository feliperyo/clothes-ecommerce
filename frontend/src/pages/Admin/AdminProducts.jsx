import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import RichTextEditor from '../../components/RichTextEditor';
import toast from 'react-hot-toast';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  togglePromotion,
  toggleNew
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
  FiImage,
  FiZap,
  FiSearch
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const CATEGORIES = ['Blusas', 'Calças', 'Vestidos', 'Conjuntos', 'Short / Short Saia', 'Macaquinho/Macacão', 'Blazer/Jaqueta', 'Saias', 'Shorts', 'Acessórios'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // File[]
  const [imagePreviews, setImagePreviews] = useState([]);   // local URLs[]
  const [existingImages, setExistingImages] = useState([]); // cloud URLs[]
  const [selectedVideo, setSelectedVideo] = useState(null); // File
  const [videoPreview, setVideoPreview] = useState(null);   // local URL
  const [existingVideoUrl, setExistingVideoUrl] = useState(null); // cloud URL
  const [removeVideo, setRemoveVideo] = useState(false);
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [colorList, setColorList] = useState([]); // [{name, hex}]
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
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
      promotion: false,
      isNew: false
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sincronizar sizeStockMap quando o campo de tamanhos muda
  const watchedSizes = watch('sizes');
  useEffect(() => {
    if (!watchedSizes) return;
    const sizeList = watchedSizes.split(',').map(s => s.trim()).filter(Boolean);
    setSizeStockMap(prev => {
      const next = {};
      sizeList.forEach(size => {
        next[size] = prev[size] ?? 0;
      });
      return next;
    });
  }, [watchedSizes]);

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
      setValue('isNew', product.isNew || false);
      // Preencher estoque por tamanho
      if (product.sizeStock) {
        try { setSizeStockMap(JSON.parse(product.sizeStock)); }
        catch { setSizeStockMap({}); }
      } else {
        setSizeStockMap({});
      }
      // Preencher imagens existentes
      let existingImgs = [];
      if (product.images) {
        try { existingImgs = JSON.parse(product.images); } catch {}
      }
      if (existingImgs.length === 0 && product.imageUrl) {
        existingImgs = [product.imageUrl];
      }
      setExistingImages(existingImgs);
      setSelectedImages([]);
      setImagePreviews([]);
      // Vídeo existente
      setExistingVideoUrl(product.videoUrl || null);
      setSelectedVideo(null);
      setVideoPreview(null);
      setRemoveVideo(false);
      // Cores existentes
      if (product.colors) {
        try { setColorList(JSON.parse(product.colors)); }
        catch { setColorList([]); }
      } else {
        setColorList([]);
      }
      setColorName('');
      setColorHex('#000000');
    } else {
      setEditingProduct(null);
      reset();
      setExistingImages([]);
      setSelectedImages([]);
      setImagePreviews([]);
      setExistingVideoUrl(null);
      setSelectedVideo(null);
      setVideoPreview(null);
      setRemoveVideo(false);
      setSizeStockMap({});
      setColorList([]);
      setColorName('');
      setColorHex('#000000');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setExistingImages([]);
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingVideoUrl(null);
    setSelectedVideo(null);
    setVideoPreview(null);
    setRemoveVideo(false);
    setSizeStockMap({});
    setColorList([]);
    setColorName('');
    setColorHex('#000000');
    reset();
  };

  const totalImages = existingImages.length + selectedImages.length;

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - totalImages;
    const toAdd = files.slice(0, remaining);
    const newPreviews = [];
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === toAdd.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    setSelectedImages(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setRemoveVideo(false);
    }
    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setExistingVideoUrl(null);
    setRemoveVideo(true);
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
      formData.append('sizeStock', JSON.stringify(sizeStockMap));
      formData.append('colors', JSON.stringify(colorList));
      formData.append('sizes', data.sizes);
      formData.append('isFeatured', data.featured);
      formData.append('isPromotion', data.promotion);
      formData.append('isNew', data.isNew || false);
      formData.append('existingImages', JSON.stringify(existingImages));

      if (removeVideo) {
        formData.append('removeVideo', 'true');
      } else if (existingVideoUrl) {
        formData.append('existingVideoUrl', existingVideoUrl);
      }

      if (data.discountPrice) {
        formData.append('discountPrice', data.discountPrice);
      }

      // Novas imagens
      selectedImages.forEach(file => formData.append('images', file));

      // Novo vídeo
      if (selectedVideo) {
        formData.append('video', selectedVideo);
      }

      if (editingProduct) {
        // Atualizar
        const updated = await updateProduct(editingProduct.id, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Criar - imagem é obrigatória para novos produtos
        if (totalImages === 0 && selectedImages.length === 0) {
          toast.error('Selecione ao menos uma imagem para o produto');
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

  const handleToggleNew = async (productId) => {
    try {
      const updated = await toggleNew(productId);
      setProducts(products.map(p => p.id === productId ? updated : p));
      toast.success('Status de lançamento atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar lançamento');
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

  const filteredProducts = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory && p.category !== filterCategory) return false;
    if (filterStatus === 'featured' && !p.isFeatured) return false;
    if (filterStatus === 'promotion' && !p.isPromotion) return false;
    if (filterStatus === 'new' && !p.isNew) return false;
    if (filterStatus === 'outofstock' && p.stock > 0) return false;
    if (filterStatus === 'lowstock' && (p.stock === 0 || p.stock > 10)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-1">Produtos</h1>
          <p className="text-sm text-gray-600">{filteredProducts.length} de {products.length} produtos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <FiPlus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Todas Categorias</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Todos Status</option>
          <option value="featured">Destaques</option>
          <option value="promotion">Promoções</option>
          <option value="new">Lançamentos</option>
          <option value="lowstock">Estoque Baixo</option>
          <option value="outofstock">Sem Estoque</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Produto
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Categoria
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Preço
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Estoque
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl.startsWith('/uploads') ? `${API_URL}${product.imageUrl}` : product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 hidden sm:block">
                            #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-gray-700">
                      {product.category}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                            {formatPrice(product.discountPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            product.isFeatured
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Destaque"
                        >
                          <FiStar size={14} />
                        </button>
                        <button
                          onClick={() => handleTogglePromotion(product.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            product.isPromotion
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Promoção"
                        >
                          <FiTrendingUp size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleNew(product.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            product.isNew
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Lançamento"
                        >
                          <FiZap size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <FiTrash2 size={16} />
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <h2 className="text-lg sm:text-2xl font-bold text-text">
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5">
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
                <RichTextEditor
                  value={watch('description')}
                  onChange={html => setValue('description', html)}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Imagens do Produto */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Imagens do Produto
                  <span className="ml-2 text-gray-400 font-normal">({totalImages}/5)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {/* Imagens existentes */}
                  {existingImages.map((url, idx) => (
                    <div key={`ex-${idx}`} className="relative w-20 h-20">
                      <img
                        src={url}
                        alt={`Imagem ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-primary/80 rounded-b-lg py-0.5">Principal</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  {/* Novas imagens (preview local) */}
                  {imagePreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative w-20 h-20">
                      <img
                        src={src}
                        alt={`Nova ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-dashed border-primary"
                      />
                      {existingImages.length === 0 && idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-primary/80 rounded-b-lg py-0.5">Principal</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  {/* Botão adicionar */}
                  {totalImages < 5 && (
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 transition-colors text-gray-400">
                      <FiUpload size={18} />
                      <span className="text-xs mt-1">Adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP ou GIF — máx. 5 imagens, 50MB cada. A primeira é a principal.</p>
              </div>

              {/* Vídeo do Produto */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Vídeo do Produto (Opcional)
                </label>
                {(existingVideoUrl || videoPreview) ? (
                  <div className="flex items-start gap-3">
                    <video
                      src={videoPreview || existingVideoUrl}
                      className="w-40 h-28 rounded-lg object-cover border border-gray-200"
                      controls={false}
                      muted
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                    >
                      <FiX size={16} /> Remover vídeo
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 transition-colors w-fit">
                    <FiUpload className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-500">Clique para selecionar vídeo</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-400 mt-1">MP4, MOV ou WebM — máx. 50MB</p>
              </div>

              {/* Grid 2 Colunas */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category - Multiple */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text mb-2">
                    Categorias (selecione uma ou mais)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                      const currentCats = (watch('category') || '').split(',').map(c => c.trim()).filter(Boolean);
                      const isSelected = currentCats.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            let updated;
                            if (isSelected) {
                              updated = currentCats.filter(c => c !== cat);
                            } else {
                              updated = [...currentCats, cat];
                            }
                            setValue('category', updated.join(','));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...register('category')} />
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

              {/* Estoque por tamanho */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Estoque por Tamanho
                  <span className="ml-2 text-gray-400 font-normal">
                    (Total: {Object.values(sizeStockMap).reduce((a, b) => a + b, 0)} un.)
                  </span>
                </label>
                {Object.keys(sizeStockMap).length === 0 ? (
                  <p className="text-sm text-gray-400">Preencha os tamanhos acima para definir o estoque por tamanho</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.entries(sizeStockMap).map(([size, qty]) => (
                      <div key={size} className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase">{size}</span>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={e => setSizeStockMap(prev => ({
                            ...prev,
                            [size]: parseInt(e.target.value) || 0
                          }))}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cores */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Cores Disponíveis (Opcional)
                </label>
                {/* Lista de cores adicionadas */}
                {colorList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {colorList.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-sm">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => setColorList(prev => prev.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Adicionar cor */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={e => setColorHex(e.target.value)}
                    className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5"
                    title="Escolher cor"
                  />
                  <input
                    type="text"
                    value={colorName}
                    onChange={e => setColorName(e.target.value)}
                    placeholder="Nome da cor (ex: Preto)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (colorName.trim()) {
                          setColorList(prev => [...prev, { name: colorName.trim(), hex: colorHex }]);
                          setColorName('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (colorName.trim()) {
                        setColorList(prev => [...prev, { name: colorName.trim(), hex: colorHex }]);
                        setColorName('');
                      }
                    }}
                    className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    + Adicionar
                  </button>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isNew')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-text">Lançamento</span>
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
