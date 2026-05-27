/* =========================================================================
   PERFECT CONDO DEALS — site.js
   Single source of truth for header, footer, sticky CTA + interactions.
   Each page: <body data-page="home"> and optional empty #site-header / #site-footer.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Brand config (replace placeholders before launch) ---- */
  var BRAND = {
    name: "Perfect Condo Deals",
    tagline: "GTA Pre-Construction & Assignment Deals",
    phone: "(437) 555-0182",
    phoneHref: "tel:+14375550182",
    email: "hello@perfectcondodeals.com",
    hours: "Mon–Sun · 9:00am – 7:00pm",
    area: "Serving the Greater Toronto Area",
    brokerage: "RE/MAX Hallmark, Brokerage",
    reco: "[RECO #]"
  };

  var LOGO = '<svg class="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="2" y="2" width="44" height="44" rx="10" fill="#0c1a37"/>' +
    '<path d="M13 35V18l6-4 6 4v17" stroke="#d9bd79" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M25 35V22l5-3 5 3v13" stroke="#c2a25a" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M16 23h2M16 27h2M22 23h-2M29 26h2M33 26h-2M29 30h2M33 30h-2" stroke="#d9bd79" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M9 35h30" stroke="#d9bd79" stroke-width="2" stroke-linecap="round"/></svg>';

  function brandBlock(footer) {
    return '<a class="brand" href="index.html" aria-label="' + BRAND.name + ' home">' + LOGO +
      '<span class="logo-text"><span class="b1">Perfect Condo Deals</span>' +
      '<span class="b2">Pre-Construction · GTA</span></span></a>';
  }

  /* ---- Icons ---- */
  var IC = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.5-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.2a3 3 0 00-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 002 8.2 31 31 0 002 12a31 31 0 00.1 3.8 3 3 0 002.1 2.1c1.9.6 7.8.6 7.8.6s6 0 7.9-.6a3 3 0 002.1-2.1A31 31 0 0022 12a31 31 0 00-.1-3.8z"/><path d="m10 15 5-3-5-3z"/></svg>',
    chevron: '<svg class="caret" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
  };

  /* ---- Nav model ---- */
  var NAV = [
    { label: "Home", href: "index.html", key: "home" },
    { label: "Projects", href: "projects.html", key: "projects", children: [
      { t: "1515 Pickering Parkway", s: "Studios from the high $300s · Pickering", href: "1515-pickering.html", ic: "①" },
      { t: "NORTHCORE", s: "Townhomes & tower · Yonge & Sheppard", href: "northcore.html", ic: "②" },
      { t: "All Projects", s: "Browse every available deal", href: "projects.html", ic: "▦" }
    ]},
    { label: "Buyer's Guide", href: "guide.html", key: "guide" },
    { label: "About", href: "about.html", key: "about" },
    { label: "Contact", href: "contact.html", key: "contact" }
  ];

  function buildHeader(active) {
    var topbar = '<div class="topbar"><div class="wrap">' +
      '<div class="tb-left">' +
        '<span class="tb-item">' + IC.pin + BRAND.area + '</span>' +
        '<span class="tb-item hours">' + IC.clock + BRAND.hours + '</span>' +
      '</div>' +
      '<div class="tb-right">' +
        '<a class="tb-item" href="' + BRAND.phoneHref + '">' + IC.phone + BRAND.phone + '</a>' +
        '<span class="tb-soc">' +
          '<a href="#" aria-label="Facebook">' + IC.fb + '</a>' +
          '<a href="#" aria-label="Instagram">' + IC.ig + '</a>' +
          '<a href="#" aria-label="YouTube">' + IC.yt + '</a>' +
        '</span>' +
      '</div></div></div>';

    var links = NAV.map(function (n) {
      var cls = n.key === active ? ' class="active"' : '';
      if (n.children) {
        var items = n.children.map(function (c) {
          return '<a href="' + c.href + '"><span class="di-ic">' + c.ic + '</span>' +
            '<span><span class="di-t">' + c.t + '</span><span class="di-s">' + c.s + '</span></span></a>';
        }).join('');
        return '<li' + cls + ' data-has-children><a href="' + n.href + '">' + n.label + IC.chevron + '</a>' +
          '<div class="dropdown">' + items + '</div></li>';
      }
      return '<li' + cls + '><a href="' + n.href + '">' + n.label + '</a></li>';
    }).join('');

    var nav = '<nav class="nav"><div class="wrap">' + brandBlock() +
      '<ul class="nav-links" id="navLinks">' + links +
        '<li class="nav-cta"><a class="btn btn-gold" href="contact.html">Register Now</a></li>' +
      '</ul>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></nav>';

    return topbar + nav;
  }

  function buildFooter() {
    var explore = [["Home","index.html"],["All Projects","projects.html"],["Buyer's Guide","guide.html"],["About Us","about.html"],["Contact","contact.html"]];
    var projects = [["1515 Pickering Parkway","1515-pickering.html"],["NORTHCORE — 53 Sheppard","northcore.html"],["Builder Surplus Deals","projects.html"],["Assignment Sales","projects.html"],["Register Your Interest","contact.html"]];
    function list(arr){return arr.map(function(a){return '<li><a href="'+a[1]+'">'+a[0]+'</a></li>';}).join('');}

    return '<footer class="site"><div class="wrap">' +
      '<div class="fgrid">' +
        '<div>' + brandBlock(true) +
          '<p class="fabout">Connecting GTA buyers to builder-surplus and below-market pre-construction condos and assignments — opportunities that are often marketed privately, away from MLS.</p>' +
          '<div class="fsoc"><a href="#" aria-label="Facebook">'+IC.fb+'</a><a href="#" aria-label="Instagram">'+IC.ig+'</a><a href="#" aria-label="YouTube">'+IC.yt+'</a></div>' +
        '</div>' +
        '<div><h5>Explore</h5><ul>'+list(explore)+'</ul></div>' +
        '<div><h5>Projects</h5><ul>'+list(projects)+'</ul></div>' +
        '<div class="fcontact"><h5>Get in touch</h5>' +
          '<div class="fc">'+IC.phone+'<a href="'+BRAND.phoneHref+'">'+BRAND.phone+'</a></div>' +
          '<div class="fc">'+IC.mail+'<a href="mailto:'+BRAND.email+'">'+BRAND.email+'</a></div>' +
          '<div class="fc">'+IC.clock+'<span>'+BRAND.hours+'</span></div>' +
          '<a class="btn btn-gold" style="margin-top:6px" href="contact.html">Get the Deal List →</a>' +
        '</div>' +
      '</div>' +
      '<div class="legal">' +
        BRAND.brokerage + ' (RECO Reg. #' + BRAND.reco + '). All advertising is provided by the brokerage; individual representatives act on its behalf. ' +
        'Information herein is from sources deemed reliable but is not guaranteed accurate and is subject to change without notice. Prices, incentives, sizes, fees, taxes, availability and renderings are illustrative only, may not reflect the final product, and are subject to change. Renderings are artist’s concepts. ' +
        'Stated savings reflect builder pricing versus comparable units as of the date shown and vary by unit; not guaranteed. GST/HST rebate eligibility depends on your circumstances (owner-occupied vs. rental) and amounts vary; proposed 2026 rebate enhancements are subject to legislation — consult a tax/legal advisor. ' +
        'Assignment opportunities are advertised only where permitted by the original builder’s agreement and with required consents. ' +
        'This is not an offering for sale; any such offering can only be made with the applicable disclosure documents. Not intended to solicit buyers or sellers currently under contract with a brokerage. E.&amp;O.E.' +
        '<div class="lrow"><span>© ' + new Date().getFullYear() + ' ' + BRAND.name + '. All rights reserved.</span>' +
        '<span><a href="privacy.html">Privacy &amp; CASL Policy</a> · <a href="privacy.html">Terms</a> · Each office independently owned and operated.</span></div>' +
      '</div>' +
      '</div></footer>';
  }

  function buildSticky() {
    return '<div class="sticky-cta">' +
      '<a class="btn btn-outline" href="' + BRAND.phoneHref + '">Call</a>' +
      '<a class="btn btn-gold" href="contact.html">Register Now →</a></div>';
  }

  /* ---- Mount ---- */
  function mount() {
    var page = document.body.getAttribute("data-page") || "";
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.innerHTML = buildHeader(page);
    if (f) f.innerHTML = buildFooter();
    if (!document.querySelector(".sticky-cta")) {
      document.body.insertAdjacentHTML("beforeend", buildSticky());
    }
    wireNav();
    wireFaq();
    wireForms();
    wireReveal();
    wireSearch();
  }

  function wireNav() {
    var nav = document.querySelector(".nav");
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      // mobile dropdown expand
      links.querySelectorAll("li[data-has-children] > a").forEach(function (a) {
        a.addEventListener("click", function (e) {
          if (window.innerWidth <= 1040) {
            e.preventDefault();
            a.parentElement.classList.toggle("mobile-open");
          }
        });
      });
    }
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function wireFaq() {
    document.querySelectorAll(".qa-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qa = btn.closest(".qa");
        var ans = qa.querySelector(".qa-a");
        var open = qa.classList.toggle("open");
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
      });
    });
  }

  function qp(k) { return new URLSearchParams(location.search).get(k) || ""; }

  function wireForms() {
    document.querySelectorAll("form[data-lead]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var consent = form.querySelector('input[name="consent"]');
        if (consent && !consent.checked) { consent.focus(); return; }
        var fd = new FormData(form);
        var data = {};
        fd.forEach(function (v, k) { data[k] = v; });
        data.consent = true;
        data.consentText = consent ? consent.getAttribute("data-text") || "" : "";
        data.consentTimestamp = new Date().toISOString();
        data.source = form.getAttribute("data-source") || document.body.getAttribute("data-page");
        data.page = location.href;
        data.referrer = document.referrer;
        ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"].forEach(function (k) { data[k] = qp(k); });

        /* === CRM WEBHOOK — wire this to GoHighLevel / HubSpot / Zapier / Make ===
        fetch('https://YOUR_CRM_WEBHOOK_URL', {
          method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
        });
        */
        // Fallback so no lead is lost while CRM is being connected:
        try {
          var body = encodeURIComponent(Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n"));
          window.open("mailto:" + BRAND.email + "?subject=" + encodeURIComponent("New Lead — " + (data.project || data.source || "Website")) + "&body=" + body, "_blank");
        } catch (err) {}

        var box = form.closest("[data-formbox]") || form.parentElement;
        var success = document.querySelector(form.getAttribute("data-success") || "#formSuccess");
        if (box) box.style.display = "none";
        if (success) success.style.display = "block";
        if (typeof gtag !== "undefined") gtag("event", "conversion");
        if (typeof fbq !== "undefined") fbq("track", "Lead");
      });
    });
  }

  function wireSearch() {
    document.querySelectorAll("form[data-search]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        window.location.href = "projects.html";
      });
    });
  }

  function wireReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
