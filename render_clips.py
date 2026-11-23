import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1920, 1080, 60
os.makedirs("output_clips", exist_ok=True)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

def create_rich_map_bg():
    # Generate high-res (2200x1240) vintage dark navy/teal topographic map texture for smooth camera zoom
    BW, BH = 2200, 1240
    y, x = np.ogrid[0:BH, 0:BW]
    
    # Procedural terrain contours (sin/cos interference)
    z = (np.sin(x * 0.004) * np.cos(y * 0.004) +
         0.5 * np.sin(x * 0.011 + y * 0.008) +
         0.25 * np.cos(x * 0.025 - y * 0.02))
    
    # Dark navy & deep teal base with subtle gold contour lines
    r = np.clip(10 + 12 * (z > 0.4), 5, 35).astype(np.uint8)
    g = np.clip(24 + 22 * (z > 0.4) + 18 * (np.abs(z - 0.4) < 0.04), 12, 65).astype(np.uint8)
    b = np.clip(48 + 30 * (z > 0.4) + 15 * (np.abs(z - 0.4) < 0.04), 22, 95).astype(np.uint8)
    
    # Add subtle film grain
    rng = np.random.default_rng(42)
    noise = rng.integers(-6, 7, size=(BH, BW, 1))
    arr = np.clip(np.dstack([r, g, b]).astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(arr, "RGB")
    draw = ImageDraw.Draw(img)
    
    # Nautical coordinate grid & compass circles
    for gx in range(0, BW, 160):
        draw.line([(gx, 0), (gx, BH)], fill=(25, 55, 85), width=2)
    for gy in range(0, BH, 160):
        draw.line([(0, gy), (BW, gy)], fill=(25, 55, 85), width=2)
    
    cx, cy = BW // 2, BH // 2
    for rad in [280, 480, 680]:
        draw.ellipse([(cx - rad, cy - rad), (cx + rad, cy + rad)], outline=(45, 75, 95), width=2)
        
    return img

MASTER_BG = create_rich_map_bg()

def get_zoomed_bg(t, duration, zoom_amount=0.08):
    # Smooth Ken Burns zoom-in on the background map
    prog = t / max(duration, 0.1)
    scale = 1.0 + zoom_amount * prog
    cw, ch = int(W / scale), int(H / scale)
    bw, bh = MASTER_BG.size
    left = (bw - cw) // 2
    top = (bh - ch) // 2
    cropped = MASTER_BG.crop((left, top, left + cw, top + ch)).resize((W, H), Image.Resampling.BILINEAR)
    
    # Apply dark cinematic vignette
    y, x = np.ogrid[0:H, 0:W]
    dist = np.sqrt(((x - W/2)/(W*0.58))**2 + ((y - H/2)/(H*0.58))**2)
    vig = np.clip(1.15 - 0.65 * (dist ** 1.6), 0.35, 1.0)[:, :, None]
    arr = (np.array(cropped, dtype=np.float32) * vig).astype(np.uint8)
    return Image.fromarray(arr, "RGB").convert("RGBA")

def render_video(name, duration_sec, draw_frame_fn):
    total_frames = int(duration_sec * FPS)
    out_path = f"output_clips/{name}.mp4"
    cmd = [
        "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{W}x{H}", "-pix_fmt", "rgb24", "-r", str(FPS),
        "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out_path
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(total_frames):
        frame = draw_frame_fn(f, total_frames)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    proc.wait()
    print(f"Rendered: {out_path}")

def ease_out_back(t):
    t = np.clip(t, 0, 1)
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)

def ease_out_cubic(t):
    t = np.clip(t, 0, 1)
    return 1 - pow(1 - t, 3)

def draw_text_with_glow(overlay, pos, text, font, fill_col, alpha):
    x, y = pos
    # Soft dark drop shadow / backing for TV readability
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    sdraw.text((x + 8, y + 10), text, font=font, fill=(0, 0, 0, int(alpha * 0.85)))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(6))
    overlay.alpha_composite(shadow_layer)
    
    draw = ImageDraw.Draw(overlay)
    draw.text((x, y), text, font=font, fill=(*fill_col, alpha))

