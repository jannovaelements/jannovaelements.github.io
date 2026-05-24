"""List all images in docx with surrounding text context."""
import zipfile
import xml.etree.ElementTree as ET
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX = os.path.join(ROOT, "Website Requirements.docx")
W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL_NS = "{http://schemas.openxmlformats.org/package/2006/relationships}"


def text_of(el):
    parts = []
    for t in el.iter(f"{W_NS}t"):
        if t.text:
            parts.append(t.text)
        if t.tail:
            parts.append(t.tail)
    return "".join(parts).strip()


def main():
    with zipfile.ZipFile(DOCX) as z:
        doc = ET.fromstring(z.read("word/document.xml"))
        rels = ET.fromstring(z.read("word/_rels/document.xml.rels"))
        rid_to_target = {rel.get("Id"): rel.get("Target") for rel in rels if rel.get("Target")}

        media = sorted(n for n in z.namelist() if n.startswith("word/media/"))
        print("Media files in docx:", len(media))
        for m in media:
            print(" ", m)

        body = doc.find(f"{W_NS}body")
        last_text = ""
        for i, child in enumerate(body):
            tag = child.tag.split("}")[-1]
            if tag == "p":
                t = text_of(child)
                imgs = []
                for blip in child.iter(f"{A_NS}blip"):
                    embed = blip.get(f"{R_NS}embed")
                    if embed and embed in rid_to_target:
                        imgs.append(os.path.basename(rid_to_target[embed]))
                if imgs or (t and any(k in t.lower() for k in ("method", "teach", "why choose", "4d", "diagnose"))):
                    ctx = t[:120] if t else "(empty)"
                    img_s = f" [IMG: {', '.join(imgs)}]" if imgs else ""
                    print(f"\n--- block {i} ---\n{ctx}{img_s}")
                    if imgs and "method" in (last_text + t).lower():
                        print("  ^^^ METHODOLOGY CONTEXT")
                if t:
                    last_text = t


if __name__ == "__main__":
    main()
