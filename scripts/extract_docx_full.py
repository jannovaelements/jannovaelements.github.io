"""Full docx structure: paragraphs, tables, image order."""
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
        rid_to_target = {}
        for rel in rels:
            rid = rel.get("Id")
            target = rel.get("Target")
            if target:
                rid_to_target[rid] = target

        body = doc.find(f"{W_NS}body")
        order = []
        for child in body:
            tag = child.tag.split("}")[-1]
            if tag == "p":
                t = text_of(child)
                # blip embed?
                imgs = []
                for blip in child.iter(f"{A_NS}blip"):
                    embed = blip.get(f"{R_NS}embed")
                    if embed and embed in rid_to_target:
                        imgs.append(os.path.basename(rid_to_target[embed]))
                line = t or "(empty)"
                if imgs:
                    line += " [IMG: " + ", ".join(imgs) + "]"
                order.append(("p", line))
            elif tag == "tbl":
                rows = []
                for tr in child.iter(f"{W_NS}tr"):
                    cells = []
                    for tc in tr.findall(f"{W_NS}tc"):
                        cells.append(text_of(tc))
                    if any(cells):
                        rows.append(" | ".join(cells))
                order.append(("tbl", "\n".join(rows)))
            else:
                order.append((tag, f"<{tag}>"))

    out = os.path.join(ROOT, "scripts", "doc-structure.txt")
    with open(out, "w", encoding="utf-8") as f:
        for i, (kind, content) in enumerate(order, 1):
            f.write(f"--- {i} ({kind}) ---\n{content}\n\n")
    print(f"Wrote {len(order)} blocks to {out}")


if __name__ == "__main__":
    main()
