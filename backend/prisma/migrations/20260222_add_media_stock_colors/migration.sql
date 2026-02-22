-- AlterTable: adicionar suporte a múltiplas imagens, vídeo, estoque por tamanho e cores
ALTER TABLE "Product" ADD COLUMN "images" TEXT;
ALTER TABLE "Product" ADD COLUMN "videoUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "sizeStock" TEXT;
ALTER TABLE "Product" ADD COLUMN "colors" TEXT;
