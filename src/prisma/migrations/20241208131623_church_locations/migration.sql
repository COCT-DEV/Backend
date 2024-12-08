-- CreateTable
CREATE TABLE "ChurchLocations" (
    "location_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "map_url" "Status" NOT NULL,

    CONSTRAINT "ChurchLocations_pkey" PRIMARY KEY ("location_id")
);
