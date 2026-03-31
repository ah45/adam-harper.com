import re
from datetime import datetime

# Input/output files
INPUT_HTML = "index.html"
OUTPUT_HTML = "index.build.html"

# Create a timestamp version string
version = datetime.utcnow().strftime("%Y%m%d%H%M%S")

# Regex to match asset paths inside src= or href=
# Matches: src="assets/..."; href="/assets/..."; etc.
pattern = re.compile(
    r'(?P<path>(\/?assets\/[^"\']+))(?P<suffix>["\'])'
)

with open(INPUT_HTML, "r", encoding="utf-8") as f:
    html = f.read()

def add_version(match):
    path = match.group("path")
    suffix = match.group("suffix")

    # Avoid double-applying ?v=
    if "?v=" in path:
        return f"{path}{suffix}"

    # Add ?v=<timestamp>
    sep = "&" if "?" in path else "?"
    new_path = f"{path}{sep}v={version}"
    return f"{new_path}{suffix}"

# Rewrite HTML
new_html = pattern.sub(add_version, html)

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(new_html)

print(f"✅ Build complete. Output: {OUTPUT_HTML}")
