(function () {
  var nav = document.getElementById("primaryNav");
  var toggle = document.getElementById("navToggle");
  var backdrop = document.getElementById("navBackdrop");
  var drawerClose = document.getElementById("navDrawerClose");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("enquiryForm");

  function setBodyNavOpen(open) {
    document.body.classList.toggle("nav-menu-open", !!open);
  }

  function isDrawerNav() {
    return window.matchMedia("(max-width: 1024px)").matches;
  }

  function setSubmenuOpen(item, open) {
    if (!item) return;
    item.classList.toggle("is-open", open);
    var btn = item.querySelector(".nav__sub-toggle");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeNavPanel() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    setBodyNavOpen(false);
    if (backdrop) {
      backdrop.setAttribute("aria-hidden", "true");
    }
    nav.querySelectorAll(".nav__item--has-sub.is-open").forEach(function (el) {
      el.classList.remove("is-open");
      var b = el.querySelector(".nav__sub-toggle");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function openNavPanel() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
    setBodyNavOpen(true);
    if (backdrop) {
      backdrop.setAttribute("aria-hidden", "false");
    }
    if (isDrawerNav()) {
      nav.querySelectorAll(".nav__item--has-sub.is-active-branch").forEach(function (item) {
        setSubmenuOpen(item, true);
      });
      if (drawerClose) {
        drawerClose.focus();
      }
    }
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNavPanel();
      } else {
        openNavPanel();
      }
    });

    nav.querySelectorAll(".nav__item--has-sub > .nav__parent").forEach(function (parent) {
      parent.addEventListener("click", function (e) {
        if (!isDrawerNav()) return;
        var item = parent.closest(".nav__item--has-sub");
        if (!item || item.classList.contains("is-open")) return;
        e.preventDefault();
        nav.querySelectorAll(".nav__item--has-sub.is-open").forEach(function (el) {
          if (el !== item) setSubmenuOpen(el, false);
        });
        setSubmenuOpen(item, true);
      });
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (isDrawerNav()) closeNavPanel();
      });
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeNavPanel);
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeNavPanel();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("is-open")) {
      closeNavPanel();
    }
  });

  document.querySelectorAll(".nav__sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = btn.closest(".nav__item--has-sub");
      if (!item) return;
      var open = !item.classList.contains("is-open");
      if (nav) {
        nav.querySelectorAll(".nav__item--has-sub.is-open").forEach(function (el) {
          if (el !== item) setSubmenuOpen(el, false);
        });
      }
      setSubmenuOpen(item, open);
    });
  });

  function buildMessage() {
    var nameEl = document.getElementById("name");
    var emailEl = document.getElementById("email");
    var phoneEl = document.getElementById("phone");
    var orgEl = document.getElementById("org");
    var needEl = document.getElementById("need");
    var name = nameEl && nameEl.value.trim() ? nameEl.value.trim() : "there";
    var email = emailEl && emailEl.value.trim() ? emailEl.value.trim() : "";
    var phone = phoneEl && phoneEl.value.trim() ? phoneEl.value.trim() : "";
    var org = orgEl && orgEl.value.trim() ? orgEl.value.trim() : "";
    var need = needEl && needEl.value.trim() ? needEl.value.trim() : "";
    var lines = [
      "Hi JanNova team,",
      "",
      "Name: " + name,
      email ? "Email: " + email : "",
      phone ? "Phone: " + phone : "",
      org ? "Organisation: " + org : "",
      need ? "Message: " + need : "",
      "",
      "I'd like to discuss a learning / OD programme.",
    ].filter(Boolean);
    return lines.join("\n");
  }

  var btnWa = document.getElementById("btnWhatsapp");
  var btnEm = document.getElementById("btnEmail");

  if (btnWa) {
    btnWa.addEventListener("click", function () {
      var text = buildMessage();
      var url = "https://wa.me/919987453879?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  if (btnEm) {
    btnEm.addEventListener("click", function () {
      var body = buildMessage();
      var subject = "Enquiry from JanNova website";
      window.location.href =
        "mailto:hr@jannova.in?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
})();
