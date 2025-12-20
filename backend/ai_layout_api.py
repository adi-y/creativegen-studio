import os
import base64
import textwrap
import random
import json
import re
import unicodedata
from io import BytesIO

from dotenv import load_dotenv
from groq import Groq

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image, ImageDraw, ImageFont

# SETUP

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)
    AI_MODEL = "openai/gpt-oss-120b"
    print(f"✅ Groq API Key found. Using model: {AI_MODEL}")
else:
    client = None
    print("❌ NO GROQ API KEY FOUND. Using offline fallbacks.")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PLATFORM_DIMENSIONS = {
    "facebook_feed": (1200, 628),
    "instagram_square": (1080, 1080),
    "instagram_story": (1080, 1920),
    "facebook_story": (1080, 1920),
    "google_display": (1200, 628),
}


# COLOR & FONT UTILS

CSS_COLOR_MAP = {
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4",
    "azure": "#f0ffff", "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000",
    "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a",
    "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e",
    "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c",
    "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000",
    "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff",
    "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0",
    "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff",
    "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000",
    "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred": "#cd5c5c",
    "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6",
    "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0",
    "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff",
    "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585",
    "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000",
    "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#db7093",
    "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb",
    "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "rebeccapurple": "#663399",
    "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513",
    "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee",
    "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd",
    "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347",
    "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff",
    "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
}

def parse_color(color_input: str) -> tuple:
    if not color_input: 
        return (255, 255, 255, 255)
    color_input = color_input.strip().lower()
    if color_input in CSS_COLOR_MAP:
        color_input = CSS_COLOR_MAP[color_input]
    
    color_input = color_input.lstrip("#")
    if len(color_input) not in (3, 6): 
        return (255, 255, 255, 255)
    if len(color_input) == 3:
        color_input = "".join(c*2 for c in color_input)
    try:
        r = int(color_input[0:2], 16)
        g = int(color_input[2:4], 16)
        b = int(color_input[4:6], 16)
        return (r, g, b, 255)
    except:
        return (255, 255, 255, 255)

def get_font(size: int, bold=False):
    try:
        return ImageFont.truetype("arialbd.ttf" if bold else "arial.ttf", size)
    except:
        return ImageFont.load_default()


# LAYOUT TEMPLATES 

LAYOUT_TEMPLATES = [
    {
        "id": "hero_center",
        "name": "Hero Center",
        "product": {"x": 0.5, "y": 0.5, "w": 0.65, "h": 0.6},
        "headline": {"x": 0.5, "y": 0.15, "align": "center"},
        "cta": {"x": 0.5, "y": 0.88, "align": "center"}
    },
    {
        "id": "split_right",
        "name": "Split Right",
        "product": {"x": 0.22, "y": 0.5, "w": 0.4, "h": 0.75},
        "headline": {"x": 0.75, "y": 0.25, "align": "center"},
        "cta": {"x": 0.75, "y": 0.75, "align": "center"}
    },
    {
        "id": "minimal_top",
        "name": "Minimal Top",
        "product": {"x": 0.5, "y": 0.7, "w": 0.55, "h": 0.45},
        "headline": {"x": 0.5, "y": 0.12, "align": "center"},
        "cta": {"x": 0.5, "y": 0.85, "align": "center"}
    },
    {
        "id": "bold_bottom",
        "name": "Bold Bottom",
        "product": {"x": 0.5, "y": 0.3, "w": 0.75, "h": 0.45},
        "headline": {"x": 0.5, "y": 0.83, "align": "center"},
        "cta": {"x": 0.5, "y": 0.93, "align": "center"}
    },
    
    {
    "id": "split_left",
    "name": "Split Left",
    "product": {"x": 0.78, "y": 0.5, "w": 0.4, "h": 0.75},
    "headline": {"x": 0.25, "y": 0.25, "align": "center"},
    "cta": {"x": 0.25, "y": 0.75, "align": "center"}
},
{
    "id": "headline_left",
    "name": "Headline Left Focus",
    "product": {"x": 0.65, "y": 0.55, "w": 0.5, "h": 0.6},
    "headline": {"x": 0.2, "y": 0.4, "align": "left"},
    "cta": {"x": 0.2, "y": 0.6, "align": "left"}
},
{
    "id": "overlay_center",
    "name": "Overlay Center",
    "product": {"x": 0.5, "y": 0.5, "w": 0.9, "h": 0.9},
    "headline": {"x": 0.5, "y": 0.45, "align": "center"},
    "cta": {"x": 0.5, "y": 0.6, "align": "center"}
},
{
    "id": "corner_product",
    "name": "Corner Product",
    "product": {"x": 0.82, "y": 0.78, "w": 0.32, "h": 0.32},
    "headline": {"x": 0.1, "y": 0.15, "align": "left"},
    "cta": {"x": 0.1, "y": 0.3, "align": "left"}
},

{
    "id": "vertical_stack_clean",
    "name": "Vertical Stack Clean",
    "product": { "x": 0.5, "y": 0.55, "w": 0.6, "h": 0.55 },
    "headline": {
        "x": 0.5,
        "y": 0.15,
        "align": "center"
    },
    "cta": {
        "x": 0.5,
        "y": 0.85,
        "align": "center"
    }
}

]


