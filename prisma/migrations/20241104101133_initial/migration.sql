-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('todo', 'inProgress', 'done');

-- CreateTable
CREATE TABLE "Column" (
    "title" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "due" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "status" "TaskState" NOT NULL DEFAULT 'todo',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColumnToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ColumnToTask_AB_unique" ON "_ColumnToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ColumnToTask_B_index" ON "_ColumnToTask"("B");

-- AddForeignKey
ALTER TABLE "_ColumnToTask" ADD CONSTRAINT "_ColumnToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColumnToTask" ADD CONSTRAINT "_ColumnToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
