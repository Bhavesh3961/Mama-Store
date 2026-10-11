import { store } from "@/data/store";
import { whatsappHref } from "@/lib/format";

export function WhatsAppFab() {
  return (
    <a
      className="whatsapp-fab wa-fab"
      href={whatsappHref(`Hello ${store.name}, I have a question about a product / order.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp the store"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.33 4.94L2 22l5.4-1.4a10 10 0 0 0 4.64 1.14h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.12c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.26-.3.58-.37.77-.37h.56c.18 0 .42-.07.66.5.24.6.82 2.07.9 2.22.07.15.12.32.02.52-.1.2-.14.32-.28.5-.14.17-.3.38-.42.51-.14.15-.28.3-.12.58.16.28.7 1.15 1.5 1.86 1.03.91 1.9 1.2 2.18 1.33.28.14.44.12.6-.07.17-.2.7-.81.89-1.1.18-.28.37-.23.62-.14.26.1 1.63.77 1.9.91.28.14.46.2.53.32.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
