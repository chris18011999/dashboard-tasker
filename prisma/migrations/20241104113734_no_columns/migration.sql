/*
  Warnings:

  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ColumnToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ColumnToTask" DROP CONSTRAINT "_ColumnToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColumnToTask" DROP CONSTRAINT "_ColumnToTask_B_fkey";

-- DropTable
DROP TABLE "Column";

-- DropTable
DROP TABLE "_ColumnToTask";
