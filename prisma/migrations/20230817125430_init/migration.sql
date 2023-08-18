-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "market" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceFeature" (
    "id" SERIAL NOT NULL,
    "displayPriority" INTEGER NOT NULL,
    "allowance" INTEGER NOT NULL,
    "priceId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "PriceFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceFeature_priceId_key" ON "PriceFeature"("priceId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceFeature_featureId_key" ON "PriceFeature"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPlan_AB_unique" ON "_CategoryToPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPlan_B_index" ON "_CategoryToPlan"("B");

-- AddForeignKey
ALTER TABLE "PriceFeature" ADD CONSTRAINT "PriceFeature_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceFeature" ADD CONSTRAINT "PriceFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceFeature" ADD CONSTRAINT "PriceFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPlan" ADD CONSTRAINT "_CategoryToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPlan" ADD CONSTRAINT "_CategoryToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
