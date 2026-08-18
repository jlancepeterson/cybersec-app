import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const initialTips = [
  {
    id: 1,
    title: 'Pause before clicking links',
    category: 'Urgent action',
    summary: 'A fake account alert often pushes recipients to click immediately instead of thinking clearly.',
    nextStep: 'Hover over the link and confirm the destination matches the company domain before you login.'
  },
  {
    id: 2,
    title: 'Check the sender address carefully',
    category: 'Spoofed sender',
    summary: 'Attackers copy familiar names and change just one character in the domain.',
    nextStep: 'Compare the sender with official contact details from a trusted source instead of the email thread itself.'
  },
  {
    id: 3,
    title: 'Verify the request through a known channel',
    category: 'Credentials request',
    summary: 'Real companies rarely ask for passwords, MFA codes, or payment details by email.',
    nextStep: 'Open a web browser directly to the company website and contact support if the message seems urgent.'
  }
];

const tips = [...initialTips];

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PhishSafe API is running.' });
});

app.get('/api/tips', (_req, res) => {
  res.json({ tips });
});

app.post('/api/tips', (req, res) => {
  const { author, category, insight, nextStep } = req.body ?? {};

  if (!author || !category || !insight || !nextStep) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const tip = {
    id: Date.now(),
    title: `${category} warning`,
    category,
    summary: insight,
    nextStep,
    author
  };

  tips.unshift(tip);
  return res.status(201).json({ tip });
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PhishSafe API listening on http://localhost:${PORT}`);
});
