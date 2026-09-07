const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'images', 'muscles');

const ALL_MUSCLES = [
  'abdominals','obliques','serratus_anterior','biceps','forearms','triceps',
  'erector_spinae','infraspinatus','lats','teres','trapezius','calves',
  'hamstrings','quads','sartorius','tibialis_anterior','anterior_delts',
  'lateral_delts','posterior_delts','gluteus_maximus','gluteus_medius',
  'hip_adductors','hip_flexors','tensor_fasciae_latae','pecs','heart','background'
];

// Primary = 100, Secondary = 50, background always 100
const EXERCISES = [
  { filename: 'bench-press',     muscles: { pecs:100, triceps:100, anterior_delts:50, serratus_anterior:50 } },
  { filename: 'incline-press',   muscles: { pecs:100, triceps:100, anterior_delts:50 } },
  { filename: 'overhead-press',  muscles: { anterior_delts:100, lateral_delts:100, triceps:100, trapezius:50, serratus_anterior:50 } },
  { filename: 'dumbbell-press',  muscles: { pecs:100, triceps:100, anterior_delts:50, serratus_anterior:50 } },
  { filename: 'lateral-raise',   muscles: { lateral_delts:100, trapezius:50 } },
  { filename: 'tricep-push',     muscles: { triceps:100 } },
  { filename: 'deadlift',        muscles: { erector_spinae:100, gluteus_maximus:100, hamstrings:100, lats:50, trapezius:50, quads:50, forearms:50 } },
  { filename: 'pull-ups',        muscles: { lats:100, biceps:100, teres:50, posterior_delts:50, trapezius:50 } },
  { filename: 'weighted-row',    muscles: { lats:100, trapezius:100, posterior_delts:50, biceps:50, erector_spinae:50 } },
  { filename: 'head-pull',       muscles: { lats:100, biceps:50, posterior_delts:50, teres:50 } },
  { filename: 'bicep-curl',      muscles: { biceps:100, forearms:50 } },
  { filename: 'hammer-curl',     muscles: { biceps:100, forearms:100 } },
  { filename: 'squat',           muscles: { quads:100, gluteus_maximus:100, hamstrings:50, hip_adductors:50, erector_spinae:50 } },
  { filename: 'hip-thrust',      muscles: { gluteus_maximus:100, hamstrings:50, hip_adductors:50 } },
  { filename: 'leg-press',       muscles: { quads:100, gluteus_maximus:100, hamstrings:50, calves:50 } },
  { filename: 'lunges',          muscles: { quads:100, gluteus_maximus:100, hamstrings:50, hip_adductors:50, calves:50 } },
  { filename: 'prone-leg-curl',  muscles: { hamstrings:100, calves:50 } },
  { filename: 'calf-raises',     muscles: { calves:100 } },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Loading musclecharts.net...');
  await page.goto('https://musclecharts.net/', { waitUntil: 'networkidle', timeout: 30000 });

  for (const ex of EXERCISES) {
    const muscleValues = {};
    ALL_MUSCLES.forEach(m => { muscleValues[m] = 0; });
    muscleValues.background = 100;
    Object.assign(muscleValues, ex.muscles);

    console.log(`Generating: ${ex.filename}...`);

    const result = await page.evaluate(async ({ muscles, allMuscles }) => {
      const form = document.querySelector('form#muscles');
      const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;

      const params = new URLSearchParams();
      params.append('csrfmiddlewaretoken', csrfToken);
      allMuscles.forEach(m => params.append(m, muscles[m] || 0));

      const resp = await fetch('https://musclecharts.net/', {
        method: 'POST',
        body: params,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
      });
      const text = await resp.text();
      try { return JSON.parse(text); } catch(e) { return { error: text.substring(0, 200) }; }
    }, { muscles: muscleValues, allMuscles: ALL_MUSCLES });

    if (result.error) {
      console.error(`  ERROR for ${ex.filename}:`, result.error);
      continue;
    }

    // Use large image (dl_l), fall back to medium (dl_m)
    const imgPath = result.dl_l || result.dl_m || result.dl_s;
    if (!imgPath) {
      console.error(`  No image URL returned for ${ex.filename}. Response:`, result);
      continue;
    }

    const imgUrl = imgPath.startsWith('http') ? imgPath : `https://musclecharts.net${imgPath}`;
    const destPath = path.join(OUT_DIR, `${ex.filename}.png`);

    try {
      await downloadFile(imgUrl, destPath);
      console.log(`  Saved: ${ex.filename}.png`);
    } catch (err) {
      console.error(`  Download failed for ${ex.filename}:`, err.message);
    }
  }

  await browser.close();
  console.log('\nDone! All images saved to images/muscles/');
})().catch(e => { console.error('Fatal error:', e); process.exit(1); });
