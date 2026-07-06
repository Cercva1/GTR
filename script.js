// ===== nav height var (so main content clears the fixed nav) =====
const mainnav = document.getElementById("mainnav");
function setNavHeightVar() {
  if (mainnav)
    document.documentElement.style.setProperty(
      "--nav-h",
      mainnav.offsetHeight + "px",
    );
}
setNavHeightVar();
window.addEventListener("resize", setNavHeightVar);

// ===== intro splash: nav state + shrink/fade/zoom exit animation =====
const introEl = document.getElementById("intro");
const introContentEl = document.querySelector(".intro-content");
const introBgEl = document.querySelector(".intro-bg");

function updateIntroScroll() {
  if (!introEl) return;
  const introHeight = introEl.offsetHeight;
  const scrollY = window.scrollY || window.pageYOffset;
  const progress = Math.min(Math.max(scrollY / (introHeight * 0.85), 0), 1);

  if (introContentEl) {
    introContentEl.style.opacity = String(Math.max(1 - progress * 1.3, 0));
    introContentEl.style.transform = `translateY(${progress * -50}px) scale(${1 - progress * 0.3})`;
  }
  if (introBgEl) {
    introBgEl.style.transform = `scale(${1.02 + progress * 0.14})`;
    const brightness = (1.35 - progress * 0.35).toFixed(2);
    introBgEl.style.filter = `hue-rotate(-85deg) saturate(1.3) brightness(${brightness}) contrast(0.95)`;
  }
  if (mainnav) {
    mainnav.classList.toggle("scrolled", scrollY > introHeight - 90);
  }
}
updateIntroScroll();
window.addEventListener("scroll", updateIntroScroll, { passive: true });
window.addEventListener("resize", updateIntroScroll);

const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => io.observe(el));

// mobile nav toggle
const navtoggle = document.getElementById("navtoggle");
const navlinks = document.getElementById("navlinks");
navtoggle.addEventListener("click", () => navlinks.classList.toggle("open"));
navlinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navlinks.classList.remove("open")),
  );

// active nav link highlight on scroll
const sections = ["top", "services", "pricing", "about", "contact"].map((id) =>
  document.getElementById(id),
);
const navA = Array.from(navlinks.querySelectorAll("a"));
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navA.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + id),
        );
      }
    });
  },
  { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" },
);
sections.forEach((s) => s && navObserver.observe(s));

