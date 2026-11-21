// Datos de contacto de Asteria Store
export const WHATSAPP_DISPLAY = "+502 3719-0890";
export const WHATSAPP_NUMBER = "50237190890";
export const FACEBOOK_URL = "https://www.facebook.com/share/1EikqrBhY4/";
export const INSTAGRAM_URL = "https://www.instagram.com/asteriastore.gt";
export const TIKTOK_URL = "https://www.tiktok.com/@asteria.store.gt";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola Asteria Store, quiero más información sobre sus productos.";
