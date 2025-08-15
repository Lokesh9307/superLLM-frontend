// utils/structuredResponse.ts
export function formatChatbotResponse(text: string): string {
  // Basic transformation: handle bullet points and paragraphs
  const lines = text
    .split(/\n+/)
    .map((line) => {
      if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
        return `<li>${line.replace(/^(\*|-)\s*/, "")}</li>`;
      }
      return `<p>${line}</p>`;
    })
    .join("");

  // Wrap in <ul> if any list items exist
  const wrapped =
    lines.includes("<li>") ? lines.replace(/<li>[\s\S]*<\/li>/g
, "<ul>$1</ul>") : lines;

  return wrapped;
}
