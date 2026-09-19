export const COMPANY = {
  name: "Bookkeeply",
  tagline: "Smart bookkeeping for modern businesses. Record today, understand tomorrow.",
  story:
    "Bookkeeply is a Ghanaian bookkeeping workspace built for small businesses. We help shops, traders and growing teams record income, expenses and invoices in Ghana cedis, inside one business workspace instead of scattered notebooks and complicated accounting software.",
  address: "12 Market Street",
  city: "Accra, Greater Accra",
  country: "Ghana",
  fullAddress: "12 Market Street, Accra, Greater Accra, Ghana",
  whatsappE164: "233244266466",
  whatsappDisplay: "024 426 6466",
};

export function whatsappHelpUrl(context = "") {
  const text = context
    ? `Hello Bookkeeply super admin, I need help with ${context}.`
    : "Hello Bookkeeply super admin, I need help or assistance with my Bookkeeply account.";
  return `https://wa.me/${COMPANY.whatsappE164}?text=${encodeURIComponent(text)}`;
}
