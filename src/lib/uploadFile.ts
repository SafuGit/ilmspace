import cloudinary from "./cloudinary";

export async function uploadFile(
  fileBuffer: Buffer,
  userId: string,
  filename: string
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadPromise = new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `books/${userId}`,
          resource_type: "raw",
          public_id: filename,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    const uploaded = await uploadPromise;
    return {
      url: uploaded.url,
      secure_url: uploaded.secure_url,
      public_id: uploaded.public_id,
      bytes: uploaded.bytes,
    };
  } catch (err) {
    console.error(err);
    throw new Error("File upload failed");
  }
}
