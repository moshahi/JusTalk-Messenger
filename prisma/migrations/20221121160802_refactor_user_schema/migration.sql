-- AlterTable
ALTER TABLE "User" ADD COLUMN     "backgroundImg" TEXT NOT NULL DEFAULT 'https //res.cloudinary.com/dmgb7kvmn/image/upload/v1667480959/jusTalk/mmvx1frutemx1oefesta.jpg',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'earth',
ALTER COLUMN "description" SET DEFAULT 'I''m new to jus-talk!';
