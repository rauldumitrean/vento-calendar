const testCases = [
  // 1. Perfect array
  `[{"title":"Math"}]`,
  
  // 2. Trailing comma
  `[{"title":"Math"},]`,
  
  // 3. Object with single array
  `{"events": [{"title":"Math"}]}`,
  
  // 4. Object with multiple arrays
  `{"lunes": [{"title":"Math"}], "martes": [{"title":"Science"}]}`,
  
  // 5. Conversational text and markdown
  `Aquí está:
\`\`\`json
[{"title":"Math"}]
\`\`\`
Espero que sirva.`,

  // 6. Unescaped newlines in string
  `[{"title":"Math\n101"}]`
];

for (const responseText of testCases) {
  let cleanText = responseText.replace(/```(?:json)?/gi, "").trim();
  let parsedEvents = null;

  const fixJson = (text) => {
    return text
      .replace(/,\\s*([\\]}])/g, "$1") // fix trailing commas
      .replace(/[\\n\\r\\t]/g, " ");    // replace control chars with space
  };

  const parseAttempts = [
    () => JSON.parse(cleanText),
    () => {
        let fixed = fixJson(cleanText);
        // console.log("Fixed:", fixed);
        return JSON.parse(fixed);
    }
  ];

  for (const attempt of parseAttempts) {
    try {
      const result = attempt();
      if (Array.isArray(result)) {
        parsedEvents = result;
        break;
      }
    } catch (e) {}
  }

  console.log("Input:", JSON.stringify(responseText));
  console.log("Parsed:", parsedEvents);
  console.log("---");
}
