const prisma = global.prisma;
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurar Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TOKEN'
});

// Gerar número de pedido único
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AC-${year}${month}${day}-${random}`;
};

// POST /api/orders - Criar pedido
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      address,
      items,
      paymentMethod,
      shippingCost,
      discount = 0
    } = req.body;

    // Validar dados obrigatórios
    if (!customer || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Calcular totais
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ error: `Produto ${item.productId} não encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Estoque insuficiente para ${product.name}`
        });
      }

      const price = product.discountPrice || product.price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productPrice: price,
        size: item.size,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    const total = subtotal + shippingCost - discount;

    // Criar pedido no banco
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerCPF: customer.cpf,
        zipCode: address.zipCode,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        subtotal,
        shippingCost,
        discount,
        total,
        paymentMethod,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    // Criar preferência de pagamento no Mercado Pago
    try {
      const preference = {
        items: [
          {
            title: `Pedido AC Ana Curve - ${order.orderNumber}`,
            description: orderItems.map(i => i.productName).join(', '),
            quantity: 1,
            currency_id: 'BRL',
            unit_price: parseFloat(total.toFixed(2))
          }
        ],
        payer: {
          name: customer.name,
          email: customer.email,
          phone: {
            number: customer.phone
          },
          identification: {
            type: 'CPF',
            number: customer.cpf
          },
          address: {
            zip_code: address.zipCode,
            street_name: address.street,
            street_number: address.number
          }
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pedido-confirmado/${order.orderNumber}`,
          failure: `${process.env.FRONTEND_URL}/checkout?error=payment_failed`,
          pending: `${process.env.FRONTEND_URL}/pedido-confirmado/${order.orderNumber}`
        },
        auto_return: 'approved',
        external_reference: order.id.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
        statement_descriptor: 'AC ANA CURVE',
        payment_methods: {
          installments: 12
        }
      };

      const preferenceClient = new Preference(client);
      const response = await preferenceClient.create({ body: preference });

      // Atualizar pedido com ID do Mercado Pago
      await prisma.order.update({
        where: { id: order.id },
        data: { mercadopagoId: response.id }
      });

      res.status(201).json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        checkoutUrl: response.init_point,
        sandboxUrl: response.sandbox_init_point
      });
    } catch (mpError) {
      console.error('Mercado Pago error:', mpError);
      // Se falhar o Mercado Pago, ainda retorna o pedido criado
      res.status(201).json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        error: 'Erro ao criar pagamento, entre em contato'
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

// GET /api/orders/:orderNumber - Detalhes do pedido
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

module.exports = {
  createOrder,
  getOrderByNumber
};
