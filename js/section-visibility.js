(function () {
  var config = window.JANNOVA_SITE;
  if (!config) return;

  var sections = config.sections || {};
  var pages = config.pages || {};

  function isVisible(key) {
    if (!key) return true;
    if (Object.prototype.hasOwnProperty.call(sections, key)) {
      return sections[key] !== false;
    }
    return true;
  }

  function isPageVisible(key) {
    if (!key) return true;
    if (Object.prototype.hasOwnProperty.call(pages, key)) {
      return pages[key] !== false;
    }
    return true;
  }

  function hideElement(el) {
    if (!el) return;
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
  }

  function hideNavItem(el) {
    if (!el) return;
    hideElement(el);
    var li = el.closest("li");
    if (li && li !== el) hideElement(li);
  }

  document.querySelectorAll("[data-section]").forEach(function (el) {
    if (!isVisible(el.getAttribute("data-section"))) {
      hideElement(el);
    }
  });

  document.querySelectorAll("[data-nav-section]").forEach(function (el) {
    if (!isVisible(el.getAttribute("data-nav-section"))) {
      hideNavItem(el);
    }
  });

  document.querySelectorAll("[data-nav-page]").forEach(function (el) {
    if (!isPageVisible(el.getAttribute("data-nav-page"))) {
      hideNavItem(el);
    }
  });

  document.querySelectorAll("[data-section-link]").forEach(function (el) {
    if (!isVisible(el.getAttribute("data-section-link"))) {
      hideElement(el);
    }
  });

  var offeringKeys = [
    "organisationDevelopment",
    "hrConsultancy",
    "talentManagement",
    "training",
    "executiveCoaching",
  ];
  var anyOfferingVisible = offeringKeys.some(isVisible);

  if (!isPageVisible("offerings") || !anyOfferingVisible) {
    document.querySelectorAll("[data-nav-page='offerings']").forEach(function (el) {
      hideNavItem(el);
    });
  }

  if (!isPageVisible("team") || !isVisible("teamPreview")) {
    document.querySelectorAll("[data-nav-section='teamPreview']").forEach(function (el) {
      hideNavItem(el);
    });
  }

  if (!isPageVisible("team")) {
    document.querySelectorAll("[data-nav-page='team']").forEach(function (el) {
      hideNavItem(el);
    });
  }
})();
