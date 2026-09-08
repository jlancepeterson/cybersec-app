import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const SPEC_PATH = 'C:\\Users\\lapeterson\\.copilot\\session-state\\f728f056-1b0d-4fb4-8b42-37f7e90fac0a\\files\\phishing-quiz-mvp.md';

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

app.get('/spec', (_req, res) => {
  let markdown = '';
  try {
    markdown = fs.readFileSync(SPEC_PATH, 'utf-8');
  } catch {
    markdown = '# Spec not found\n\nThe spec file could not be loaded.';
  }

  const html = marked.parse(markdown);
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Phishing Quiz MVP Spec</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, 'Segoe UI', sans-serif;
      background: #07131b;
      color: #e6f4ff;
      line-height: 1.7;
      padding: 48px 24px 80px;
    }
    .wrap { max-width: 860px; margin: 0 auto; }
    h1 { font-size: 2.4rem; letter-spacing: -0.04em; color: #f4fbff; margin-bottom: 8px; }
    h2 { font-size: 1.5rem; color: #7cd7ff; margin-top: 48px; border-bottom: 1px solid rgba(124,215,255,.2); padding-bottom: 8px; }
    h3 { font-size: 1.1rem; color: #a5d8f0; margin-top: 28px; }
    blockquote { border-left: 3px solid #4b85ff; margin: 0 0 24px; padding: 12px 20px; background: rgba(75,133,255,.08); border-radius: 0 12px 12px 0; color: #c7dce9; font-style: italic; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th { background: rgba(124,215,255,.12); color: #7cd7ff; padding: 10px 14px; text-align: left; font-size: .85rem; text-transform: uppercase; letter-spacing: .06em; }
    td { padding: 10px 14px; border-bottom: 1px solid rgba(124,215,255,.1); color: #d2eaf9; }
    tr:last-child td { border-bottom: none; }
    code { background: rgba(14,29,39,.9); border: 1px solid rgba(124,167,184,.22); border-radius: 6px; padding: 2px 7px; font-size: .88em; color: #9fe9ff; font-family: ui-monospace, Consolas, monospace; }
    pre { background: rgba(14,29,39,.9); border: 1px solid rgba(124,167,184,.22); border-radius: 14px; padding: 20px 22px; overflow-x: auto; }
    pre code { background: none; border: none; padding: 0; color: #c9f0ff; }
    ul, ol { padding-left: 22px; color: #d2eaf9; }
    li { margin-bottom: 6px; }
    li input[type=checkbox] { accent-color: #4b85ff; margin-right: 8px; }
    a { color: #63d0ff; }
    hr { border: none; border-top: 1px solid rgba(124,215,255,.15); margin: 40px 0; }
    .back { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #a5c9d9; font-size: .9rem; margin-bottom: 32px; }
    .back:hover { color: #f6fbff; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="http://localhost:5173">← Back to PhishSafe app</a>
    ${html}
  </div>
</body>
</html>`);
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
