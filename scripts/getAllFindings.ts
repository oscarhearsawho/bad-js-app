import { writeFileSync } from 'fs';
import { join } from 'path';

// =====================
// Configurable Variables
// =====================
const ORGANIZATION_SLUG = 'your_organization_slug_here';
const TOKEN = 'your_api_token_here';
const DATE_SINCE = '2024-01-01'; // YYYY-MM-DD


function dateToUnix(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

async function fetchFindings() {
  const timestamp = dateToUnix(DATE_SINCE);
  const url = `https://semgrep.dev/api/v1/deployments/${ORGANIZATION_SLUG}/findings?since=${timestamp}`;

  console.log(`\n[INFO] Fetching from: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`\n[ERROR] Request failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`\n[DEBUG] Response body: ${errorText}`);
      return;
    }

    const data = await response.json();
    const outputPath = join(__dirname, 'semgrep-findings.json');
    writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`\n[SUCCESS] Data written to ${outputPath}`);
  } catch (error: any) {
    console.error('\n[ERROR] Failed to fetch findings:', error.message);
  }
}

fetchFindings();
