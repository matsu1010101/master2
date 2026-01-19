-- CreateTable
CREATE TABLE "Menu" (
    "menuId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_menuId_key" ON "Menu"("menuId");