def make_cinematic_title(name, lines, duration=4.5, accent_line=True):
    def draw_fn(f, total):
        t = f / FPS
        bg = get_zoomed_bg(t, duration)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        for idx, (txt, size, col, target_y, use_serif) in enumerate(lines):
            start_t = 0.25 + idx * 0.28
            raw_p = (t - start_t) / 0.38
            if raw_p <= 0:
                continue
            prog = ease_out_back(raw_p)
            alpha = int(255 * ease_out_cubic(raw_p * 1.5))
            font = ImageFont.truetype(FONT_SERIF if use_serif else FONT_BOLD, size)
            bbox = draw.textbbox((0, 0), txt, font=font)
            tw = bbox[2] - bbox[0]
            x = (W - tw) // 2
            y = int(target_y - (1 - prog) * 160)
            draw_text_with_glow(overlay, (x, y), txt, font, col, alpha)

        if accent_line:
            line_start = 0.25 + len(lines) * 0.28
            l_prog = ease_out_cubic((t - line_start) / 0.4)
            if l_prog > 0:
                lw = int(560 * l_prog)
                ly = lines[-1][3] + lines[-1][1] + 28
                draw.rectangle([(W//2 - lw//2, ly), (W//2 + lw//2, ly + 6)], fill=(215, 50, 50, 255))

        return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))
    render_video(name, duration, draw_fn)

# --- 1. Shot 5: Main Title Card ---
make_cinematic_title("shot_05_title", [
    ("THE", 68, (235, 195, 100), 210, False),
    ("ISLAND", 130, (255, 248, 230), 300, False),
    ("THAT", 62, (235, 195, 100), 455, False),
    ("NEVER", 130, (255, 248, 230), 540, False),
    ("EXISTED", 130, (255, 248, 230), 690, False),
], duration=4.5)

# --- 2. Shot 11: "Sandy Island" Handwritten-style Serif Reveal ---
def draw_sandy_label(f, total):
    t = f / FPS
    bg = get_zoomed_bg(t, 4.5, 0.12)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Draw small phantom island outline
    pts = [(860, 480), (920, 440), (1020, 450), (1060, 510), (990, 560), (890, 540)]
    draw.polygon(pts, fill=(35, 55, 65, 200), outline=(235, 195, 100, 240))
    
    # Reveal label left-to-right
    prog = ease_out_cubic((t - 0.5) / 1.5)
    if prog > 0:
        font = ImageFont.truetype(FONT_SERIF, 76)
        txt = "Sandy Island"
        draw_text_with_glow(overlay, (740, 600), txt, font, (255, 245, 220), int(255 * prog))
    return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))

render_video("shot_11_label", 4.5, draw_sandy_label)

# --- 3. Shot 14: Timeline 1876 -> 1900 -> 1908 ---
def draw_timeline(f, total):
    t = f / FPS
    bg = get_zoomed_bg(t, 5.0)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    prog = ease_out_cubic(t / 3.2)
    line_end = int(320 + 1280 * prog)
    draw.line([(320, 540), (line_end, 540)], fill=(235, 195, 100, 255), width=8)
    
    milestones = [(420, "1876", 0.3), (960, "1900", 1.3), (1500, "1908", 2.3)]
    font_yr = ImageFont.truetype(FONT_BOLD, 72)
    for mx, yr, st in milestones:
        mp = ease_out_back((t - st) / 0.4)
        if mp > 0:
            r = int(22 * mp)
            draw.ellipse([(mx - r, 540 - r), (mx + r, 540 + r)], fill=(215, 50, 50, 255), outline=(255, 255, 255, 255), width=4)
            draw_text_with_glow(overlay, (mx - 95, 420), yr, font_yr, (255, 255, 255), int(255 * ease_out_cubic((t - st)/0.3)))
    return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))

render_video("shot_14_timeline", 5.0, draw_timeline)

# --- 4. Shot 18: E.D. Existence Doubtful ---
make_cinematic_title("shot_18_ed", [
    ("E.D.", 170, (235, 195, 100), 340, True),
    ("EXISTENCE DOUBTFUL", 68, (255, 255, 255), 550, False),
], duration=4.0)

