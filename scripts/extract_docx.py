"""Extract text and media from Website Requirements.docx."""
import zipfile
import xml.etree.ElementTree as ET
import os
import shutil
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX = os.path.join(ROOT, "Website Requirements.docx")
OUT_TEXT = os.path.join(ROOT, "scripts", "doc-content.txt")
OUT_MEDIA = os.path.join(ROOT, "images", "from-doc")

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def extract_paragraphs(root):
    paras = []
    for p in root.iter(f"{W_NS}p"):
        texts = []
        for t in p.iter(f"{W_NS}t"):
            if t.text:
                texts.append(t.text)
            if t.tail:
                texts.append(t.tail)
        line = "".join(texts).strip()
        if line:
            paras.append(line)
    return paras


def main():
    with zipfile.ZipFile(DOCX) as z:
        xml = z.read("word/document.xml")
        root = ET.fromstring(xml)
        paras = extract_paragraphs(root)

        os.makedirs(OUT_MEDIA, exist_ok=True)
        media_files = [n for n in z.namelist() if n.startswith("word/media/")]
        for name in media_files:
            base = os.path.basename(name)
            dest = os.path.join(OUT_MEDIA, base)
            with z.open(name) as src, open(dest, "wb") as dst:
                shutil.copyfileobj(src, dst)

    with open(OUT_TEXT, "w", encoding="utf-8") as f:
        for i, p in enumerate(paras, 1):
            f.write(f"{i:04d}| {p}\n")

    print(f"Paragraphs: {len(paras)}")
    print(f"Media files: {len(media_files)}")
    print(f"Text -> {OUT_TEXT}")
    print(f"Media -> {OUT_MEDIA}")
    print("--- FIRST 80 LINES ---")
    for line in paras[:80]:
        print(line)


if __name__ == "__main__":
    main()
