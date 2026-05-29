/**
 * Smoke test for section visibility (run: node scripts/test-section-visibility.js)
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.join(__dirname, "..");

function loadPage(file, configSource) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const dom = new JSDOM(html, { url: "http://localhost/" + file, runScripts: "dangerously" });
  const win = dom.window;

  const scripts = [
    configSource,
    fs.readFileSync(path.join(root, "js/section-visibility.js"), "utf8"),
  ];

  scripts.forEach((code) => {
    const scriptEl = win.document.createElement("script");
    scriptEl.textContent = code;
    win.document.head.appendChild(scriptEl);
  });

  return dom.window.document;
}

function check(doc, name, selector, expectVisible) {
  const el = doc.querySelector(selector);
  if (!el) {
    return { name, ok: false, reason: "missing element: " + selector };
  }
  const hidden = el.hidden === true;
  const ok = expectVisible ? !hidden : hidden;
  return { name, ok, hidden, selector };
}

function getDefaultConfig() {
  return fs.readFileSync(path.join(root, "js/site-config.js"), "utf8");
}

(async function () {
  const defaultConfig = getDefaultConfig();

  console.log("Testing default config...");
  let doc = loadPage("index.html", defaultConfig);
  let results = [
    check(doc, "testimonials section", "#testimonials", true),
    check(doc, "testimonials nav", 'a[data-nav-section="testimonials"]', true),
    check(doc, "about section", "#about", true),
    check(doc, "gallery section", "#gallery", true),
    check(doc, "offerings preview", "#offerings-preview", true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  console.log("Testing testimonials: false...");
  const hiddenConfig = defaultConfig.replace(
    "testimonials: true",
    "testimonials: false"
  );
  doc = loadPage("index.html", hiddenConfig);
  results = [
    check(doc, "testimonials section hidden", "#testimonials", false),
    check(doc, "testimonials nav hidden", 'a[data-nav-section="testimonials"]', false),
    check(doc, "footer testimonials hidden", '.footer-links a[data-nav-section="testimonials"]', false),
    check(doc, "about still visible", "#about", true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  console.log("Testing offerings page sections...");
  doc = loadPage("offerings.html", defaultConfig);
  results = [
    check(doc, "org dev detail", "#organisation-development", true),
    check(doc, "offerings overview", '[data-section="offeringsOverview"]', true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  const hideOffering = defaultConfig.replace(
    "training: true",
    "training: false"
  );
  doc = loadPage("offerings.html", hideOffering);
  results = [
    check(doc, "training detail hidden", "#training", false),
    check(doc, "training nav hidden", 'a[data-nav-section="training"]', false),
    check(doc, "hr still visible", "#hr-consultancy", true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  console.log("Testing team page profiles...");
  doc = loadPage("team.html", defaultConfig);
  results = [
    check(doc, "dinesh profile", "#dinesh-jambe", true),
    check(doc, "team cta", '[data-section="teamCta"]', true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  const hideTeamMember = defaultConfig.replace(
    "teamAnika: true",
    "teamAnika: false"
  );
  doc = loadPage("team.html", hideTeamMember);
  results = [
    check(doc, "anika hidden", "#anika-gaurat", false),
    check(doc, "dinesh still visible", "#dinesh-jambe", true),
  ];
  console.log(results);
  if (!results.every((r) => r.ok)) process.exit(1);

  console.log("All section visibility checks passed.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
