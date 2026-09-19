export const COMPANY = {
  name: "Bookkeeply",
  tagline: "Smart bookkeeping for modern businesses. Record today, understand tomorrow.",
  story:
    "Bookkeeply is an online bookkeeping workspace for small businesses. We help shops, traders and growing teams record income, expenses and invoices in one secure workspace, instead of scattered notebooks and complicated accounting software.",
  whatsappE164: "233244266466",
  whatsappDisplay: "024 426 6466",
};

export function whatsappHelpUrl(context = "") {
  const text = context
    ? `Hello Bookkeeply super admin, I need help with ${context}.`
    : "Hello Bookkeeply super admin, I need help or assistance with my Bookkeeply account.";
  return `https://wa.me/${COMPANY.whatsappE164}?text=${encodeURIComponent(text)}`;
}