# --- 5. Shot 29: Sonar Depth 1,400 m ---
def draw_sonar(f, total):
    t = f / FPS
    bg = get_zoomed_bg(t, 4.5, 0.05)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Radar circle & sweep line
    cx, cy = W // 2, H // 2
    draw.ellipse([(cx - 380, cy - 380), (cx + 380, cy + 380)], outline=(40, 200, 175, 140), width=4)
    prog = ease_out_cubic(t / 2.8)
    depth = int(1400 * prog)
    
    bar_y = int(180 + 720 * ((t * 0.6) % 1.0))
    draw.line([(240, bar_y), (W - 240, bar_y)], fill=(40, 220, 190, 180), width=4)
    
    font_lbl = ImageFont.truetype(FONT_MONO, 48)
    font_num = ImageFont.truetype(FONT_MONO, 145)
    draw_text_with_glow(overlay, (W//2 - 190, 340), "SONAR DEPTH", font_lbl, (90, 230, 205), 255)
    txt = f"{depth:,} m"
    bbox = draw.textbbox((0, 0), txt, font=font_num)
    draw_text_with_glow(overlay, ((W - (bbox[2]-bbox[0]))//2, 430), txt, font_num, (255, 255, 255), 255)
    return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))

render_video("shot_29_sonar", 4.5, draw_sonar)

# --- 6. Shot 30: Coordinates Typewriter ---
def draw_coords(f, total):
    t = f / FPS
    bg = get_zoomed_bg(t, 4.0)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Crosshair
    cx, cy = W // 2, H // 2
    draw.line([(cx - 120, cy), (cx + 120, cy)], fill=(215, 50, 50, 180), width=3)
    draw.line([(cx, cy - 120), (cx, cy + 120)], fill=(215, 50, 50, 180), width=3)
    
    full_txt = "19°15' S, 159°55' E"
    chars = int(len(full_txt) * np.clip(t / 2.0, 0, 1))
    shown = full_txt[:chars] + ("|" if (f // 15) % 2 == 0 and chars < len(full_txt) else "")
    font = ImageFont.truetype(FONT_MONO, 92)
    bbox = draw.textbbox((0, 0), full_txt, font=font)
    x = (W - (bbox[2] - bbox[0])) // 2
    draw_text_with_glow(overlay, (x, 480), shown, font, (235, 195, 100), 255)
    return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))

render_video("shot_30_coords", 4.0, draw_coords)

# --- 7. Shot 32 & 33: News Cards ---
make_cinematic_title("shot_32_google", [
    ("NOVEMBER 26, 2012", 62, (235, 195, 100), 370, False),
    ("GOOGLE CORRECTS ITS MAP", 84, (255, 255, 255), 465, False),
], duration=4.0)

make_cinematic_title("shot_33_natgeo", [
    ("NOVEMBER 29, 2012", 62, (235, 195, 100), 370, False),
    ("NATIONAL GEOGRAPHIC REMOVES IT", 74, (255, 255, 255), 465, False),
], duration=4.0)

# --- 8. Shot 40: Red UN-DISCOVERED Stamp Slam ---
def draw_stamp(f, total):
    t = f / FPS
    bg = get_zoomed_bg(t, 3.5)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    raw_p = (t - 0.35) / 0.25
    if raw_p > 0:
        prog = ease_out_back(raw_p)
        scale = max(1.0, 2.3 - 1.3 * ease_out_cubic(raw_p))
        size = int(115 * scale)
        font = ImageFont.truetype(FONT_BOLD, size)
        txt = "UN-DISCOVERED"
        bbox = draw.textbbox((0, 0), txt, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x, y = (W - tw) // 2, (H - th) // 2
        alpha = int(255 * ease_out_cubic(raw_p * 2))
        
        stamp_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(stamp_img)
        sdraw.rectangle([(x - 35, y - 22), (x + tw + 35, y + th + 28)], outline=(225, 45, 45, alpha), width=12)
        sdraw.text((x, y), txt, font=font, fill=(225, 45, 45, alpha))
        stamp_img = stamp_img.rotate(-6, resample=Image.Resampling.BICUBIC)
        overlay.alpha_composite(stamp_img)
        
    return np.array(Image.alpha_composite(bg, overlay).convert("RGB"))

render_video("shot_40_stamp", 3.5, draw_stamp)

# --- 9. Shot 46 & 47: Thesis & Outro ---
make_cinematic_title("shot_46_claim", [
    ("A MAP", 115, (255, 255, 255), 350, False),
    ("IS A CLAIM.", 130, (235, 195, 100), 495, False),
], duration=4.0)

make_cinematic_title("shot_47_outro", [
    ("BLANK SPOT MAP", 118, (235, 195, 100), 360, False),
    ("SUBSCRIBE FOR THE NEXT PLACE THE WORLD GOT WRONG", 46, (255, 255, 255), 520, False),
], duration=5.5)
