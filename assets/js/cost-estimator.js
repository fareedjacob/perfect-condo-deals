/* =========================================================================
   THE CONDO CAPITAL — cost-estimator.js
   Buyer Cost & Mortgage Estimator for GTA pre-construction condos.
   ALL OUTPUTS ARE ESTIMATES — not financial/mortgage advice, not a quote or
   pre-approval. Rates, taxes, fees and deposit schedules vary and change.
   Mounts on #bce. Pure calc functions are exported on window.BCE for testing.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Pure calculation functions ---------- */

  // Ontario Land Transfer Tax (marginal brackets), single/two SFR rate over $2M.
  function ontarioLTT(p) {
    var t = 0;
    t += Math.min(p, 55000) * 0.005;
    if (p > 55000) t += (Math.min(p, 250000) - 55000) * 0.01;
    if (p > 250000) t += (Math.min(p, 400000) - 250000) * 0.015;
    if (p > 400000) t += (Math.min(p, 2000000) - 400000) * 0.02;
    if (p > 2000000) t += (p - 2000000) * 0.025;
    return Math.max(0, t);
  }
  // Toronto Municipal LTT: mirrors Ontario to $2M, then luxury tiers.
  function torontoMLTT(p) {
    var t = 0;
    t += Math.min(p, 55000) * 0.005;
    if (p > 55000) t += (Math.min(p, 250000) - 55000) * 0.01;
    if (p > 250000) t += (Math.min(p, 400000) - 250000) * 0.015;
    if (p > 400000) t += (Math.min(p, 2000000) - 400000) * 0.02;
    if (p > 2000000) t += (Math.min(p, 3000000) - 2000000) * 0.025;
    if (p > 3000000) t += (Math.min(p, 4000000) - 3000000) * 0.035;
    if (p > 4000000) t += (Math.min(p, 5000000) - 4000000) * 0.045;
    if (p > 5000000) t += (Math.min(p, 10000000) - 5000000) * 0.055;
    if (p > 10000000) t += (Math.min(p, 20000000) - 10000000) * 0.065;
    if (p > 20000000) t += (p - 20000000) * 0.075;
    return Math.max(0, t);
  }
  // Minimum down payment (2024+ rules): 5% to $500k, 10% $500k–$1.5M, 20% over.
  function minDownPayment(p) {
    if (p <= 500000) return p * 0.05;
    if (p <= 1500000) return 25000 + (p - 500000) * 0.10;
    return p * 0.20;
  }
  // CMHC premium rate by loan-to-value (only if down payment < 20% and price < $1.5M).
  function cmhcRate(ltv) {
    if (ltv <= 0.80) return 0;
    if (ltv <= 0.85) return 0.028;
    if (ltv <= 0.90) return 0.031;
    if (ltv <= 0.95) return 0.040;
    return 0.040;
  }
  // Canadian fixed mortgage: semi-annual compounding -> effective monthly rate.
  function monthlyPayment(principal, annualRatePct, years) {
    if (principal <= 0) return 0;
    var i = annualRatePct / 100;
    if (i === 0) return principal / (years * 12);
    var r = Math.pow(1 + i / 2, 1 / 6) - 1; // effective monthly rate (Canadian convention)
    var n = years * 12;
    return principal * r / (1 - Math.pow(1 + r, -n));
  }
  // 2026 enhanced HST rebate (owner-occupied), mirrors guide.html / hst-calc.js.
  function hstRebate(price) {
    var CAP = 1000000, PD_START = 1500000, PD_END = 1850000, MAX = 130000, FLOOR = 24000;
    if (price <= CAP) return Math.min(price * 0.13, MAX);
    if (price <= PD_START) return MAX;
    if (price < PD_END) return MAX - (MAX - FLOOR) * ((price - PD_START) / (PD_END - PD_START));
    return FLOOR;
  }

  function compute(inp) {
    var price = inp.price;
    var toronto = inp.city === "toronto";
    var dpPct = inp.dpPct;
    var downPayment = price * dpPct / 100;
    var minDp = minDownPayment(price);
    var belowMin = downPayment < minDp - 0.5;

    var baseMortgage = Math.max(0, price - downPayment);
    var ltv = price > 0 ? baseMortgage / price : 0;
    var insurable = dpPct < 20 && price < 1500000;
    var premiumRate = insurable ? cmhcRate(ltv) : 0;
    var premium = baseMortgage * premiumRate;
    var totalMortgage = baseMortgage + premium;
    var monthly = monthlyPayment(totalMortgage, inp.rate, inp.amort);

    var lttProv = ontarioLTT(price);
    var lttMuni = toronto ? torontoMLTT(price) : 0;
    var lttGross = lttProv + lttMuni;
    var ftbRebate = inp.ftb ? (Math.min(lttProv, 4000) + (toronto ? Math.min(lttMuni, 4475) : 0)) : 0;
    var lttNet = Math.max(0, lttGross - ftbRebate);

    var cmhcPST = premium * 0.08; // Ontario 8% PST on CMHC premium, payable at closing
    var closing = lttNet + inp.legal + inp.title + inp.tarion + inp.levies + cmhcPST;

    var propTaxYr = price * inp.taxRatePct / 100;
    var propTaxMo = propTaxYr / 12;
    var monthlyCarry = monthly + propTaxMo + inp.condo;

    var unpaid = Math.max(0, price - downPayment);
    var interim = (unpaid * inp.occRatePct / 100 / 12) + propTaxMo + inp.condo;

    var cashToClose = downPayment + closing;
    var rebate = hstRebate(price);

    return {
      downPayment: downPayment, minDp: minDp, belowMin: belowMin,
      baseMortgage: baseMortgage, premium: premium, premiumRate: premiumRate,
      totalMortgage: totalMortgage, monthly: monthly, insured: insurable && premiumRate > 0,
      lttGross: lttGross, lttProv: lttProv, lttMuni: lttMuni, ftbRebate: ftbRebate, lttNet: lttNet,
      cmhcPST: cmhcPST, closing: closing, toronto: toronto,
      propTaxYr: propTaxYr, propTaxMo: propTaxMo, monthlyCarry: monthlyCarry,
      interim: interim, cashToClose: cashToClose, rebate: rebate
    };
  }

  // Representative staged deposit schedule (illustrative; varies by builder).
  function depositSchedule(downPayment) {
    return [
      { label: "On signing", amt: downPayment * 0.25 },
      { label: "In 90 days", amt: downPayment * 0.25 },
      { label: "In 365 days", amt: downPayment * 0.25 },
      { label: "On occupancy", amt: downPayment * 0.25 }
    ];
  }

  window.BCE = { ontarioLTT: ontarioLTT, torontoMLTT: torontoMLTT, minDownPayment: minDownPayment, cmhcRate: cmhcRate, monthlyPayment: monthlyPayment, hstRebate: hstRebate, compute: compute };

  /* ---------- DOM wiring ---------- */
  function money(n) { return "$" + Math.round(n).toLocaleString("en-CA"); }

  function init() {
    var root = document.getElementById("bce");
    if (!root) return;
    var $ = function (id) { return document.getElementById(id); };
    var out = function (key) { return root.querySelector('[data-out="' + key + '"]'); };
    var num = function (id, def) { var v = parseFloat($(id).value); return isNaN(v) ? def : v; };

    var priceEl = $("bce-price"), priceRange = $("bce-price-range");

    function setText(key, val) { var el = out(key); if (el) el.textContent = val; }
    function showRow(key, show) { var el = root.querySelector('[data-row="' + key + '"]'); if (el) el.style.display = show ? "" : "none"; }

    function read() {
      return {
        price: Math.min(3000000, Math.max(200000, num("bce-price", 700000))),
        city: $("bce-city").value,
        ftb: $("bce-ftb").checked,
        dpPct: Math.min(100, Math.max(5, num("bce-dp", 20))),
        rate: Math.min(15, Math.max(0, num("bce-rate", 4.99))),
        amort: parseInt($("bce-amort").value, 10) || 30,
        taxRatePct: Math.max(0, num("bce-taxrate", 0.71)),
        legal: Math.max(0, num("bce-legal", 2000)),
        title: Math.max(0, num("bce-title", 400)),
        tarion: Math.max(0, num("bce-tarion", 1000)),
        levies: Math.max(0, num("bce-levies", 12000)),
        condo: Math.max(0, num("bce-condo", 550)),
        occRatePct: Math.max(0, num("bce-occrate", 5))
      };
    }

    function render() {
      var inp = read();
      var r = compute(inp);

      // Mortgage
      setText("loan", money(r.totalMortgage));
      setText("monthly", money(r.monthly));
      showRow("premium", r.insured);
      if (r.insured) setText("premium", money(r.premium) + "  (" + (r.premiumRate * 100).toFixed(2) + "%)");

      // Down payment + schedule
      setText("downpct", inp.dpPct + "%");
      setText("downpay", money(r.downPayment));
      var sched = depositSchedule(r.downPayment);
      var schedEl = out("schedule");
      if (schedEl) schedEl.innerHTML = sched.map(function (s) {
        return '<div class="bce-row"><span>' + s.label + '</span><b>' + money(s.amt) + '</b></div>';
      }).join("");
      var warn = out("dpwarn");
      if (warn) warn.style.display = r.belowMin ? "" : "none";
      if (r.belowMin) setText("dpwarn", "Below the minimum down payment for this price (about " + money(r.minDp) + "). Lenders would require more.");

      // Closing costs
      setText("lttlabel", r.toronto ? "Land transfer tax (ON + Toronto)" : "Ontario land transfer tax");
      setText("ltt", money(r.lttNet));
      showRow("ftb", inp.ftb && r.ftbRebate > 0);
      if (inp.ftb) setText("ftb", "−" + money(r.ftbRebate));
      setText("legal", money(inp.legal));
      setText("title", money(inp.title));
      setText("tarion", money(inp.tarion));
      setText("levies", money(inp.levies));
      showRow("cmhcpst", r.insured);
      if (r.insured) setText("cmhcpst", money(r.cmhcPST));
      setText("closing", money(r.closing));
      setText("cashtoclose", money(r.cashToClose));

      // Ongoing monthly
      setText("mortmo", money(r.monthly));
      setText("taxmo", money(r.propTaxMo));
      setText("condomo", money(inp.condo));
      setText("carry", money(r.monthlyCarry));
      setText("taxyr", money(r.propTaxYr) + " / yr");

      // Interim occupancy
      setText("interim", money(r.interim));

      // HST rebate
      setText("rebate", money(r.rebate));

      if (window.dataLayer) { /* throttle: only push on explicit use, handled below */ }
    }

    // sync price slider <-> number
    priceEl.addEventListener("input", function () { priceRange.value = Math.min(3000000, Math.max(200000, num("bce-price", 700000))); render(); });
    priceRange.addEventListener("input", function () { priceEl.value = priceRange.value; render(); });

    // city default tax rate hint when switching
    $("bce-city").addEventListener("change", function () {
      var def = $("bce-city").value === "toronto" ? 0.71 : 1.0;
      $("bce-taxrate").value = def;
      render();
      (window.dataLayer = window.dataLayer || []).push({ event: "cost_estimator_use", calc_source: "buyer-cost-estimator", calc_city: $("bce-city").value });
    });

    ["bce-ftb", "bce-dp", "bce-rate", "bce-amort", "bce-taxrate", "bce-legal", "bce-title", "bce-tarion", "bce-levies", "bce-condo", "bce-occrate"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", render);
      if (el && el.tagName === "SELECT") el.addEventListener("change", render);
    });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
