-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('SignUpOTP', 'PasswordOTP');

-- CreateTable
CREATE TABLE "Otp" (
    "otp_id" UUID NOT NULL,
    "otpType" "OtpType" NOT NULL DEFAULT 'SignUpOTP',
    "otp_code" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_user_id_key" ON "Otp"("user_id");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
