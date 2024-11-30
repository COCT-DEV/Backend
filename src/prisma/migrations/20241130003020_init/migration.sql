-- CreateEnum
CREATE TYPE "AssignableRole" AS ENUM ('USHER', 'CHOIR_MEMBER', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "RequestableRole" AS ENUM ('FACILITATOR', 'PREACHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Version" AS ENUM ('ENGLISH', 'TWI');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(1000) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "notification_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "church_of_user" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "UserPermissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(50) NOT NULL DEFAULT 'CanWrite',
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "UserPermissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "announcement_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "message" VARCHAR(100) NOT NULL,
    "user_id" UUID NOT NULL,
    "event_id" UUID,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "role_assignments" (
    "assignment_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,
    "week_start_date" TIMESTAMP(3) NOT NULL,
    "event_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "sermons" (
    "sermon_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "preacher_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "audio_url" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sermons_pkey" PRIMARY KEY ("sermon_id")
);

-- CreateTable
CREATE TABLE "study_guides" (
    "guide_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "facilitator_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_guides_pkey" PRIMARY KEY ("guide_id")
);

-- CreateTable
CREATE TABLE "role_requests" (
    "request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reviewed_by" UUID,
    "requested_role" "RequestableRole" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "reviewed_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "Hymn" (
    "id" TEXT NOT NULL,
    "hymn_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lyrics" TEXT NOT NULL,

    CONSTRAINT "Hymn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HymnVersion" (
    "hymn_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "version" "Version" NOT NULL,

    CONSTRAINT "HymnVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_role_name_key" ON "UserRoles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "sermons_preacher_id_key" ON "sermons"("preacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_requests_user_id_key" ON "role_requests"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "UserRoles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "UserRoles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sermons" ADD CONSTRAINT "sermons_preacher_id_fkey" FOREIGN KEY ("preacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_guides" ADD CONSTRAINT "study_guides_facilitator_id_fkey" FOREIGN KEY ("facilitator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HymnVersion" ADD CONSTRAINT "HymnVersion_hymn_id_fkey" FOREIGN KEY ("hymn_id") REFERENCES "Hymn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
