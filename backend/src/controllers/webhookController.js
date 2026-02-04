const prisma = global.prisma;
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configurar Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TOKEN'
});

// POST /api/webhooks/mercadopago - Webhook do Mercado Pago
const handleMercadoPagoWebhook = async (req, res) => {
  try {
    // Mercado Pago envia notificações de diferentes tipos
    const { type, data } = req.body;

    console.log('Webhook received:', { type, data });

    // Só processar notificações de pagamento
    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar informações do pagamento
      const paymentClient = new Payment(client);
      const paymentData = await paymentClient.get({ id: paymentId });

      console.log('Payment data:', paymentData);

      // Buscar pedido pelo external_reference
      const orderId = parseInt(paymentData.external_reference);
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        console.error('Order not found:', orderId);
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Atualizar status do pedido baseado no status do pagamento
      let paymentStatus = 'PENDING';

      switch (paymentData.status) {
        case 'approved':
          paymentStatus = 'PAID';
          // Reduzir estoque dos produtos
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity
                }
              }
            });
          }
          break;
        case 'rejected':
        case 'cancelled':
          paymentStatus = 'CANCELLED';
          break;
        case 'refunded':
          paymentStatus = 'REFUNDED';
          // Restaurar estoque
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity
                }
              }
            });
          }
          break;
        default:
          paymentStatus = 'PENDING';
      }

      // Atualizar pedido
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus,
          mercadopagoId: paymentData.id.toString()
        }
      });

      console.log('Order updated:', orderId, paymentStatus);
    }

    // Sempre retornar 200 para o Mercado Pago
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Mesmo com erro, retornar 200 para não ficar recebendo notificações repetidas
    res.status(200).json({ received: true, error: error.message });
  }
};

module.exports = {
  handleMercadoPagoWebhook
};
