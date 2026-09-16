import { STORE_CONFIG } from '@/config/store.config';

export function generateWhatsAppLink(message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
}
