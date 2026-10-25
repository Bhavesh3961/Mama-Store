export const store = {
  name: "Mama Store",
  shortName: "Mama",
  tagline: "Beauty essentials for everyday rituals.",
  city: "Pali",
  state: "Rajasthan",
  pincode: "306401",
  address: "Khanchachiyo Ka Bas, Pani Darwaja, Nadi Mohalla, Pali, Rajasthan 306401",
  addressLines: [
    "Khanchachiyo Ka Bas",
    "Pani Darwaja, Nadi Mohalla",
    "Pali, Rajasthan 306401",
  ],
  mapsUrl: "https://maps.app.goo.gl/2Zt3n78XvC6pTH5j8?g_st=aw",
  hours: "Open daily. Confirm timing on WhatsApp before visiting.",
  delivery: "Delivery within Pali city. Charges and slot are confirmed at checkout.",
  deliveryFee: 40,
  freeDeliveryOver: 799,
  /**
   * Store WhatsApp in international format without +.
   * Leave empty until the real number is provided — buttons still open WhatsApp with a prefilled message.
   */
  whatsappNumber: "917689956116",
  phone: "+91 89495 49324",
  phoneTel: "+918949549324",
  catalogueNotice:
    "100% authentic cosmetics, verified salon brands, and city delivery in Pali.",
} as const;

export type Store = typeof store;
