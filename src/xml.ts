export function extractTagContents(input: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, "gs");
  const matches = input.match(regex);
  return matches
    ? matches.map((match) => {
        const nextText = match.replace(new RegExp(`<\/?${tagName}>`, "g"), "");
        return nextText.trim();
      })
    : [];
}
