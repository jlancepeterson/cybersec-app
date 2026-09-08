import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const MAX_TIPS = 200;
const MAX_FIELD_LENGTH = 500;
const ALLOWED_CATEGORIES = new Set([
  'Urgent action',
  'Spoofed sender',
  'Credentials request',
  'Unexpected attachment',
]);

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

// In production the frontend is served from this same Express server, so no
// cross-origin access is needed by default. Set ALLOWED_ORIGIN to opt in a
// specific origin if the frontend is ever hosted separately.
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use(
  cors(
    isProduction
      ? { origin: allowedOrigin ?? false, methods: ['GET', 'POST'] }
      : { origin: true, methods: ['GET', 'POST'] },
  ),
);
app.use(express.json({ limit: '10kb' }));

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

  if (
    typeof author !== 'string' ||
    typeof category !== 'string' ||
    typeof insight !== 'string' ||
    typeof nextStep !== 'string'
  ) {
    return res.status(400).json({ error: 'All fields must be text.' });
  }

  if (
    author.length > MAX_FIELD_LENGTH ||
    insight.length > MAX_FIELD_LENGTH ||
    nextStep.length > MAX_FIELD_LENGTH
  ) {
    return res.status(400).json({ error: `Fields must be ${MAX_FIELD_LENGTH} characters or fewer.` });
  }

  if (!ALLOWED_CATEGORIES.has(category)) {
    return res.status(400).json({ error: 'Unrecognized risk pattern category.' });
  }

  const tip = {
    id: Date.now(),
    title: `${category} warning`,
    category,
    summary: insight.trim(),
    nextStep: nextStep.trim(),
    author: author.trim(),
  };

  tips.unshift(tip);
  if (tips.length > MAX_TIPS) {
    tips.length = MAX_TIPS;
  }

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
