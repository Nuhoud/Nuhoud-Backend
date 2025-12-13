import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as Minio from "minio";
import { randomUUID } from "crypto";

@Injectable()
export class Minios3Service {
  private client: Minio.Client;
  private avatarsBucket = process.env.S3_BUCKET_AVATARS || "avatars";

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.S3_ENDPOINT || "localhost",
      port: Number(process.env.S3_PORT || 9000),
      useSSL: (process.env.S3_USE_SSL || "false") === "true",
      accessKey: process.env.S3_ACCESS_KEY!,
      secretKey: process.env.S3_SECRET_KEY!,
    });
  }

  private ext(mime: string) {
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    return "bin";
  }

  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    try {
      const objectKey = `users/${userId}/avatar-${randomUUID()}.${this.ext(file.mimetype)}`;
        
      await this.client.putObject(
        this.avatarsBucket,
        objectKey,
        file.buffer,
        file.size,
        { "Content-Type": file.mimetype }
      );

      return { bucket: this.avatarsBucket, objectKey };
    } catch (e) {
      throw new InternalServerErrorException("فشل رفع الصورة إلى MinIO");
    }
  }

  async presignedGet(bucket: string, objectKey: string, expirySeconds = 3600) {
    try {
      return await this.client.presignedGetObject(bucket, objectKey, expirySeconds);
    } catch {
      throw new InternalServerErrorException("فشل إنشاء رابط signed للصورة");
    }
  }
}
