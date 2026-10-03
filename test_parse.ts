const responseText = "```json\n[\n  {\n    \"title\": \"Matemáticas\",\n    \"dayOfWeek\": 1,\n    \"startTime\": \"09:00\",\n    \"endTime\": \"10:00\",\n    \"location\": null\n  }\n]\n```";

let cleanText = responseText.replace(/```(?:json)?/gi, "").trim();

const extractJsonArray = (text: string): string | null => {
  const start = text.indexOf('[');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '[') depth++;
      else if (char === ']') {
        depth--;
        if (depth === 0) {
          return text.substring(start, i + 1);
        }
      }
    }
  }
  return null;
};

const fixJson = (text: string) => {
  return text
    .replace(/,\s*([\]}])/g, "$1") // fix trailing commas
    .replace(/[\n\r\t]/g, " ");    // replace control chars with space to prevent string parsing errors
};

const parseAttempts = [
  () => JSON.parse(cleanText),
  () => JSON.parse(fixJson(cleanText))
];

const extracted = extractJsonArray(cleanText);
if (extracted) {
  parseAttempts.push(() => JSON.parse(extracted));
  parseAttempts.push(() => JSON.parse(fixJson(extracted)));
}

let parsedEvents: any = null;
for (const attempt of parseAttempts) {
  try {
    const result = attempt();
    if (Array.isArray(result)) {
      parsedEvents = result;
      break;
    }
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      for (const key of Object.keys(result)) {
        if (Array.isArray(result[key])) {
          parsedEvents = result[key];
          break;
        }
      }
      if (parsedEvents) break;
    }
  } catch (e) {
    console.error("Attempt failed", e.message);
  }
}

console.log(parsedEvents);
