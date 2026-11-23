import os
import json
import time
import subprocess
from playwright.sync_api import sync_playwright

W, H, FPS = 1920, 1080, 60
os.makedirs("output_clips", exist_ok=True)

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=JetBrains+Mono:wght@700;800&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    background: #040914;
    font-family: 'Montserrat', sans-serif;
    perspective: 1400px;
  }
  /* Deep Ocean + Vintage Nautical SVG Map Background */
  .world-stage {
    position: absolute; inset: -120px;
    background: radial-gradient(circle at 50% 45%, #0d2438 0%, #050d1a 65%, #02050a 100%);
    transform-style: preserve-3d;
  }
  .nautical-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212, 175, 55, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, transparent 280px, rgba(56, 189, 248, 0.12) 282px, transparent 284px),
      radial-gradient(circle at 50% 50%, transparent 520px, rgba(212, 175, 55, 0.10) 522px, transparent 524px);
    background-size: 120px 120px, 120px 120px, 100% 100%, 100% 100%;
  }
  .topography {
    position: absolute; inset: 0; opacity: 0.35;
  }
  .vignette {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.88) 100%);
    z-index: 50;
  }
  .film-grain {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.05; z-index: 51;
    background-image: repeating-radial-gradient(#fff 0 0.0001%, #000 0 0.0002%);
    background-size: 4px 4px;
  }
  .light-flare {
    position: absolute; top: -200px; left: 50%; width: 1100px; height: 600px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, rgba(235, 190, 90, 0.18) 0%, transparent 70%);
    pointer-events: none; z-index: 5;
  }
  #particles { position: absolute; inset: 0; z-index: 10; pointer-events: none; }
  
  /* Center Content Container */
  .stage-content {
    position: absolute; inset: 0; z-index: 20;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transform-style: preserve-3d;
  }
  
  /* Premium 3D Metallic Typography */
  .word-line {
    font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase;
    line-height: 1.05; text-align: center;
    opacity: 0;
    filter: drop-shadow(0 18px 25px rgba(0,0,0,0.9));
  }
  .gold-text {
    background: linear-gradient(180deg, #fff3c4 0%, #e5b84b 50%, #9e731c 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .white-text {
    background: linear-gradient(180deg, #ffffff 0%, #dce6f2 75%, #8fa3bf 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 0 #1a2639, 0 8px 0 #0f1724;
  }
  .serif-font { font-family: 'Cinzel', serif; }
  .mono-font { font-family: 'JetBrains Mono', monospace; }

  .laser-bar {
    height: 5px; width: 0px; margin-top: 28px;
    background: linear-gradient(90deg, transparent, #ef4444, #fbbf24, #ef4444, transparent);
    box-shadow: 0 0 20px #ef4444, 0 0 40px rgba(239, 68, 68, 0.6);
    border-radius: 3px;
  }

  /* Glassmorphism Documentary Card */
  .glass-card {
    padding: 55px 85px;
    background: linear-gradient(135deg, rgba(15, 30, 52, 0.78), rgba(6, 14, 28, 0.90));
    border: 1px solid rgba(235, 195, 100, 0.35);
    box-shadow: 0 30px 70px rgba(0,0,0,0.85), inset 0 0 30px rgba(56, 189, 248, 0.08);
    border-radius: 12px;
    display: flex; flex-direction: column; align-items: center;
  }

  /* Sonar HUD */
  .sonar-ring {
    position: absolute; width: 620px; height: 620px; border-radius: 50%;
    border: 2px solid rgba(45, 212, 191, 0.3);
    box-shadow: 0 0 50px rgba(45, 212, 191, 0.1), inset 0 0 50px rgba(45, 212, 191, 0.1);
  }
  .sonar-sweep {
    position: absolute; width: 620px; height: 620px; border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(45, 212, 191, 0.35) 0deg, transparent 75deg);
  }

  /* Stamp */
  .stamp-box {
    border: 12px solid #dc2626;
    padding: 22px 55px;
    color: #ef4444;
    font-size: 115px; font-weight: 900; letter-spacing: 0.1em;
    text-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
    box-shadow: 0 0 35px rgba(220, 38, 38, 0.4), inset 0 0 25px rgba(220, 38, 38, 0.3);
    background: rgba(127, 29, 29, 0.18);
    border-radius: 8px;
  }
</style>
</head>
<body>
  <div class="world-stage" id="worldStage">
    <div class="nautical-grid"></div>
    <svg class="topography" viewBox="0 0 1920 1080" fill="none">
      <path d="M-100,250 Q400,100 850,320 T1950,200" stroke="#d4af37" stroke-width="1.5"/>
      <path d="M-100,450 Q500,620 980,410 T1980,520" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M-100,720 Q450,580 1050,790 T2020,680" stroke="#d4af37" stroke-width="1.5"/>
      <path d="M300,-50 Q480,450 280,1120" stroke="#38bdf8" stroke-width="1"/>
      <path d="M1450,-50 Q1280,520 1520,1120" stroke="#d4af37" stroke-width="1"/>
    </svg>
  </div>
  <div class="light-flare"></div>
  <canvas id="particles" width="1920" height="1080"></canvas>
  <div class="stage-content" id="stageContent"></div>
  <div class="vignette"></div>
  <div class="film-grain"></div>

<script>
// Deterministic Gold Dust Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const pts = Array.from({length: 65}, (_, i) => ({
  x: (i * 197) % 1920,
  y: (i * 313) % 1080,
  r: 1.2 + (i % 3) * 0.9,
  vx: ((i % 5) - 2) * 0.25,
  vy: -0.3 - (i % 4) * 0.2,
  a: 0.25 + (i % 5) * 0.12
}));

