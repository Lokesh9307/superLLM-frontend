export function formatUsernameAsName(email: string): string {
  const [username] = email.split("@");

  // Remove digits
  const noDigits = username.replace(/\d+/g, "");

  // Add space before capital letters (camelCase), if any
  const spaced = noDigits.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Split on non-alphabets (optional) and capitalize
  const parts = spaced.split(/[^a-zA-Z]/).filter(Boolean);
  const capitalized = parts.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return capitalized.join(" ") || "Anonymous";
}

