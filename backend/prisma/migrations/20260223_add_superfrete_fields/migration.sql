-- AlterTable: adicionar campos de integração Super Frete no modelo Order
ALTER TABLE "Order" ADD COLUMN "shippingService"   TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingServiceId" INTEGER;
ALTER TABLE "Order" ADD COLUMN "superfreteOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN "superfreteLabel"   TEXT;
