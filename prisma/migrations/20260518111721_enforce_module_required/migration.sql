/*
  Warnings:

  - A unique constraint covering the columns `[module_id,order_index]` on the table `problems` will be added. If there are existing duplicate values, this will fail.
  - Made the column `module_id` on table `problems` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "problems" DROP CONSTRAINT "problems_module_id_fkey";

-- AlterTable
ALTER TABLE "problems" ALTER COLUMN "module_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "problems_module_id_order_index_key" ON "problems"("module_id", "order_index");

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
