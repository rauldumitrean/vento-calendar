import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const fixJson = (text: string) => {
  return text
    .replace(/,\s*([\]}])/g, "$1") // fix trailing commas
    .replace(/[\n\r\t]/g, " ");    // replace control chars with space to prevent string parsing errors
};

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

function parseLogic(responseText: string) {
  let cleanText = responseText.replace(/```(?:json)?/gi, "").trim();
  let parsedEvents: any = null;
  
  const parseAttempts = [
    () => JSON.parse(cleanText),
    () => JSON.parse(fixJson(cleanText)),
    () => JSON.parse(cleanText + ']'),
    () => JSON.parse(cleanText + '}]'),
    () => JSON.parse(fixJson(cleanText) + ']'),
    () => JSON.parse(fixJson(cleanText) + '}]')
  ];

  const extracted = extractJsonArray(cleanText);
  if (extracted) {
    parseAttempts.push(() => JSON.parse(extracted));
    parseAttempts.push(() => JSON.parse(fixJson(extracted)));
    parseAttempts.push(() => JSON.parse(extracted + ']'));
  }

  const regexExtractedMatch = cleanText.match(/\[[\s\S]*\]/);
  if (regexExtractedMatch) {
    parseAttempts.push(() => JSON.parse(regexExtractedMatch[0]));
    parseAttempts.push(() => JSON.parse(fixJson(regexExtractedMatch[0])));
  }

  const regexExtractedObj = cleanText.match(/\{[\s\S]*\}/);
  if (regexExtractedObj) {
    parseAttempts.push(() => JSON.parse(regexExtractedObj[0]));
    parseAttempts.push(() => JSON.parse(fixJson(regexExtractedObj[0])));
    parseAttempts.push(() => JSON.parse(regexExtractedObj[0] + '}'));
  }

  for (const attempt of parseAttempts) {
    try {
      const result = attempt();
      if (Array.isArray(result)) {
        parsedEvents = result;
        break;
      }
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        if (Object.keys(result).length === 0) {
          parsedEvents = [];
          break;
        }
        if (result.title !== undefined) {
          parsedEvents = [result];
          break;
        }
        let foundNested = false;
        for (const key of Object.keys(result)) {
          if (Array.isArray(result[key])) {
            parsedEvents = result[key];
            foundNested = true;
            break;
          } else if (result[key] && typeof result[key] === 'object' && result[key].title !== undefined) {
            parsedEvents = [result[key]];
            foundNested = true;
            break;
          }
        }
        if (foundNested) break;
        
        parsedEvents = [];
        break;
      }
    } catch (e) {}
  }
  return parsedEvents;
}

console.log("Empty object:", parseLogic("{}"));
console.log("Incomplete object:", parseLogic('{"title": "Math"}'));
console.log("Truncated array:", parseLogic('[{"title": "Math"'));
console.log("Truncated object in array:", parseLogic('[{"title": "Math", "day": 1'));
