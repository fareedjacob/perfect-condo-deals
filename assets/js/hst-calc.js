/* =========================================================================
   THE CONDO CAPITAL — hst-calc.js
   Reusable 2026 HST-rebate estimator widget. Single source of truth for the
   rebate math; drop <div data-hst-calc data-source="home"></div> on any page
   and include this script. Renders inputs + result + compliance disclaimer.
   Math mirrors guide.html / hst-rebate-calculator.html.
   All classes are .hstc-* namespaced to avoid colliding with site.css.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Rebate model (owner-occupied; matches guide.html) ---- */
  var RATE = 0.13, CAP = 1000000, PD_START = 1500000, PD_END = 1850000, MAXREBATE = 130000, FLOOR = 24000;
  var MIN_PRICE = 200000, MAX_PRICE = 2000000, DEFAULT_PRICE = 650000;

  function maxRebate(price) {
    if (price <= CAP) return Math.min(price * RATE, MAXREBATE); // up to $1M: full 13%
    if (price <= PD_START) return MAXREBATE;                    // $1M–$1.5M: holds at $130K
    if (price < PD_END) {                                       // $1.5M–$1.85M: phase down to floor
      return MAXREBATE - (MAXREBATE - FLOOR) * ((price - PD_START) / (PD_END - PD_START));
    }
    return FLOOR;                                               // above $1.85M: $24K floor
  }
  function clampPrice(v) {
    v = parseFloat(v);
    if (isNaN(v)) v = DEFAULT_PRICE;
    return Math.min(MAX_PRICE, Math.max(MIN_PRICE, v));
  }
  function fmt(n) { return "$" + Math.round(n).toLocaleString("en-CA"); }

  /* ---- Scoped styles (injected once; every selector namespaced) ---- */
  var CSS =
    ".hstc{--n:#0c1a37;--g:#c2a25a;--g2:#d9bd79;--ln:#e6e2d6;--mut:#6b7280}" +
    ".hstc-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch}" +
    "@media(max-width:860px){.hstc-grid{grid-template-columns:1fr}}" +
    ".hstc-inputs{background:#fff;border:1px solid var(--ln);border-radius:18px;padding:26px 24px;box-shadow:0 18px 44px rgba(12,26,55,.06)}" +
    ".hstc-hl{display:block;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--g)}" +
    ".hstc-inputs h3{font:600 22px/1.2 'Playfair Display',Georgia,serif;color:var(--n);margin:6px 0 20px}" +
    ".hstc-fg{margin-bottom:20px}" +
    ".hstc-fg label{display:block;font-size:13px;font-weight:600;color:var(--n);margin-bottom:8px}" +
    ".hstc-price{display:flex;align-items:center;gap:10px;border:1.5px solid var(--ln);border-radius:12px;padding:10px 14px}" +
    ".hstc-price .hstc-d{font-size:20px;font-weight:700;color:var(--n)}" +
    ".hstc-price input{border:0;outline:0;width:100%;font:700 20px/1 inherit;color:var(--n);background:transparent}" +
    ".hstc input[type=range]{width:100%;accent-color:var(--g);margin-top:14px}" +
    ".hstc-seg{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
    ".hstc-seg button{padding:13px 14px;border-radius:12px;border:1.5px solid var(--ln);background:#fff;font:600 15px/1 inherit;color:var(--n);cursor:pointer;transition:all .15s}" +
    ".hstc-seg button[aria-pressed=true]{border-color:var(--g);background:rgba(194,162,90,.12);box-shadow:0 0 0 3px rgba(194,162,90,.12)}" +
    ".hstc-hint{font-size:12px;color:var(--mut);line-height:1.6;margin-top:8px}" +
    ".hstc-result{background:var(--n);color:#fff;border-radius:18px;padding:30px 28px;display:flex;flex-direction:column}" +
    ".hstc-rk{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--g2)}" +
    ".hstc-big{font:800 clamp(30px,5vw,48px)/1.05 'Playfair Display',Georgia,serif;letter-spacing:-1px;margin:8px 0 2px;white-space:nowrap}" +
    ".hstc-sub{color:#aeb7ca;font-size:14px;min-height:42px}" +
    ".hstc-bd{margin:22px 0 0;border-top:1px solid rgba(255,255,255,.12);padding-top:18px;display:flex;flex-direction:column;gap:12px}" +
    ".hstc-row{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:baseline;justify-content:space-between;gap:16px;font-size:15px;color:#dfe4ee}" +
    ".hstc-row>span{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".hstc-row b{flex:0 0 auto;font-weight:700;color:#fff;text-align:right;white-space:nowrap}" +
    ".hstc-cta{margin-top:auto;padding-top:20px}" +
    ".hstc-cta a{display:block;text-align:center;width:100%;background:linear-gradient(135deg,var(--g2),var(--g));color:#1a1407;font-weight:700;padding:14px 18px;border-radius:11px;text-decoration:none}" +
    ".hstc-note{font-size:12px;color:var(--mut);line-height:1.7;margin-top:16px}";

  function injectCSS() {
    if (document.getElementById("hstc-css")) return;
    var s = document.createElement("style");
    s.id = "hstc-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function widgetHTML(cta) {
    return '' +
      '<div class="hstc-grid">' +
        '<div class="hstc-inputs">' +
          '<span class="hstc-hl">Your numbers</span>' +
          '<h3>Estimate your rebate</h3>' +
          '<div class="hstc-fg">' +
            '<label>Purchase price</label>' +
            '<div class="hstc-price"><span class="hstc-d">$</span>' +
              '<input type="number" data-price min="' + MIN_PRICE + '" max="' + MAX_PRICE + '" step="5000" value="' + DEFAULT_PRICE + '" inputmode="numeric" aria-label="Purchase price" /></div>' +
            '<input type="range" data-range min="' + MIN_PRICE + '" max="' + MAX_PRICE + '" step="5000" value="' + DEFAULT_PRICE + '" aria-label="Purchase price slider" />' +
            '<p class="hstc-hint">Drag or type a price. Most GTA new-condo suites fall between $400k and $900k.</p>' +
          '</div>' +
          '<div class="hstc-fg">' +
            '<label>How will you use it?</label>' +
            '<div class="hstc-seg" role="group" aria-label="How will you use the home">' +
              '<button type="button" data-use="live" aria-pressed="true">I\'ll live in it</button>' +
              '<button type="button" data-use="invest" aria-pressed="false">Investment / rental</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="hstc-result" aria-live="polite">' +
          '<div class="hstc-rk">Estimated maximum rebate</div>' +
          '<div class="hstc-big" data-out>$0</div>' +
          '<div class="hstc-sub" data-sub>Estimated maximum — not a guarantee.</div>' +
          '<div class="hstc-bd">' +
            '<div class="hstc-row"><span>Purchase price</span><b data-bprice>$0</b></div>' +
            '<div class="hstc-row"><span data-rlabel>Estimated max rebate</span><b data-brebate>$0</b></div>' +
            '<div class="hstc-row"><span data-nlabel>Price after rebate</span><b data-bnet>$0</b></div>' +
          '</div>' +
          '<div class="hstc-cta"><a href="' + cta + '">Get your exact figure + the deal list →</a></div>' +
        '</div>' +
      '</div>' +
      '<p class="hstc-note"><b>Estimated maximums, not guarantees — and not tax advice.</b> Owner-occupied estimates apply the proposed 2026 enhanced rebate (up to 13% to $1M, max $130,000, phasing down between $1.5M and $1.85M to a $24,000 floor). Investment/rental uses the separate NRRP path. Your actual rebate depends on the suite, price, eligibility, and agreement date; assignments often follow the original builder-agreement date. Enhancements remain subject to legislation — confirm with a tax/legal professional.</p>';
  }

  function initWidget(root) {
    var cta = root.getAttribute("data-cta") || "contact.html";
    var source = root.getAttribute("data-source") || (document.body.getAttribute("data-page") || "page");
    root.classList.add("hstc");
    root.innerHTML = widgetHTML(cta);

    var priceEl = root.querySelector("[data-price]");
    var rangeEl = root.querySelector("[data-range]");
    var liveBtn = root.querySelector('[data-use="live"]');
    var investBtn = root.querySelector('[data-use="invest"]');
    var out = root.querySelector("[data-out]");
    var sub = root.querySelector("[data-sub]");
    var bPrice = root.querySelector("[data-bprice]");
    var bRebate = root.querySelector("[data-brebate]");
    var bNet = root.querySelector("[data-bnet]");
    var rLabel = root.querySelector("[data-rlabel]");
    var nLabel = root.querySelector("[data-nlabel]");
    var invest = false;

    function render() {
      var price = clampPrice(priceEl.value);
      bPrice.textContent = fmt(price);

      if (invest) {
        out.textContent = "Let's confirm";
        sub.textContent = "Investment purchases vary.";
        rLabel.textContent = "Rebate path";
        bRebate.textContent = "Rental (NRRP)";
        nLabel.textContent = "Your exact figure";
        bNet.textContent = "We'll confirm";
        return;
      }
      var rebate = maxRebate(price);
      out.textContent = fmt(rebate);
      sub.textContent = (price >= PD_END) ? "$24,000 floor above $1.85M — estimated."
        : (price > PD_START ? "Phasing down above $1.5M — estimated maximum."
        : (price > CAP ? "At the $130,000 maximum — estimated." : "Estimated maximum — not a guarantee."));
      rLabel.textContent = "Estimated max rebate";
      bRebate.textContent = fmt(rebate);
      nLabel.textContent = "Price after rebate";
      bNet.textContent = fmt(price - rebate);
    }

    priceEl.addEventListener("input", function () { rangeEl.value = clampPrice(priceEl.value); render(); });
    rangeEl.addEventListener("input", function () { priceEl.value = rangeEl.value; render(); });
    function setUse(v) {
      invest = v;
      liveBtn.setAttribute("aria-pressed", v ? "false" : "true");
      investBtn.setAttribute("aria-pressed", v ? "true" : "false");
      render();
      (window.dataLayer = window.dataLayer || []).push({ event: "calculator_use", calc_use: v ? "investment" : "live-in", calc_source: source });
    }
    liveBtn.addEventListener("click", function () { setUse(false); });
    investBtn.addEventListener("click", function () { setUse(true); });
    render();
  }

  function mountAll() {
    var nodes = document.querySelectorAll("[data-hst-calc]");
    if (!nodes.length) return;
    injectCSS();
    nodes.forEach(function (n) { if (!n.getAttribute("data-hstc-ready")) { n.setAttribute("data-hstc-ready", "1"); initWidget(n); } });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})();
