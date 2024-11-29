/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `UserRoles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_role_name_key" ON "UserRoles"("role_name");
