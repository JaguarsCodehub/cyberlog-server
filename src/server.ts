// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

interface DomainParams {
  id: string;
}

app.get('/api/domains/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    // if (!query) {
    //   return res.status(400).json({ error: 'Search query is required' });
    // }

    const domains = await prisma.accounts.findMany({
      where: {
        domain: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Internal server issue' });
  }
});


// app.get('/api/domains/:id', async (req: Request<DomainParams>, res: Response) => {
//   try {
//     const id = parseInt(req.params.id, 10);

//     // if (isNaN(id)) {
//     //   return res.status(400).json({ error: 'Invalid domain ID' });
//     // }

//     const domain = await prisma.accounts.findUnique({
//       where: { id },
//     });

//     // if (!domain) {
//     //   return res.status(404).json({ error: 'Domain not found' });
//     // }

//     res.json(domain);
//   } catch (error) {
//     console.error('Error fetching domain:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

export default app;