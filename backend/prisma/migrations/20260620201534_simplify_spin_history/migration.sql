/*
  Warnings:

  - You are about to drop the column `bet_amount` on the `spin_history` table. All the data in the column will be lost.
  - You are about to drop the column `net_amount` on the `spin_history` table. All the data in the column will be lost.
  - You are about to drop the column `payout_amount` on the `spin_history` table. All the data in the column will be lost.
  - You are about to drop the column `reel1_symbol` on the `spin_history` table. All the data in the column will be lost.
  - You are about to drop the column `reel2_symbol` on the `spin_history` table. All the data in the column will be lost.
  - You are about to drop the column `reel3_symbol` on the `spin_history` table. All the data in the column will be lost.
  - Added the required column `amount` to the `spin_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spin_history" DROP COLUMN "bet_amount",
DROP COLUMN "net_amount",
DROP COLUMN "payout_amount",
DROP COLUMN "reel1_symbol",
DROP COLUMN "reel2_symbol",
DROP COLUMN "reel3_symbol",
ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL;
