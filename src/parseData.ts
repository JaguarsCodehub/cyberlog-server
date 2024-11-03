// utils/parseData.ts
interface RawDataEntry {
  id: string;
  url: string;
  email: string;
  password: string;
}

function parseRawData(rawData: string): RawDataEntry[] {
  // Split the raw data by spaces
  const entries = rawData.split(' ').filter((entry) => entry.trim());

  return entries.map((entry) => {
    const [id, ...urlParts] = entry.split(':');
    const url = urlParts.slice(0, 2).join(':'); // Join the first two parts to form the URL
    const email = urlParts[2];
    const password = urlParts[3];
    return {
      id: id.trim(), // Trim to remove any unwanted whitespace or newline
      url,
      email,
      password,
    };
  });
}


function extractDomainInfo(entries: RawDataEntry[]) {
  const domains = entries
    .map((entry) => {
      try {
        const url = new URL(entry.url);
        return {
          id: entry.id,
          domain: url.hostname,
          content_link: entry.url,
          email: entry.email,
          password: entry.password,
        };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        console.error(`Invalid URL: ${entry.url}`);
        return null;
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  // Remove duplicates based on id and content_link
  const uniqueDomains = Array.from(
    new Map(
      domains.map((item) => [`${item.id}:${item.content_link}`, item])
    ).values()
  );

  return uniqueDomains;
}

// Example usage:
const rawData = `44267:https://accounts.google.com/signin/v2/sl/pwd:abderrahmanehallaci@gmail.com:skikda21 
44271:https://accounts.google.com/signin/v2/challenge/pwd:abderrahmanehallaci@gmail.com:yourohat23.21 
44272:https://accounts.google.com/ServiceLogin:abderrahmanehallaci@gmail.com:skikda21 
44290:https://accounts.google.com/signin/v2/sl/pwd:abderrahmanehallaci@gmail.com:yourohat23 
44292:https://accounts.google.com/signin/v2/challenge/pwd:abderrahmanehallaci@gmail.com:yourohat23 
44267:https://accounts.google.com/signin/v2/sl/pwd:abderrahmanehallaci@gmail.com:skikda21 
44271:https://accounts.google.com/signin/v2/challenge/pwd:abderrahmanehallaci@gmail.com:yourohat23.21 
44272:https://accounts.google.com/ServiceLogin:abderrahmanehallaci@gmail.com:skikda21 
44290:https://accounts.google.com/signin/v2/sl/pwd:abderrahmanehallaci@gmail.com:yourohat23 
44292:https://accounts.google.com/signin/v2/challenge/pwd:abderrahmanehallaci@gmail.com:yourohat23 `;

const parsedEntries = parseRawData(rawData);
const processedDomains = extractDomainInfo(parsedEntries);
console.log(processedDomains);

export { parseRawData, extractDomainInfo };
