"""Re-extract images from docx; find images between Why Choose and Results."""
import zipfile
import xml.etree.ElementTree as ET
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX = os.path.join(ROOT, "Website Requirements.docx")
OUT = os.path.join(ROOT, "images", "about")
W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def text_of(el):
    parts = []
    for t in el.iter(f"{W_NS}t"):
        if t.text:
            parts.append(t.text)
        if t.tail:
            parts.append(t.tail)
    return "".join(parts).strip()


def imgs_in(el, rid_to_target):
    found = []
    for blip in el.iter(f"{A_NS}blip"):
        embed = blip.get(f"{R_NS}embed")
        if embed and embed in rid_to_target:
            found.append(os.path.basename(rid_to_target[embed]))
    return found


def main():
    os.makedirs(OUT, exist_ok=True)
    with zipfile.ZipFile(DOCX) as z:
        doc = ET.fromstring(z.read("word/document.xml"))
        rels = ET.fromstring(z.read("word/_rels/document.xml.rels"))
        rid_to_target = {rel.get("Id"): rel.get("Target") for rel in rels if rel.get("Target")}

        in_section = False
        for child in doc.find(f"{W_NS}body"):
            if child.tag.split("}")[-1] != "p":
                continue
            t = text_of(child)
            im = imgs_in(child, rid_to_target)
            if "5. Why Choose" in t or "Why Choose Us" in t:
                in_section = True
            if in_section:
                line = f"{t[:100] if t else '(empty)'}"
                if im:
                    line += f" -> {im}"
                print(line)
                for name in im:
                    src = rid_to_target[[k for k, v in rid_to_target.items() if name in v][0]]
                    src_path = "word/" + src.replace("../", "")
                    data = z.read(src_path)
                    dest = os.path.join(OUT, f"methodology-from-doc-{name}")
                    with open(dest, "wb") as f:
                        f.write(data)
                    print(f"  saved {dest} ({len(data)} bytes)")
            if "6. Testimonials" in t:
                break

        # Always refresh image10 from docx
        data = z.read("word/media/image10.png")
        dest = os.path.join(OUT, "methodology-diagram.png")
        with open(dest, "wb") as f:
            f.write(data)
        print(f"\nRefreshed {dest} ({len(data)} bytes)")


if __name__ == "__main__":
    main()
