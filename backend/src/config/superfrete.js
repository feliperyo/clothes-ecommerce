const axios = require('axios');

// API URL: sandbox para testes, produção para deploy
const SUPERFRETE_API_URL = process.env.SUPERFRETE_SANDBOX === 'true'
  ? 'https://sandbox.superfrete.com/api/v0'
  : 'https://superfrete.com/api/v0';

const superfreteApi = axios.create({
  baseURL: SUPERFRETE_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.SUPERFRETE_TOKEN || ''}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'AnaCurveShop/1.0'
  },
  timeout: 15000
});

// Endereço do remetente (loja) — configurável via variáveis de ambiente
const getSenderAddress = () => ({
  name: process.env.SUPERFRETE_FROM_NAME || 'Ana Curve Shop',
  email: process.env.SUPERFRETE_FROM_EMAIL || 'contato@anacurve.com',
  phone: (process.env.SUPERFRETE_FROM_PHONE || '11999999999').replace(/\D/g, ''),
  document: (process.env.SUPERFRETE_FROM_DOCUMENT || '').replace(/\D/g, ''),
  postal_code: (process.env.SUPERFRETE_FROM_CEP || '01310100').replace(/\D/g, ''),
  address: process.env.SUPERFRETE_FROM_ADDRESS || 'Rua Augusta',
  complement: process.env.SUPERFRETE_FROM_COMPLEMENT || null,
  number: process.env.SUPERFRETE_FROM_NUMBER || '1',
  district: process.env.SUPERFRETE_FROM_DISTRICT || 'Consolação',
  city: process.env.SUPERFRETE_FROM_CITY || 'São Paulo',
  state_abbr: process.env.SUPERFRETE_FROM_STATE || 'SP',
  country_id: 'BR'
});

// Calcular dimensões e peso do pacote baseado nos itens do pedido
// Peças de roupa plus size: ~0.4kg/peça, 5cm de altura por peça
const calculatePackage = (items = []) => {
  const totalQty = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
  const weight = Math.max(0.3, totalQty * 0.4);   // mínimo 300g
  const height = Math.min(5 + totalQty * 3, 60);   // 5cm base + 3cm por peça

  return {
    height: Math.round(height),
    width: 30,
    length: 30,
    weight: parseFloat(weight.toFixed(2))
  };
};

// IDs de serviços disponíveis no Super Frete
const SUPERFRETE_SERVICES = '1,2,3,4,7,8,9,10,11,12,13,14,15,16,17';

module.exports = { superfreteApi, getSenderAddress, calculatePackage, SUPERFRETE_SERVICES };
