const getPrisma = () => global.prisma;

// POST /api/coupons/validate - Validar cupom (público)
const validateCoupon = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código do cupom é obrigatório' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Cupom inativo' });
    }

    const sub = parseFloat(subtotal) || 0;
    const discountAmount = Math.round((sub * coupon.discountPercent / 100) * 100) / 100;

    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Erro ao validar cupom' });
  }
};

// GET /api/admin/coupons - Listar todos os cupons
const getAllCoupons = async (req, res) => {
  try {
    const prisma = getPrisma();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(coupons || []);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json([]);
  }
};

// POST /api/admin/coupons - Criar cupom
const createCoupon = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { code, discountPercent, isActive } = req.body;

    if (!code || !discountPercent) {
      return res.status(400).json({ error: 'Código e percentual são obrigatórios' });
    }

    const percent = parseInt(discountPercent);
    if (isNaN(percent) || percent < 1 || percent > 100) {
      return res.status(400).json({ error: 'Percentual deve ser entre 1 e 100' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountPercent: percent,
        isActive: isActive !== false
      }
    });

    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Já existe um cupom com este código' });
    }
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Erro ao criar cupom' });
  }
};

// PATCH /api/admin/coupons/:id/toggle - Ativar/desativar cupom
const toggleCoupon = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({ where: { id: parseInt(id) } });
    if (!coupon) return res.status(404).json({ error: 'Cupom não encontrado' });

    const updated = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { isActive: !coupon.isActive }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling coupon:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
};

// PATCH /api/admin/coupons/:id - Editar cupom
const updateCoupon = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;
    const { code, discountPercent, isActive } = req.body;

    const data = {};
    if (code) data.code = code.toUpperCase().trim();
    if (discountPercent !== undefined) {
      const percent = parseInt(discountPercent);
      if (!isNaN(percent) && percent >= 1 && percent <= 100) {
        data.discountPercent = percent;
      }
    }
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(updated);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Já existe um cupom com este código' });
    }
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
};

// DELETE /api/admin/coupons/:id - Deletar cupom
const deleteCoupon = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    await prisma.coupon.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Cupom deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Erro ao deletar cupom' });
  }
};

module.exports = { validateCoupon, getAllCoupons, createCoupon, toggleCoupon, updateCoupon, deleteCoupon };
