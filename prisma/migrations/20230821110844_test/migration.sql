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
    "planId" INTEGER NOT NULL,
    "priceFeatureId" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceFeature" (
    "id" SERIAL NOT NULL,
    "displayPriority" INTEGER NOT NULL,
    "allowance" INTEGER NOT NULL,
    "priceId" INTEGER NOT NULL,

    CONSTRAINT "PriceFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "priceFeatureId" INTEGER NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Price_priceFeatureId_key" ON "Price"("priceFeatureId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_priceFeatureId_key" ON "Feature"("priceFeatureId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_priceFeatureId_fkey" FOREIGN KEY ("priceFeatureId") REFERENCES "PriceFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_priceFeatureId_fkey" FOREIGN KEY ("priceFeatureId") REFERENCES "PriceFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
