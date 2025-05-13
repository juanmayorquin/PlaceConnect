import { supabase } from "./supabaseClient";
import imageCompression from "browser-image-compression";

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  // Opciones para convertir a WebP y limitar tamaño
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    fileType: "image/webp",
  });

  const fileName = `${userId}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, compressed, { upsert: true });

  if (error) throw error;

  // Obtén la URL pública
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
