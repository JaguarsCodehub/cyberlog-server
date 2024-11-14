import fs from 'fs';

interface ProcessedEntry {
  id: string;
  domain: string;
  content_link: string;
  email: string;
  password: string;
}

function parseRawData(rawData: string): ProcessedEntry[] {
  const entries = rawData.split('\n');
  const parsedEntries: ProcessedEntry[] = [];

  for (const entry of entries) {
    // Skip empty lines
    if (!entry.trim()) continue;

    try {
      // Split the entry by first colon to get the ID
      const firstColonIndex = entry.indexOf(':');
      if (firstColonIndex === -1) continue;

      const id = entry.substring(0, firstColonIndex).trim();
      const remainingPart = entry.substring(firstColonIndex + 1);

      // Find the last two colons for email and password
      const parts = remainingPart.split(':');
      if (parts.length < 3) continue;

      // The URL is everything before the last two parts
      const url = parts.slice(0, -2).join(':');
      const email = parts[parts.length - 2].trim();
      const password = parts[parts.length - 1].trim();

      // Extract domain from URL
      let domain = '';
      if (url.includes('//')) {
        domain = url.split('//')[1].split('/')[0];
      } else {
        domain = url.split('/')[0];
      }

      // Remove www. from domain if present
      domain = domain.replace(/^www\./, '');

      // Only add entries that have all required fields
      if (id && domain && url && email && password) {
        parsedEntries.push({
          id,
          domain,
          content_link: url,
          email,
          password
        });
      }
    } catch (error: any) {
      console.warn(`Failed to parse entry: ${error.message}`);
      continue;
    }
  }

  return parsedEntries;
}

function writeProcessedData(data: ProcessedEntry[]) {
  const filePath = './processedData.json';
  const jsonString = JSON.stringify(data, null, 2);
  
  try {
    fs.writeFileSync(filePath, jsonString);
    console.log(`Processed data successfully written to file (${data.length} entries)`);
    
    // Log unique domains found
    const uniqueDomains = [...new Set(data.map(entry => entry.domain))];
    console.log('\nUnique domains found:', uniqueDomains.length);
    uniqueDomains.forEach(domain => {
      const count = data.filter(entry => entry.domain === domain).length;
      console.log(`${domain}: ${count} entries`);
    });
  } catch (err) {
    console.error('Error writing processed data:', err);
  }
}

// Example usage:
const rawData = fs.readFileSync('./temp.txt', 'utf8');
const processedEntries = parseRawData(rawData);
writeProcessedData(processedEntries);
