(function () {
  var form = document.getElementById("newsletterForm");
  if (!form) return;

  var nameInput = document.getElementById("newsletterName");
  var emailInput = document.getElementById("newsletterEmail");
  var consentInput = document.getElementById("newsletterConsent");
  var submitBtn = document.getElementById("newsletterSubmit");
  var successEl = document.getElementById("newsletterSuccess");
  var errorEl = document.getElementById("newsletterError");
  var honeypot = document.getElementById("newsletterHoneypot");
  var cfg = window.JANNOVA_NEWSLETTER || {};

  function isConfigured() {
    return Boolean(
      cfg.formAction &&
        cfg.emailEntry &&
        String(cfg.formAction).indexOf("docs.google.com/forms") !== -1 &&
        String(cfg.emailEntry).indexOf("entry.") === 0
    );
  }

  function setStatus(type, message) {
    if (successEl) {
      successEl.hidden = type !== "success";
      if (type === "success") successEl.textContent = message;
    }
    if (errorEl) {
      errorEl.hidden = type !== "error";
      if (type === "error") errorEl.textContent = message;
    }
  }

  function setSubmitting(busy) {
    if (submitBtn) {
      submitBtn.disabled = busy;
      submitBtn.textContent = busy ? "Subscribing…" : "Subscribe";
    }
    if (nameInput) nameInput.disabled = busy;
    if (emailInput) emailInput.disabled = busy;
    if (consentInput) consentInput.disabled = busy;
  }

  function showSuccess() {
    form.classList.add("newsletter-form--done");
    setStatus("success", "Thank you — you're on the list. We'll send occasional updates from JanNova Elements.");
    setSubmitting(false);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.remove("newsletter-form--done");
    setStatus(null, "");

    if (honeypot && honeypot.value.trim()) {
      showSuccess();
      return;
    }

    if (!nameInput || !nameInput.value.trim()) {
      setStatus("error", "Please enter your name.");
      nameInput && nameInput.focus();
      return;
    }

    if (!emailInput || !emailInput.value.trim()) {
      setStatus("error", "Please enter your email address.");
      emailInput && emailInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      setStatus("error", "Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (consentInput && !consentInput.checked) {
      setStatus("error", "Please confirm you agree to receive updates.");
      consentInput.focus();
      return;
    }

    if (!isConfigured()) {
      setStatus(
        "error",
        "Newsletter signup is not connected yet. Add your Google Form details in js/newsletter-config.js."
      );
      return;
    }

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var body = new FormData();
    if (cfg.nameEntry && String(cfg.nameEntry).indexOf("entry.") === 0) {
      body.append(cfg.nameEntry, name);
    }
    body.append(cfg.emailEntry, email);

    setSubmitting(true);

    fetch(cfg.formAction, {
      method: "POST",
      mode: "no-cors",
      body: body,
    })
      .then(function () {
        showSuccess();
        form.reset();
      })
      .catch(function () {
        setSubmitting(false);
        setStatus(
          "error",
          "Something went wrong. Please try again or email dinesh@jannova.in to subscribe."
        );
      });
  });
})();
