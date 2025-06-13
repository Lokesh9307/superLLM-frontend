// Extended formatResponse function
export const formatResponse = (text: string) => {
  // Remove all markdown
  let formatted = text.replace(/\*\*/g, '')
                     .replace(/`/g, '')
                     .replace(/#/g, '');

  // Format lists
  formatted = formatted.replace(/(\d+\.)\s/g, '\n$1 ');
  formatted = formatted.replace(/-\s/g, '\n• ');

  // Format sections
  formatted = formatted.replace(/([a-z])([A-Z])/g, '$1\n\n$2');

  // Clean up whitespace
  formatted = formatted.replace(/\s+/g, ' ')
                      .replace(/\n\s+\n/g, '\n\n')
                      .trim();

  return formatted;
};