// phoneHelper.js
export function detectProvider(phone) {
    const digits = phone.replace(/\D/g, "");
    const telkomselPrefixes = [
      "0811",
      "0812",
      "0813",
      "0821",
      "0822",
      "0823",
      "0851",
      "0852",
      "0853",
      "0828",
    ];
    const indosatPrefixes = [
      "0814",
      "0815",
      "0816",
      "0855",
      "0856",
      "0857",
      "0858",
    ];
    const xlPrefixes = ["0817", "0818", "0819", "0859", "0877", "0878", "0879"];
    const triPrefixes = ["0895", "0896", "0897", "0898", "0899"];
    const smartfrenPrefixes = [
      "0881",
      "0882",
      "0883",
      "0884",
      "0885",
      "0886",
      "0887",
      "0888",
      "0889",
    ];
    const axisPrefixes = ["0831", "0832", "0833", "0838"];
  
    const prefix4 = digits.substring(0, 4);
    const prefix3 = digits.substring(0, 3);
  
    if (telkomselPrefixes.includes(prefix4) || telkomselPrefixes.includes(prefix3)) {
      return "Telkomsel";
    } else if (indosatPrefixes.includes(prefix4) || indosatPrefixes.includes(prefix3)) {
      return "Indosat";
    } else if (xlPrefixes.includes(prefix4) || xlPrefixes.includes(prefix3)) {
      return "XL";
    } else if (triPrefixes.includes(prefix4) || triPrefixes.includes(prefix3)) {
      return "Tri";
    } else if (smartfrenPrefixes.includes(prefix4) || smartfrenPrefixes.includes(prefix3)) {
      return "Smartfren";
    } else if (axisPrefixes.includes(prefix4) || axisPrefixes.includes(prefix3)) {
      return "Axis";
    }
    return "Unknown";
  }
  
  export function validatePhone(phone) {
    const digits = phone.replace(/\D/g, "");
    if (!digits.startsWith("0")) return false;
    if (digits.length < 9 || digits.length > 14) return false;
    return true;
  }

  export const providerColors = {
    Telkomsel: "text-red-500",
    Indosat: "text-yellow-500",
    XL: "text-blue-500",
    Tri: "text-green-500",
    Smartfren: "text-purple-500",
    Axis: "text-violet-600",
    Unknown: "text-gray-500",
  };