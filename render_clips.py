import os
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 60
os.makedirs("output_clips", exist_ok=True)

# Load system bold fonts (Linux GitHub runner)
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

def make_bg():
    # Dark navy & deep teal documentary gradient + grid
    y, x = np.ogrid[0:H, 0:W]
    dist = np.sqrt(((x - W/2)/(W/1.4))**2 + ((y - H/2)/(H/1.4))**2)
    r = np.clip(12 * (1 - dist), 4, 25).astype(np.uint8)
    g = np.clip(28 * (1 - dist), 10, 45).astype(np.uint8)
    b = np.clip(55 * (1 - dist), 18, 75).astype(np.uint8)
    arr = np.dstack([r, g, b])
    img = Image.fromarray(arr, "RGB")
    draw = ImageDraw.Draw(img)
    for gx in range(0, W, 120):
        draw.line([(gx, 0), (gx, H)], fill=(20, 45, 70), width=1)
    for gy in range(0, H, 120):
        draw.line([(0, gy), (W, gy)], fill=(20, 45, 70), width=1)
    return img

BASE_BG = make_bg()

def render_video(name, duration_sec, draw_frame_fn):
    total_frames = int(duration_sec * FPS)
    out_path = f"output_clips/{name}.mp4"
    cmd = [
        "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{W}x{H}", "-pix_fmt", "rgb24", "-r", str(FPS),
        "-i", "-", "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", out_path
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(total_frames):
        frame = draw_frame_fn(f, total_frames)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    proc.wait()
    print(f"Rendered: {out_path}")

def ease_out_cubic(t):
    return 1 - pow(1 - np.clip(t, 0, 1), 3)

def make_word_drop(name, lines, duration=4.0, accent_line=True):
    # lines: list of (text, font_size, color, y_offset)
    def draw_fn(f, total):
        t = f / FPS
        img = BASE_BG.copy().convert("RGBA")
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        for idx, (txt, size, col, target_y) in enumerate(lines):
            start_t = 0.2 + idx * 0.25
            prog = ease_out_cubic((t - start_t) / 0.30)
            if prog <= 0:
                continue
            font = ImageFont.truetype(FONT_BOLD, size)
            bbox = draw.textbbox((0, 0), txt, font=font)
            tw = bbox[2] - bbox[0]
            x = (W - tw) // 2
            y = int(target_y - (1 - prog) * 140)
            alpha = int(255 * prog)
            # Shadow
            draw.text((x + 6, y + 6), txt, font=font, fill=(0, 0, 0, int(alpha * 0.7)))
            draw.text((x, y), txt, font=font, fill=(*col, alpha))

        if accent_line:
            line_start = 0.2 + len(lines) * 0.25
            l_prog = ease_out_cubic((t - line_start) / 0.35)
            if l_prog > 0:
                lw = int(500 * l_prog)
                ly = lines[-1][3] + lines[-1][1] + 25
                draw.rectangle([(W//2 - lw//2, ly), (W//2 + lw//2, ly + 6)], fill=(210, 45, 45, 255))

        out = Image.alpha_composite(img, overlay).convert("RGB")
        return np.array(out)
    render_video(name, duration, draw_fn)

# 1. Shot 5: Title Card (Word-by-word drop)
make_word_drop("shot_05_title", [
    ("THE", 75, (235, 200, 110), 230),
    ("ISLAND", 125, (255, 250, 235), 325),
    ("THAT", 65, (235, 200, 110), 470),
    ("NEVER", 125, (255, 250, 235), 555),
    ("EXISTED", 125, (255, 250, 235), 700),
], duration=4.0)

# 2. Shot 18: E.D. Existence Doubtful
make_word_drop("shot_18_ed", [
    ("E.D.", 160, (235, 200, 110), 360),
    ("EXISTENCE DOUBTFUL", 65, (255, 255, 255), 560),
], duration=4.0)

# 3. Shot 32: Google Correction
make_word_drop("shot_32_google", [
    ("NOVEMBER 26, 2012", 65, (235, 200, 110), 370),
    ("GOOGLE CORRECTS ITS MAP", 85, (255, 255, 255), 470),
], duration=4.0)

# 4. Shot 33: National Geographic
make_word_drop("shot_33_natgeo", [
    ("NOVEMBER 29, 2012", 65, (235, 200, 110), 370),
    ("NATIONAL GEOGRAPHIC REMOVES IT", 75, (255, 255, 255), 470),
], duration=4.0)

# 5. Shot 46: Thesis Card
make_word_drop("shot_46_claim", [
    ("A MAP", 115, (255, 255, 255), 360),
    ("IS A CLAIM.", 125, (235, 200, 110), 500),
], duration=4.0)

# 6. Shot 47: Outro & Subscribe
make_word_drop("shot_47_outro", [
    ("BLANK SPOT MAP", 115, (235, 200, 110), 370),
    ("SUBSCRIBE FOR THE NEXT PLACE THE WORLD GOT WRONG", 46, (255, 255, 255), 530),
], duration=5.0)

# 7. Shot 29: Sonar Depth Counter (0 m -> 1,400 m)
def draw_sonar(f, total):
    t = f / FPS
    img = BASE_BG.copy()
    draw = ImageDraw.Draw(img)
    prog = ease_out_cubic(t / 2.8)
    depth = int(1400 * prog)
    # Sonar sweep bar
    bar_y = int(200 + 680 * prog)
    draw.line([(200, bar_y), (W - 200, bar_y)], fill=(40, 210, 180), width=4)
    font_lbl = ImageFont.truetype(FONT_MONO, 55)
    font_num = ImageFont.truetype(FONT_MONO, 140)
    draw.text((W//2 - 220, 340), "SONAR DEPTH", font=font_lbl, fill=(120, 220, 200))
    txt = f"{depth:,} m"
    bbox = draw.textbbox((0, 0), txt, font=font_num)
    draw.text(((W - (bbox[2]-bbox[0]))//2, 440), txt, font=font_num, fill=(255, 255, 255))
    return np.array(img)

render_video("shot_29_sonar", 4.5, draw_sonar)

# 8. Shot 30: Coordinates Typewriter
def draw_coords(f, total):
    t = f / FPS
    img = BASE_BG.copy()
    draw = ImageDraw.Draw(img)
    full_txt = "19°15' S, 159°55' E"
    chars = int(len(full_txt) * np.clip(t / 2.2, 0, 1))
    shown = full_txt[:chars] + ("_" if (f // 15) % 2 == 0 and chars < len(full_txt) else "")
    font = ImageFont.truetype(FONT_MONO, 95)
    bbox = draw.textbbox((0, 0), full_txt, font=font)
    x = (W - (bbox[2] - bbox[0])) // 2
    draw.text((x, 480), shown, font=font, fill=(235, 200, 110))
    return np.array(img)

render_video("shot_30_coords", 4.0, draw_coords)

# 9. Shot 40: Red UN-DISCOVERED Stamp Slam
def draw_stamp(f, total):
    t = f / FPS
    img = BASE_BG.copy().convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    prog = ease_out_cubic((t - 0.4) / 0.25)
    if prog > 0:
        scale = 2.2 - 1.2 * prog
        size = int(110 * scale)
        font = ImageFont.truetype(FONT_BOLD, size)
        txt = "UN-DISCOVERED"
        bbox = draw.textbbox((0, 0), txt, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x, y = (W - tw) // 2, (H - th) // 2
        alpha = int(255 * prog)
        draw.rectangle([(x - 30, y - 20), (x + tw + 30, y + th + 30)], outline=(220, 40, 40, alpha), width=10)
        draw.text((x, y), txt, font=font, fill=(220, 40, 40, alpha))
    return np.array(Image.alpha_composite(img, overlay).convert("RGB"))

render_video("shot_40_stamp", 3.5, draw_stamp)
