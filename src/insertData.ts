import { Client } from 'pg';

// Database connection string
const connectionString =
  'postgresql://cyberlog-api_owner:w2uv6qsbNIPg@ep-wild-sunset-a5tk614t.us-east-2.aws.neon.tech/cyberlog-api?sslmode=require';

// Sample data array
const parsedData = [
  {
    id: '44267',
    domain: 'accounts.google.com',
    content_link: 'https://accounts.google.com/signin/v2/sl/pwd',
    email: 'abderrahmanehallaci@gmail.com',
    password: 'skikda21',
  },
  {
    id: '44271',
    domain: 'accounts.google.com',
    content_link: 'https://accounts.google.com/signin/v2/challenge/pwd',
    email: 'abderrahmanehallaci@gmail.com',
    password: 'yourohat23.21',
  },
  {
    id: '44272',
    domain: 'accounts.google.com',
    content_link: 'https://accounts.google.com/ServiceLogin',
    email: 'abderrahmanehallaci@gmail.com',
    password: 'skikda21',
  },
  {
    id: '44290',
    domain: 'accounts.google.com',
    content_link: 'https://accounts.google.com/signin/v2/sl/pwd',
    email: 'abderrahmanehallaci@gmail.com',
    password: 'yourohat23',
  },
  {
    id: '44292',
    domain: 'accounts.google.com',
    content_link: 'https://accounts.google.com/signin/v2/challenge/pwd',
    email: 'abderrahmanehallaci@gmail.com',
    password: 'yourohat23',
  },
];

// Database client setup
const client = new Client({ connectionString });

async function insertData() {
  try {
    await client.connect();
    console.log('Connected to the database🟢');

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(255) PRIMARY KEY,
        domain VARCHAR(255),
        content_link TEXT,
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert each entry into the table
    for (const entry of parsedData) {
      await client.query(
        `INSERT INTO accounts (id, domain, content_link, email, password)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`, // Avoids duplicate ID entries
        [
          entry.id,
          entry.domain,
          entry.content_link,
          entry.email,
          entry.password,
        ]
      );
    }

    console.log('Data inserted successfully! 🟢');
  } catch (err) {
    console.error('Error inserting data: 🔴', err);
  } finally {
    await client.end();
  }
}

insertData();
