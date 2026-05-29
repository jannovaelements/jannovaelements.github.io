/**
 * Site section visibility configuration.
 *
 * Set any flag to false to hide that section (and related nav/footer links) across the site.
 * All sections default to visible (true) when omitted.
 *
 * Example — hide testimonials:
 *   testimonials: false,
 */
window.JANNOVA_SITE = {
  sections: {
    // --- index.html ---
    hero: true, // Hero banner
    offeringsPreview: true, // Services & Training Programmes (What We Offer)
    whyChooseUs: true, // Why Choose Us
    industries: true, // Industries We Serve
    method: true, // 4D Model, Methodology & Results delivered
    about: true, // About Us
    gallery: true, // Gallery
    stats: true, // Impact at a glance stats bar
    teamPreview: true, // Our Team preview on home page
    social: true, // Social Presence
    testimonials: true, // What Our Clients Say About Us
    faq: true, // Frequently Asked Questions
    contact: true, // Contact / Quick Enquiry
    newsletter: true, // Newsletter signup band

    // --- team.html ---
    teamPageHero: true, // Team page hero
    teamDinesh: true, // Dinesh Jambe profile
    teamShraddha: true, // Shraddha Paunikar profile
    teamSameer: true, // Dr. Sameer Deotey profile
    teamAnika: true, // Anika Gaurat profile
    teamCta: true, // "Work with our team" CTA on team page

    // --- offerings.html ---
    offeringsPageHero: true, // Offerings page hero
    offeringsOverview: true, // Our services overview cards
    organisationDevelopment: true, // Organisation Development
    hrConsultancy: true, // HR Consultancy
    talentManagement: true, // Talent Management
    training: true, // Training
    executiveCoaching: true, // Executive Leadership Coaching
    offeringsCta: true, // "Craft the right programme" CTA on offerings page
  },

  pages: {
    team: true, // Show Team page link in navigation & footer
    offerings: true, // Show Offerings page link in navigation & footer
  },
};
