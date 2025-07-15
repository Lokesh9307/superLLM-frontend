export function removeThoughtTags(text: string): string {
  let cleaned = text;

  // Step 1: Remove <think>...</think> blocks
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Step 2: Remove all markdown headers (like ###, ##, #) across lines
  cleaned = cleaned.replace(/^#{1,6}\s.*$/gm, '');  // Remove markdown headers like ### Header

  // Step 3: Remove leading/trailing markdown symbols from entire text
  cleaned = cleaned.replace(/^[\*\#\-\s]+|[\*\#\-\s]+$/g, '');

  // Step 4: Remove markdown bold/italic anywhere
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  cleaned = cleaned.replace(/__(.*?)__/g, '$1');
  cleaned = cleaned.replace(/_(.*?)_/g, '$1');

  // Step 5: Remove typical AI lead phrases
  cleaned = cleaned.replace(/^(Based on the context.*?:|Here’s|You should|To answer your question.*?:|Therefore,|Thus,|In summary,)/i, '').trim();

  // Step 6: Remove extra blank lines
  cleaned = cleaned.replace(/^\s*[\r\n]/gm, '');

  return cleaned.trim();
}
