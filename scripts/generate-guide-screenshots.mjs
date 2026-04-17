import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const wwwRoot = path.join(repoRoot, 'www');
const guideRoot = path.join(wwwRoot, 'img', 'guide');
const port = 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const LANGS = [
  { id: 'vi', label: 'Tiếng Việt', name: 'Hải', jobName: 'Nơi làm của tôi', note: 'Ca sáng' },
  { id: 'en', label: 'English', name: 'Alex', jobName: 'My workplace', note: 'Morning shift' },
  { id: 'ja', label: '日本語', name: 'ハイ', jobName: '勤務先', note: '朝シフト' },
  { id: 'zh', label: '中文', name: '小海', jobName: '我的工作', note: '早班' },
  { id: 'th', label: 'ภาษาไทย', name: 'ไฮ', jobName: 'ที่ทำงานของฉัน', note: 'กะเช้า' },
  { id: 'pt', label: 'Português', name: 'Hai', jobName: 'Meu trabalho', note: 'Turno da manhã' },
  { id: 'ru', label: 'Русский', name: 'Хай', jobName: 'Моя работа', note: 'Утренняя смена' },
  { id: 'ko', label: '한국어', name: '하이', jobName: '내 직장', note: '오전 근무' },
  { id: 'hi', label: 'हिन्दी', name: 'हाई', jobName: 'मेरा कार्यस्थल', note: 'सुबह की शिफ्ट' }
];

const SHIFTS = [
  { id: 1, date: '2026-04-18', start: '09:00', end: '18:00', breakMin: 60, hours: 8, regularH: 8, otH: 0, isOT: false, manualOT: 0, pay: 12400, note: 0 },
  { id: 2, date: '2026-04-16', start: '08:00', end: '18:40', breakMin: 40, hours: 10, regularH: 8, otH: 2, isOT: false, manualOT: 0, pay: 15600, note: 0 },
  { id: 3, date: '2026-04-12', start: '08:00', end: '17:00', breakMin: 60, hours: 8, regularH: 8, otH: 0, isOT: false, manualOT: 0, pay: 11800, note: 1 },
  { id: 4, date: '2026-04-09', start: '08:00', end: '20:00', breakMin: 60, hours: 11, regularH: 8, otH: 3, isOT: false, manualOT: 0, pay: 17980, note: 0 },
  { id: 5, date: '2026-04-07', start: '08:00', end: '18:40', breakMin: 40, hours: 10, regularH: 8, otH: 2, isOT: false, manualOT: 0, pay: 15600, note: 0 },
  { id: 6, date: '2026-04-03', start: '08:00', end: '17:00', breakMin: 60, hours: 8, regularH: 8, otH: 0, isOT: false, manualOT: 0, pay: 11800, note: 1 },
  { id: 7, date: '2026-04-02', start: '08:00', end: '18:40', breakMin: 40, hours: 10, regularH: 8, otH: 2, isOT: false, manualOT: 0, pay: 15600, note: 0 },
  { id: 8, date: '2026-04-01', start: '08:00', end: '18:40', breakMin: 40, hours: 10, regularH: 8, otH: 2, isOT: false, manualOT: 0, pay: 15600, note: 0 }
];

const SCREENSHOTS = [
  { key: 'home', page: async page => {
      await page.evaluate(() => {
        goPage('home');
        renderHomeStats();
        renderShifts();
      });
    }
  },
  { key: 'add', page: async page => {
      await page.evaluate(() => {
        goPage('add');
        calCursor = '2026-04';
        calSelectedDate = '2026-04-18';
        setCalView('list');
      });
    }
  },
  { key: 'report', page: async page => {
      await page.evaluate(() => {
        goPage('report');
        setPeriod('month', document.getElementById('tabM'));
      });
    }
  },
  { key: 'settings', page: async page => {
      await page.evaluate(() => {
        goPage('settings');
        renderJobCards();
      });
    }
  }
];

function createGuideData(lang) {
  const job = {
    id: 1,
    name: lang.jobName,
    type: 'hourly',
    rate: 1550,
    otThreshold: 8,
    otMultiplier: 1.25,
    otType: 'multiplier',
    workDays: 22,
    allowances: [{ name: '交通費', amount: 500, per: 'day' }],
    icon: '💼',
    color: '#22c55e'
  };

  const shifts = SHIFTS.map(shift => ({
    ...shift,
    jobId: 1,
    jobName: lang.jobName,
    jobType: 'hourly',
    jobIcon: '💼',
    jobColor: '#22c55e',
    note: shift.note ? lang.note : ''
  }));

  return {
    jobs: [job],
    shifts,
    shiftTemplates: [
      { id: 1, jobId: 1, start: '09:00', end: '18:00', breakMin: 60, createdAt: Date.now(), lastUsedAt: Date.now() }
    ],
    nextJobId: 2,
    nextShiftId: 9,
    nextTemplateId: 2,
    curCurrency: 'jpy',
    calViewMode: 'list'
  };
}

function createServer(root) {
  return http.createServer(async (req, res) => {
    try {
      const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const wanted = rawPath === '/' ? '/index.html' : rawPath;
      const normalized = path.normalize(wanted).replace(/^(\.\.[/\\])+/, '');
      let filePath = path.join(root, normalized);
      let stat;

      try {
        stat = await fs.stat(filePath);
      } catch (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
      const ext = path.extname(filePath).toLowerCase();
      const data = await fs.readFile(filePath);
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeLocalizedScreenshots(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  for (const lang of LANGS) {
    const page = await context.newPage();
    const profileId = `guide_${lang.id}`;
    const data = createGuideData(lang);

    await page.addInitScript(({ langId, langName, profileId, data }) => {
      localStorage.clear();
      localStorage.setItem('strack_profiles', JSON.stringify([{
        id: profileId,
        name: langName,
        lang: langId,
        createdAt: Date.now(),
        lastActiveAt: Date.now()
      }]));
      localStorage.setItem('strack_active', profileId);
      localStorage.setItem(`strack_data_${profileId}`, JSON.stringify(data));
    }, {
      langId: lang.id,
      langName: lang.name,
      profileId,
      data
    });

    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    const outDir = path.join(guideRoot, lang.id);
    await ensureDir(outDir);

    for (const shot of SCREENSHOTS) {
      await shot.page(page);
      await page.waitForTimeout(220);
      const pngPath = path.join(outDir, `${shot.key}.png`);
      const webpPath = path.join(outDir, `${shot.key}.webp`);
      await page.screenshot({ path: pngPath });
      await sharp(pngPath).resize({ width: 560 }).webp({ quality: 84 }).toFile(webpPath);
      await fs.unlink(pngPath);
    }

    await page.close();
  }

  await context.close();
  await browser.close();
}

const server = createServer(wwwRoot);
await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));

try {
  await writeLocalizedScreenshots(`http://127.0.0.1:${port}`);
} finally {
  await new Promise(resolve => server.close(resolve));
}
