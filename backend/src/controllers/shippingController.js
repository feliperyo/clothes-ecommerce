const { superfreteApi, getSenderAddress, calculatePackage, SUPERFRETE_SERVICES } = require('../config/superfrete');

const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 599;

// Fallback de frete por região (quando Super Frete não responder)
const getFallbackShipping = (cep) => {
  const region = (cep || '0').charAt(0);
  const rates = { '0': 22, '1': 27, '2': 32, '3': 37, '4': 42, '5': 47, '6': 52, '7': 57, '8': 62, '9': 65 };
  const base = rates[region] || 32;
  return [
    { id: 1, name: 'PAC', company: 'Correios', price: base, delivery_time: 8 },
    { id: 2, name: 'SEDEX', company: 'Correios', price: base + 18, delivery_time: 3 }
  ];
};

// POST /api/shipping/quote
const getShippingQuote = async (req, res) => {
  const { cep, items = [], totalValue = 0 } = req.body;

  if (!cep) return res.status(400).json({ error: 'CEP obrigatório' });
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return res.status(400).json({ error: 'CEP inválido' });

  // Frete grátis
  if (parseFloat(totalValue) >= FREE_SHIPPING_THRESHOLD) {
    return res.json({ freeShipping: true, options: [] });
  }

  // Sem token configurado → fallback
  if (!process.env.SUPERFRETE_TOKEN) {
    return res.json({ freeShipping: false, options: getFallbackShipping(cleanCep), fallback: true });
  }

  try {
    const pkg = calculatePackage(items);
    const insuranceValue = Math.max(parseFloat(totalValue) || 1, 1);

    const response = await superfreteApi.post('/calculator', {
      from: { postal_code: (process.env.SUPERFRETE_FROM_CEP || '01310100').replace(/\D/g, '') },
      to: { postal_code: cleanCep },
      package: pkg,
      options: {
        insurance_value: parseFloat(insuranceValue.toFixed(2)),
        receipt: false,
        own_hand: false
      },
      services: SUPERFRETE_SERVICES
    });

    const options = (Array.isArray(response.data) ? response.data : [])
      .filter(opt => !opt.error && opt.price)
      .map(opt => ({
        id: opt.id,
        name: opt.name,
        company: opt.company?.name || '',
        price: parseFloat(parseFloat(opt.price).toFixed(2)),
        delivery_time: opt.delivery_time,
        currency: 'R$'
      }))
      .sort((a, b) => a.price - b.price);

    if (options.length === 0) {
      return res.json({ freeShipping: false, options: getFallbackShipping(cleanCep), fallback: true });
    }

    res.json({ freeShipping: false, options });
  } catch (err) {
    console.error('[SuperFrete] Quote error:', err.response?.data || err.message);
    res.json({ freeShipping: false, options: getFallbackShipping(cleanCep), fallback: true });
  }
};

// POST /api/admin/orders/:id/generate-label — gera etiqueta no Super Frete
const generateShippingLabel = async (req, res) => {
  const prisma = global.prisma;
  const orderId = parseInt(req.params.id);

  if (!process.env.SUPERFRETE_TOKEN) {
    return res.status(400).json({ error: 'Super Frete não configurado. Adicione SUPERFRETE_TOKEN ao .env' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    // Se já tem etiqueta gerada, retorna ela
    if (order.superfreteLabel) {
      return res.json({ label: order.superfreteLabel, superfreteOrderId: order.superfreteOrderId });
    }

    const pkg = calculatePackage(order.items);
    const serviceId = order.shippingServiceId || 1; // PAC como padrão

    // 1. Criar pedido no Super Frete
    const sfOrderPayload = {
      service_id: serviceId,
      agency_id: null,
      from: getSenderAddress(),
      to: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone.replace(/\D/g, ''),
        document: order.customerCPF.replace(/\D/g, ''),
        postal_code: order.zipCode.replace(/\D/g, ''),
        address: order.street,
        complement: order.complement || null,
        number: order.number,
        district: order.neighborhood,
        city: order.city,
        state_abbr: order.state,
        country_id: 'BR'
      },
      products: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        unitary_value: parseFloat(item.productPrice.toFixed(2)),
        weight: 0.4
      })),
      package: pkg,
      options: {
        insurance_value: parseFloat(order.total.toFixed(2)),
        receipt: false,
        own_hand: false,
        non_commercial: true
      },
      volumes: [pkg]
    };

    const sfCreateRes = await superfreteApi.post('/orders', sfOrderPayload);
    const sfOrderId = sfCreateRes.data?.id;

    if (!sfOrderId) {
      throw new Error('Super Frete não retornou ID do pedido');
    }

    // 2. Checkout do pedido (usa saldo Super Frete)
    await superfreteApi.post('/orders/checkout', { orders: [sfOrderId] });

    // 3. Gerar etiqueta
    await superfreteApi.post('/orders/generate', { orders: [sfOrderId] });

    // 4. Buscar URL da etiqueta
    const sfDetailRes = await superfreteApi.get(`/orders/${sfOrderId}`);
    const labelUrl = sfDetailRes.data?.label?.url
      || sfDetailRes.data?.label_url
      || `https://superfrete.com/pedidos/${sfOrderId}`;

    // 5. Salvar no banco
    await prisma.order.update({
      where: { id: orderId },
      data: { superfreteOrderId: sfOrderId, superfreteLabel: labelUrl }
    });

    res.json({ label: labelUrl, superfreteOrderId: sfOrderId });
  } catch (err) {
    console.error('[SuperFrete] Label error:', err.response?.data || err.message);
    const msg = err.response?.data?.message || err.response?.data?.error || err.message;
    res.status(500).json({ error: `Erro ao gerar etiqueta: ${msg}` });
  }
};

module.exports = { getShippingQuote, generateShippingLabel };
