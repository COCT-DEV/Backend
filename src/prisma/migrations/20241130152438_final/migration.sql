-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