# TEXT SANITIZATION

def sanitize_headline(headline: str) -> str:
    """Remove emojis and box-like characters for PIL compatibility"""
    # Remove all emojis and symbols (PIL can't render them)
    cleaned = "".join(
        c for c in headline
        if unicodedata.category(c) not in ("So", "Cf", "Mn", "Sk")
    )
    # Remove specific box characters (just in case)
    for bad in ["☐", "□", "⬜", "▫️", "■", "▢", "❏"]:
        cleaned = cleaned.replace(bad, "")
    # Clean extra spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned if cleaned else "Product Ad"


# AI TEXT ENGINE

def extract_json_from_text(text: str):
    if not text:
        return None
    text = re.sub(r'\<think\>.*?\<\/think\>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'```(?:json)?\s*', '', text)
    text = re.sub(r'```\s*$', '', text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        return None
    json_str = match.group().strip()
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        try:
            json_str = re.sub(r'[\r\n]+', ' ', json_str)
            json_str = re.sub(r'([{,]\s*)(\w+)(\s*:)','\\1"\\2"\\3', json_str)
            json_str = re.sub(r',\s*([}\]])', '\\1', json_str)
            return json.loads(json_str)
        except:
            return None

def generate_ad_copy(product_name: str, variation_idx: int):
    if not product_name or product_name.strip() == "":
        product_name = "this product"
    
    if client:
        angles = ["Short & Punchy", "Emotional", "Urgent (FOMO)", "Luxury"]
        angle = angles[variation_idx % len(angles)]
        
        system_prompt = "You are a creative ad copywriter. Output strictly JSON only."
        user_prompt = f"""
You are a world-class ad copywriter for premium brands.

Create a high-impact ad for this exact product:
→ "{product_name}"

Guidelines:
- Headline: max 5 words, **DO NOT USE EMOJIS OR SYMBOLS** (PIL can't render them)
- CTA: 2 words, action-driven
- Tone: {angle}

Examples:
- Product: "Patagonia Nano Puff Jacket" → Headline: "Adventure-Ready Warmth", CTA: "Explore Gear"
- Product: "Apple AirPods Pro" → Headline: "Silence The Noise", CTA: "Listen Now"

Output ONLY valid JSON: {{"headline": "...", "cta": "..."}}
"""
        
        try:
            print(f"\n🧠 [Groq] Thinking about '{product_name}' with angle '{angle}'...")
            completion = client.chat.completions.create(
                model=AI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=350,
                top_p=1,
                stream=False,
                stop=None,
            )
            response_text = completion.choices[0].message.content
            print(f"✅ [Groq] Raw Output: {response_text.strip()}")
            data = extract_json_from_text(response_text)
            if data and "headline" in data and "cta" in data:
                return data
            else:
                print("⚠️ [Groq] Output wasn't valid JSON. Falling back.")
        except Exception as e:
            print(f"❌ [Groq Error] {str(e)}")

    # Fallback with sanitization
    print("⚠️ [System] Using Offline Dictionary Fallback")
    verbs = ["Discover", "Experience", "Unleash", "Elevate"]
    adjectives = ["Pure", "Bold", "Timeless", "Ultimate"]
    headline = f"{random.choice(verbs)} {random.choice(adjectives)} {product_name.title()}"
    return {"headline": sanitize_headline(headline), "cta": "Shop Now"}


# RENDER ENGINE 

def render_layout(template, product_img, logo_img, text_data, brand_colors, platform_size):
    w, h = platform_size
    primary_color = brand_colors["primary"]
    text_color = brand_colors["text"]
    
    # Create canvas with brand background
    canvas = Image.new("RGB", (w, h), primary_color[:3])
    draw = ImageDraw.Draw(canvas)

    # Product Placement
    p_conf = template["product"]
    target_w = int(w * p_conf["w"])
    target_h = int(h * p_conf["h"])
    product_copy = product_img.copy()
    product_copy.thumbnail((target_w, target_h), Image.LANCZOS)
    dest_x = int(w * p_conf["x"] - product_copy.width / 2)
    dest_y = int(h * p_conf["y"] - product_copy.height / 2)
    if product_copy.mode in ("RGBA", "LA"):
        canvas.paste(product_copy, (dest_x, dest_y), product_copy)
    else:
        canvas.paste(product_copy, (dest_x, dest_y))

    # Headline (SANITIZED)
    cleaned_headline = sanitize_headline(text_data["headline"])
    wrapped_text = textwrap.fill(cleaned_headline, width=18)
    
    h_conf = template["headline"]
    font_size = max(48, int(w * 0.06))
    font = get_font(font_size, bold=True)
    tx = int(w * h_conf["x"])
    ty = int(h * h_conf["y"])
    anchor = "mm" if h_conf["align"] == "center" else "lm"
    
    # Text shadow for readability
    draw.multiline_text((tx+2, ty+2), wrapped_text, fill=(0,0,0), font=font, anchor=anchor, align=h_conf["align"])
    draw.multiline_text((tx, ty), wrapped_text, fill=text_color[:3], font=font, anchor=anchor, align=h_conf["align"])

    # CTA Button
    c_conf = template["cta"]
    cta_font_size = max(32, int(w * 0.04))
    cta_font = get_font(cta_font_size, bold=True)
    cta_text = text_data["cta"].upper()
    left, top, right, bottom = draw.textbbox((0, 0), cta_text, font=cta_font)
    btn_w = (right - left) + int(w * 0.08)
    btn_h = (bottom - top) + int(h * 0.04)
    cx = int(w * c_conf["x"])
    cy = int(h * c_conf["y"])
    cx_rect = cx - (btn_w // 2) if c_conf["align"] == "center" else cx
    draw.rectangle([cx_rect, cy - btn_h//2, cx_rect + btn_w, cy + btn_h//2], fill=text_color[:3])
    cx_text = cx if c_conf["align"] == "center" else cx + (btn_w // 2)
    draw.text((cx_text, cy), cta_text, fill=primary_color[:3], font=cta_font, anchor="mm")

    # Logo (top-right)
    if logo_img:
        logo_size = int(w * 0.12)
        logo_copy = logo_img.copy()
        logo_copy.thumbnail((logo_size, logo_size), Image.LANCZOS)
        lx = w - logo_copy.width - int(w * 0.04)
        ly = int(h * 0.04)
        if logo_copy.mode in ("RGBA", "LA"):
            logo_rgb = Image.new("RGB", logo_copy.size, primary_color[:3])
            logo_rgb.paste(logo_copy, mask=logo_copy.split()[-1])
            canvas.paste(logo_rgb, (lx, ly))
        else:
            canvas.paste(logo_copy, (lx, ly))

    return canvas


# ENDPOINT

@app.post("/generate-layout")
async def generate_layout(
    product_image: UploadFile = File(...),
    logo_image: UploadFile = File(None),
    product_name: str = Form(""),
    primary_color: str = Form("#ffffff"),
    text_color: str = Form("#000000"),
    platform: str = Form("instagram_story"),
    num_variations: int = Form(3)
):
    print(f"\n✅ INPUTS: product='{product_name}', primary='{primary_color}', text='{text_color}'")
    
    try:
        product_img = Image.open(BytesIO(await product_image.read())).convert("RGBA")
        logo_img = None
        if logo_image:
            logo_img = Image.open(BytesIO(await logo_image.read())).convert("RGBA")

        colors = {
            "primary": parse_color(primary_color),
            "text": parse_color(text_color)
        }
        size = PLATFORM_DIMENSIONS.get(platform, (1080, 1080))

        templates = random.sample(LAYOUT_TEMPLATES, min(num_variations, len(LAYOUT_TEMPLATES)))
        print(f"✅ Selected templates: {[t['id'] for t in templates]}")

        variations = []
        for i, template in enumerate(templates):
            copy = generate_ad_copy(product_name, i)
            final_img = render_layout(template, product_img, logo_img, copy, colors, size)
            
            buf = BytesIO()
            final_img.save(buf, format="PNG")
            img_str = base64.b64encode(buf.getvalue()).decode("utf-8")
            variations.append(f"data:image/png;base64,{img_str}")

        return JSONResponse(content={"variations": variations})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)