// ===== i18n =====
const translations = {
  en: {
    pagetitle: "Railway Telecom — Backbone Network Operator",
    topbarLoc: "Tbilisi, Georgia · 160 M. Tsinamdzgvrishvili St.",
    topbarStatus: "Network Active — 24/7",
    logoSub: "Railway Telecom",
    navHome: "Home",
    navServices: "Services",
    navNews: "News",
    navPricing: "Pricing",
    navAbout: "About",
    navContact: "Contact",
    navCta: "Contact Us →",
    heroEyebrow: "Backbone Network Operator · Since 2004",
    heroH1:
      'Fiber infrastructure<br> that <span class="accent">Georgia runs on.</span>',
    heroLead:
      "Railway Telecom owns and operates a backbone fiber-optic network along Georgia's railway infrastructure — serving international and local operators, with routes toward Armenia, Azerbaijan and Turkey.",
    heroBtn1: "View Pricing",
    heroBtn2: "Request Connection",
    stat1: "Operating since",
    stat2: "Border directions",
    stat3: "Technical support",
    m1: "Internet Service",
    m2: "Channel Lease",
    m3: "Backbone Fiber Network",
    m4: "International Transit",
    m5: "24/7 Technical Support",
    svcEyebrow: "Services",
    svcH2: "Two ways to connect to our network.",
    svcP: "Infrastructure built on railway station communication nodes — suited for operators and large institutional clients alike.",
    svc1h: "Internet Service",
    svc1p:
      "Internet service at communication nodes located on the territory of Georgian Railway stations — delivery point: Railway Telecom's communication node.",
    svc1tag: "1–10,000 Mbps",
    svc2h: "Channel Lease",
    svc2p:
      "Backbone fiber channel lease for international and local operators — full specification available in the document.",
    svc2tag: "PDF Specification ↗",
    svc3h: "International Transit",
    svc3p:
      "Service delivery through Georgia to the borders of Armenia, Azerbaijan and Turkey — via the backbone network.",
    svc3tag: "3 border directions",
    priceEyebrow: "Pricing",
    priceH2: "Internet service rates.",
    priceP:
      "Starting cost per 1 Mbps, by volume tier. Prices shown exclude VAT.",
    priceInfoH: "Communication Node",
    priceInfoP:
      "Service delivery point — Railway Telecom's communication node, on the territory of Georgian Railway stations.",
    priceLoc:
      "→ 160 M. Tsinamdzgvrishvili St.<br>→ Tbilisi 0112, Georgia<br>→ Tel: +995 32 250 68 99",
    th1: "Volume (Mbps)",
    th2: "Starting cost per 1 Mbps",
    aboutEyebrow: "About Us",
    aboutH2: "Two decades of backbone infrastructure.",
    aboutP1:
      "<strong>Since 2004</strong>, Railway Telecom has operated as a backbone network operator. The company owns a backbone optical fiber cable network connecting several directions.",
    aboutP2:
      "Over the years, in line with the company's development plan, the backbone network's equipment has been upgraded and improved — ensuring stable, high-quality service.",
    aboutP3:
      "The company's client base includes both <strong>international</strong> and <strong>local operators</strong>, who rely on our infrastructure for daily operations.",
    routeEyebrow: "Transit Directions",
    route1: "Armenia",
    route2: "Azerbaijan",
    route3: "Turkey",
    viaGeorgia: "Via Georgia",
    contactEyebrow: "Contact",
    contactH2: "Let's get connected.",
    contactH4a: "Contact Information",
    kAddress: "Address",
    vAddress: "160 M. Tsinamdzgvrishvili St.,<br>Tbilisi 0112, Georgia",
    kPhone: "Phone",
    kTech: "Technical",
    kEmail: "Email",
    kWeb: "Website",
    contactH4b: "Request a Connection",
    contactCtaP:
      "Reach out for information on internet service or channel lease — our team is available 24/7.",
    callBtn: "Call Now →",
    emailBtn: "Send Email",
    footerLeft: "© 2004–2026 Railway Telecom. All rights reserved.",
    mapEyebrow: "Location",
    mapH4: "Find us on the map",
    mapP: "160 M. Tsinamdzgvrishvili St.,<br>Tbilisi 0112, Georgia",
    mapLink: "Open in Google Maps →",
    techEyebrow: "Infrastructure",
    techH2: "Technology we stand behind.",
    techP:
      "From fiber lines to data-processing nodes — infrastructure built for reliability.",
    tech1h: "Fiber Network",
    tech1p:
      "High-throughput optical fiber lines, engineered for reliability and minimal latency.",
    tech2h: "Data Node",
    tech2p:
      "Communication equipment across railway station infrastructure — monitored around the clock.",
    tech3h: "Stable Signal",
    tech3p:
      "Continuous transmission monitoring with automatic recovery in case of line faults.",
    introTagline:
      "Backbone network operator,<br>the infrastructure Georgia runs on — since 2004.",
    introScroll: "Scroll",
    newsEyebrow: "News",
    newsH2: "Company news and updates.",
    newsP:
      "Information on infrastructure development, services, and company activity.",
    newsLoading: "Loading...",
    newsEmpty: "No news posted yet.",
    recentNewsEyebrow: "News",
    recentNewsH2: "Latest news.",
    recentNewsP: "Recent updates and company information.",
    exploreMoreBtn: "View all news →",
  },
};

const langButtons = document.querySelectorAll(".lang-toggle button");
function setLang(lang) {
  document.documentElement.lang = lang;
  langButtons.forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang),
  );
  if (lang === "ka") return; // ka is the default markup, nothing to swap back from stored originals needed since we only swap forward each time from current DOM using data attrs below
}

// store originals (Georgian) before first swap
const textNodes = document.querySelectorAll("[data-i18n]");
const htmlNodes = document.querySelectorAll("[data-i18n-html]");
const originals = { text: new Map(), html: new Map() };
textNodes.forEach((el) => originals.text.set(el, el.textContent));
htmlNodes.forEach((el) => originals.html.set(el, el.innerHTML));

function applyLang(lang) {
  if (lang === "ka") {
    textNodes.forEach((el) => (el.textContent = originals.text.get(el)));
    htmlNodes.forEach((el) => (el.innerHTML = originals.html.get(el)));
  } else {
    const dict = translations[lang];
    textNodes.forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    htmlNodes.forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
  }
  setLang(lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});
