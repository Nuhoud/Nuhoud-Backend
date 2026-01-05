import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as Minio from "minio";
import { randomUUID } from "crypto";

@Injectable()
export class Minios3Service {
  private client: Minio.Client;
  private avatarsBucket = process.env.S3_BUCKET_AVATARS || "avatars";

  
  private publicBaseUrl = (process.env.S3_PUBLIC_BASE_URL || "http://localhost:9000")
    .replace(/\/$/, "");

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

  buildPublicUrl(bucket: string, objectKey: string) {
    const safeBucket = encodeURIComponent(bucket);
    const safeKey = objectKey.split("/").map(encodeURIComponent).join("/");
    return `${this.publicBaseUrl}/${safeBucket}/${safeKey}`;
  }

  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    try {
      const extension = this.ext(file.mimetype);
      const objectKey = `users/${userId}/avatar-${Date.now()}-${randomUUID()}.${extension}`;

      await this.client.putObject(
        this.avatarsBucket,
        objectKey,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );

      return { bucket: this.avatarsBucket, objectKey };
    } catch (e) {
      throw new InternalServerErrorException("Failed to upload avatar");
    }
  }

}
