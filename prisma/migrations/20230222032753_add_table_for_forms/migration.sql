-- CreateTable
CREATE TABLE "FormResults" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "formInput" JSONB NOT NULL,
    "results" JSONB,

    CONSTRAINT "FormResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormResults" ADD CONSTRAINT "FormResults_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
