import cloudinary from './cloudinary';

export async function uploadImageToCloudinary(
  file: File,
  folder?: string
): Promise<{ secure_url: string; public_id: string; url: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: folder || 'ilmspace/images',
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      url: result.url
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}
