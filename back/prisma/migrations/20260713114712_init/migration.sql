-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(20) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availabilities" (
    "id" SERIAL NOT NULL,
    "room_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_availabilities_room_date" ON "availabilities"("room_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "availabilities_room_id_date_nickname_key" ON "availabilities"("room_id", "date", "nickname");

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
