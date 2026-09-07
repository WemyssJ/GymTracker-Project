const { chromium } = require('playwright');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ALL_MUSCLES = ['abdominals','obliques','serratus_anterior','biceps','forearms','triceps',
  'erector_spinae','infraspinatus','lats','teres','trapezius','calves','hamstrings','quads',
  'sartorius','tibialis_anterior','anterior_delts','lateral_delts','posterior_delts',
  'gluteus_maximus','gluteus_medius','hip_adductors','hip_flexors','tensor_fasciae_latae',
  'pecs','heart','background'];

const EXTRA_EXERCISES = [
  // --- PUSH ---
  { folder:'push', filename:'chest-fly',                muscles:{ pecs:100, serratus_anterior:75, anterior_delts:50 } },
  { folder:'push', filename:'push-up',                  muscles:{ pecs:100, serratus_anterior:100, triceps:75, anterior_delts:50 } },
  { folder:'push', filename:'chest-dip',                muscles:{ pecs:100, triceps:100, anterior_delts:75 } },
  { folder:'push', filename:'arnold-press',             muscles:{ anterior_delts:100, lateral_delts:100, triceps:100, posterior_delts:50 } },
  { folder:'push', filename:'front-raise',              muscles:{ anterior_delts:100, lateral_delts:25 } },
  { folder:'push', filename:'upright-row',              muscles:{ lateral_delts:100, trapezius:100, anterior_delts:50, biceps:50 } },
  { folder:'push', filename:'skull-crushers',           muscles:{ triceps:100 } },
  // --- PULL ---
  { folder:'pull', filename:'rear-delt-fly',            muscles:{ posterior_delts:100, infraspinatus:75, teres:50, trapezius:50 } },
  { folder:'pull', filename:'face-pull',                muscles:{ posterior_delts:100, trapezius:100, infraspinatus:50, teres:50 } },
  { folder:'pull', filename:'seated-cable-row',         muscles:{ lats:100, trapezius:100, posterior_delts:50, biceps:50 } },
  { folder:'pull', filename:'chin-up',                  muscles:{ biceps:100, lats:100, teres:25 } },
  { folder:'pull', filename:'romanian-deadlift',        muscles:{ hamstrings:100, gluteus_maximus:100, erector_spinae:75, lats:25 } },
  { folder:'pull', filename:'preacher-curl',            muscles:{ biceps:100, forearms:25 } },
  { folder:'pull', filename:'cable-row',                muscles:{ lats:100, trapezius:75, posterior_delts:50, biceps:50, erector_spinae:25 } },
  // --- LEG ---
  { folder:'leg',  filename:'leg-extension',            muscles:{ quads:100 } },
  { folder:'leg',  filename:'bulgarian-split-squat',    muscles:{ quads:100, gluteus_maximus:100, hamstrings:50, hip_adductors:50 } },
  { folder:'leg',  filename:'sumo-squat',               muscles:{ quads:100, gluteus_maximus:100, hip_adductors:100, hamstrings:50 } },
  { folder:'leg',  filename:'glute-kickback',           muscles:{ gluteus_maximus:100, hamstrings:50 } },
  { folder:'leg',  filename:'abductor-machine',         muscles:{ gluteus_medius:100, tensor_fasciae_latae:50 } },
  { folder:'leg',  filename:'adductor-machine',         muscles:{ hip_adductors:100 } },
  // --- CORE ---
  { folder:'core', filename:'plank',                    muscles:{ abdominals:100, obliques:50, erector_spinae:50, hip_flexors:25 } },
  { folder:'core', filename:'crunch',                   muscles:{ abdominals:100, obliques:25 } },
  { folder:'core', filename:'leg-raise',                muscles:{ abdominals:100, hip_flexors:100, obliques:25 } },
  { folder:'core', filename:'russian-twist',            muscles:{ obliques:100, abdominals:75 } },
  { folder:'core', filename:'cable-crunch',             muscles:{ abdominals:100, obliques:50 } },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

(async () => {
  // Ensure all folders exist
  ['push','pull','leg','core'].forEach(f => {
    const p = path.join(__dirname, 'images/muscles', f);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Loading musclecharts.net...');
  await page.goto('https://musclecharts.net/', { waitUntil: 'networkidle', timeout: 30000 });

  for (const ex of EXTRA_EXERCISES) {
    const muscleValues = {};
    ALL_MUSCLES.forEach(m => { muscleValues[m] = 0; });
    muscleValues.background = 100;
    Object.assign(muscleValues, ex.muscles);

    process.stdout.write(`  ${ex.folder}/${ex.filename}... `);

    const result = await page.evaluate(async ({ muscles, allMuscles }) => {
      const form = document.querySelector('form#muscles');
      const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
      const params = new URLSearchParams();
      params.append('csrfmiddlewaretoken', csrfToken);
      allMuscles.forEach(m => params.append(m, muscles[m] || 0));
      const resp = await fetch('https://musclecharts.net/', {
        method: 'POST', body: params,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
      });
      return JSON.parse(await resp.text());
    }, { muscles: muscleValues, allMuscles: ALL_MUSCLES });

    const imgPath = result.dl_l || result.dl_m;
    if (!imgPath) { console.log('NO URL'); continue; }
    const imgUrl = imgPath.startsWith('http') ? imgPath : 'https://musclecharts.net' + imgPath;
    await downloadFile(imgUrl, path.join(__dirname, 'images/muscles', ex.folder, ex.filename + '.png'));
    console.log('saved');
  }

  await browser.close();
  console.log('\nAll done.');
})().catch(e => { console.error(e); process.exit(1); });
