-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_hasblocked_fkey" FOREIGN KEY ("hasblocked") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