function drawParticles(frame) {
  ctx.clearRect(0, 0, 1920, 1080);
  for (const p of pts) {
    const px = (p.x + p.vx * frame + 1920) % 1920;
    const py = (p.y + p.vy * frame + 1080) % 1080;
    ctx.beginPath();
    ctx.arc(px, py, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 208, 110, ${p.a})`;
    ctx.fill();
  }
}

function easeOutBack(t) {
  t = Math.max(0, Math.min(1, t));
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - t, 3);
}

let SCENE = null;
window.setupScene = function(cfg) {
  SCENE = cfg;
  const root = document.getElementById('stageContent');
  root.innerHTML = '';

  if (cfg.type === 'title_drop') {
    const wrap = cfg.card ? document.createElement('div') : root;
    if (cfg.card) { wrap.className = 'glass-card'; root.appendChild(wrap); }
    cfg.lines.forEach((l, idx) => {
      const el = document.createElement('div');
      el.className = `word-line ${l.gold ? 'gold-text' : 'white-text'} ${l.serif ? 'serif-font' : ''}`;
      el.style.fontSize = l.size + 'px';
      el.style.marginTop = (l.mt || 0) + 'px';
      el.id = 'line_' + idx;
      el.textContent = l.text;
      wrap.appendChild(el);
    });
    const bar = document.createElement('div');
    bar.className = 'laser-bar';
    bar.id = 'laserBar';
    wrap.appendChild(bar);
  }
  else if (cfg.type === 'sonar') {
    root.innerHTML = `
      <div class="sonar-ring"></div>
      <div class="sonar-sweep" id="sonarSweep"></div>
      <div class="mono-font" style="color:#5eead4; font-size:36px; letter-spacing:0.25em; margin-bottom:10px;">MULTI-BEAM SONAR</div>
      <div class="mono-font white-text" id="depthNum" style="font-size:155px; font-weight:800;">0 m</div>
      <div class="mono-font" style="color:#94a3b8; font-size:28px; letter-spacing:0.15em; margin-top:12px;">CORAL SEA FLOOR // NO LANDMASS</div>
    `;
  }
  else if (cfg.type === 'coords') {
    root.innerHTML = `
      <div class="glass-card">
        <div class="mono-font" style="color:#ef4444; font-size:32px; letter-spacing:0.25em; margin-bottom:18px;">TARGET COORDINATES LOCKED</div>
        <div class="mono-font gold-text" id="coordTxt" style="font-size:96px; font-weight:800;"></div>
        <div class="laser-bar" id="laserBar" style="width:650px;"></div>
      </div>
    `;
  }
  else if (cfg.type === 'stamp') {
    root.innerHTML = `
      <div class="glass-card" style="padding:70px 110px;">
        <div class="serif-font white-text" style="font-size:64px; margin-bottom:25px;">PHANTOM ISLAND ARCHIVE</div>
        <div class="stamp-box" id="stampBox" style="opacity:0;">UN-DISCOVERED</div>
      </div>
    `;
  }
  else if (cfg.type === 'timeline') {
    root.innerHTML = `
      <div class="serif-font gold-text" style="font-size:52px; letter-spacing:0.18em; margin-bottom:90px;">CARTOGRAPHIC PROPAGATION</div>
      <div style="position:relative; width:1300px; height:180px;">
        <div id="tLine" style="position:absolute; top:70px; left:0; height:6px; width:0px; background:linear-gradient(90deg, #ef4444, #fbbf24); box-shadow:0 0 20px #fbbf24;"></div>
        <div id="m0" style="position:absolute; left:80px; top:0; text-align:center; opacity:0;">
          <div class="white-text" style="font-size:64px; font-weight:900;">1876</div>
          <div style="width:26px; height:26px; background:#ef4444; border:4px solid #fff; border-radius:50%; margin:12px auto;"></div>
          <div style="color:#cbd5e1; font-size:26px;">VELOCITY SIGHTING</div>
        </div>
        <div id="m1" style="position:absolute; left:560px; top:0; text-align:center; opacity:0;">
          <div class="white-text" style="font-size:64px; font-weight:900;">1900</div>
          <div style="width:26px; height:26px; background:#ef4444; border:4px solid #fff; border-radius:50%; margin:12px auto;"></div>
          <div style="color:#cbd5e1; font-size:26px;">COPIED TO CHARTS</div>
        </div>
        <div id="m2" style="position:absolute; left:1040px; top:0; text-align:center; opacity:0;">
          <div class="gold-text" style="font-size:64px; font-weight:900;">1908</div>
          <div style="width:26px; height:26px; background:#fbbf24; border:4px solid #fff; border-radius:50%; margin:12px auto;"></div>
          <div style="color:#fde68a; font-size:26px;">ADMIRALTY CHART</div>
        </div>
      </div>
    `;
  }
};

window.renderFrame = function(frame, totalFrames) {
  const t = frame / 60.0;
  const progTotal = frame / totalFrames;
  drawParticles(frame);

  // 3D Camera Drift & Slow Zoom
  const scale = 1.0 + 0.09 * progTotal;
  const rotY = Math.sin(progTotal * Math.PI) * 1.8;
  document.getElementById('worldStage').style.transform = `scale(${scale}) rotateY(${rotY}deg)`;

  if (SCENE.type === 'title_drop') {
    SCENE.lines.forEach((l, idx) => {
      const start = 0.2 + idx * 0.26;
      const p = (t - start) / 0.36;
      const el = document.getElementById('line_' + idx);
      if (p <= 0) { el.style.opacity = 0; return; }
      const ease = easeOutBack(p);
      el.style.opacity = Math.min(1, p * 2.2);
      const yOff = (1 - ease) * -130;
      const zOff = (1 - ease) * 180;
      el.style.transform = `translate3d(0, ${yOff}px, ${zOff}px)`;
    });
    const barStart = 0.2 + SCENE.lines.length * 0.26;
    const bp = easeOutCubic((t - barStart) / 0.45);
    document.getElementById('laserBar').style.width = (680 * bp) + 'px';
  }
  else if (SCENE.type === 'sonar') {
    document.getElementById('sonarSweep').style.transform = `rotate(${t * 140}deg)`;
    const dp = easeOutCubic(t / 2.8);
    const val = Math.round(1400 * dp);
    document.getElementById('depthNum').textContent = val.toLocaleString() + ' m';
  }
  else if (SCENE.type === 'coords') {
    const full = "19°15' S, 159°55' E";
    const count = Math.floor(full.length * Math.min(1, t / 2.1));
    const cursor = (Math.floor(frame / 15) % 2 === 0 && count < full.length) ? '_' : '';
    document.getElementById('coordTxt').textContent = full.slice(0, count) + cursor;
  }
  else if (SCENE.type === 'stamp') {
    const p = (t - 0.4) / 0.25;
    const box = document.getElementById('stampBox');
    if (p > 0) {
      const s = Math.max(1.0, 2.6 - 1.6 * easeOutCubic(p));
      box.style.opacity = Math.min(1, p * 2.5);
      box.style.transform = `scale(${s}) rotate(-7deg)`;
    }
  }
  else if (SCENE.type === 'timeline') {
    const lp = easeOutCubic(t / 3.0);
    document.getElementById('tLine').style.width = (1300 * lp) + 'px';
    [0.2, 1.2, 2.2].forEach((st, idx) => {
      const mp = easeOutBack((t - st) / 0.4);
      const el = document.getElementById('m' + idx);
      if (mp > 0) {
        el.style.opacity = Math.min(1, (t - st) * 3);
        el.style.transform = `translateY(${(1 - mp) * 40}px)`;
      }
    });
  }
};
</script>
</body>
</html>
"""

with open("template.html", "w", encoding="utf-8") as f:
    f.write(HTML_TEMPLATE)

SCENES = [
    ("shot_05_title", 4.5, {
        "type": "title_drop", "card": False,
        "lines": [
            {"text": "THE", "size": 65, "gold": True, "serif": True},
            {"text": "ISLAND", "size": 140, "gold": False, "mt": 4},
            {"text": "THAT", "size": 58, "gold": True, "serif": True, "mt": 8},
            {"text": "NEVER", "size": 140, "gold": False, "mt": 4},
            {"text": "EXISTED", "size": 140, "gold": False, "mt": 4}
        ]
    }),
    ("shot_11_label", 4.5, {
        "type": "title_drop", "card": True,
        "lines": [
            {"text": "1876 LOGBOOK ENTRY", "size": 36, "gold": True},
            {"text": "Sandy Island", "size": 115, "gold": False, "serif": True, "mt": 14}
        ]
    }),
    ("shot_14_timeline", 5.0, {"type": "timeline"}),
    ("shot_18_ed", 4.2, {
        "type": "title_drop", "card": True,
        "lines": [
            {"text": "E.D.", "size": 165, "gold": True, "serif": True},
            {"text": "EXISTENCE DOUBTFUL", "size": 56, "gold": False, "mt": 10}
        ]
    }),
    ("shot_29_sonar", 4.5, {"type": "sonar"}),
    ("shot_30_coords", 4.0, {"type": "coords"}),
    ("shot_32_google", 4.2, {
        "type": "title_drop", "card": True,
        "lines": [
            {"text": "NOVEMBER 26, 2012", "size": 48, "gold": True},
            {"text": "GOOGLE CORRECTS ITS MAP", "size": 68, "gold": False, "mt": 14}
        ]
    }),
    ("shot_33_natgeo", 4.2, {
        "type": "title_drop", "card": True,
        "lines": [
            {"text": "NOVEMBER 29, 2012", "size": 48, "gold": True},
            {"text": "NATIONAL GEOGRAPHIC REMOVES IT", "size": 60, "gold": False, "mt": 14}
        ]
    }),
    ("shot_40_stamp", 3.5, {"type": "stamp"}),
    ("shot_46_claim", 4.2, {
        "type": "title_drop", "card": False,
        "lines": [
            {"text": "A MAP", "size": 115, "gold": False},
            {"text": "IS A CLAIM.", "size": 135, "gold": True, "mt": 10}
        ]
    }),
    ("shot_47_outro", 5.5, {
        "type": "title_drop", "card": True,
        "lines": [
            {"text": "BLANK SPOT MAP", "size": 105, "gold": True, "serif": True},
            {"text": "SUBSCRIBE FOR THE NEXT PLACE THE WORLD GOT WRONG", "size": 36, "gold": False, "mt": 22}
        ]
    })
]

html_path = "file://" + os.path.abspath("template.html")

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader"])
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    page.goto(html_path, wait_until="networkidle")
    page.wait_for_timeout(1000)

    for name, dur, cfg in SCENES:
        total_frames = int(dur * FPS)
        out_path = f"output_clips/{name}.mp4"
        page.evaluate(f"window.setupScene({json.dumps(cfg)})")
        
        cmd = [
            "ffmpeg", "-y", "-f", "image2pipe", "-vcodec", "png",
            "-r", str(FPS), "-i", "-",
            "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out_path
        ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for f in range(total_frames):
            page.evaluate(f"window.renderFrame({f}, {total_frames})")
            png_bytes = page.screenshot(type="png")
            proc.stdin.write(png_bytes)
        proc.stdin.close()
        proc.wait()
        print(f"Premium Rendered: {out_path}")

    browser.close()
