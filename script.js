/* ============================================================
   BEVARON SYSTEMS — script.js
   No dependencies beyond Lucide (loaded in index.html)
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     1. INTRO SPLASH
     White screen → logo mark → wordmark → hold → fade out.
     Total ~2.3s. Skipped entirely for prefers-reduced-motion.
     ============================================================ */
  function runSplash() {
    var splash = document.getElementById("splash");

    if (!splash) return;

    if (prefersReducedMotion) {
      splash.remove();
      return;
    }

    // Pause hero entrance animations until the splash clears
    document.body.classList.add("splash-active");

    // Mark → wordmark → hold → fade (CSS keyframes handle the sequence;
    // this timer ends the sequence inside the ~2.5s budget)
    window.setTimeout(function () {
      splash.classList.add("splash-done");
      document.body.classList.remove("splash-active");
      window.setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 500);
    }, 1900);
  }

  // Returning via back/forward cache: never replay the splash
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      var splash = document.getElementById("splash");
      if (splash) splash.remove();
      document.body.classList.remove("splash-active");
    }
  });

  runSplash();

  /* ============================================================
     2. SERVICES DATA — injected grid
     ============================================================ */
  var SERVICES = [
    { icon: "cpu", title: "Hardware Engineering",
      desc: "System architecture, schematic design and design reviews — from concept to production-ready electronics." },
    { icon: "circuit-board", title: "PCB Design & Redesign",
      desc: "New layouts and re-engineered boards: stackup, routing, DFM and design documentation." },
    { icon: "activity", title: "PCB Debugging & Troubleshooting",
      desc: "Board bring-up, fault isolation and root-cause analysis when hardware doesn't behave." },
    { icon: "history", title: "PCB Rescue & Obsolescence Management",
      desc: "Boards kept alive through EOL parts, redesigns and verified replacement paths." },
    { icon: "file-search", title: "Reverse Engineering",
      desc: "Schematic recovery and design reconstruction from existing hardware or partial files.",
      disclaimer: "UNDERTAKEN ONLY WITH PROVEN IP AUTHORIZATION" },
    { icon: "list-checks", title: "BOM Engineering & Optimization",
      desc: "Lifecycle audits, risk flags and cost-down options — summarized in a BOM Health Report." },
    { icon: "package-search", title: "Component Sourcing & Procurement",
      desc: "Availability checks, lead-time management, alternative qualification and counterfeit-risk control." },
    { icon: "flask-conical", title: "Prototype Development",
      desc: "Fast prototype turns, bring-up and iteration until the design is proven on the bench." },
    { icon: "factory", title: "PCBA & Assembly",
      desc: "Fabrication and assembly coordinated through vetted partners, inspected before anything ships." },
    { icon: "boxes", title: "Small-Batch Manufacturing",
      desc: "Production quantities matched to real demand — no factory minimums standing in the way.",
      chips: ["10", "50", "100", "500", "1,000+"] },
    { icon: "package", title: "Product Assembly / Box Build",
      desc: "Board-to-product integration: enclosures, cabling, labeling and final assembly." },
    { icon: "test-tube", title: "Testing & Quality Control",
      desc: "Functional testing, fixtures and pre-shipment QC on every unit, documented per build." },
    { icon: "microchip", title: "Embedded & Firmware",
      desc: "Firmware development, flashing, bootloaders and board-level software integration." },
    { icon: "box", title: "Enclosure & Mechanical Integration",
      desc: "Mechanical design and integration so electronics, enclosure and product fit as one." },
    { icon: "shield-check", title: "Certification & Compliance Support",
      desc: "Pre-compliance guidance and test preparation for your target markets.",
      disclaimer: "REQUIREMENTS VARY BY PRODUCT & MARKET" },
    { icon: "ship", title: "Supply Chain Management",
      desc: "Coordinated logistics, inventory planning and delivery — visible from PO to doorstep." },
    { icon: "wrench", title: "Sustaining Engineering",
      desc: "Ongoing engineering ownership for fielded products: revisions, fixes and improvements." },
    { icon: "search-code", title: "RMA & Failure Analysis",
      desc: "Returned-unit triage, failure analysis and corrective actions that prevent recurrence." },
    { icon: "file-text", title: "Engineering Documentation",
      desc: "Schematics, test reports, build records and design packages that outlast the project." }
  ];

  function buildServiceCard(s) {
    var card = document.createElement("article");
    card.className = "service-card reveal";

    var html = '<div class="service-ico"><i data-lucide="' + s.icon + '"></i></div>' +
      "<h3>" + s.title + "</h3>" +
      "<p>" + s.desc + "</p>";

    if (s.chips) {
      html += '<div class="vol-chips">' +
        s.chips.map(function (v) { return '<span class="vol-chip">' + v + "</span>"; }).join("") +
        '<span class="vol-chip">UNITS</span></div>';
    }

    if (s.disclaimer) {
      html += '<p class="service-disclaimer">※ ' + s.disclaimer + "</p>";
    }

    card.innerHTML = html;
    return card;
  }

  var grid = document.getElementById("services-grid");
  if (grid) {
    SERVICES.forEach(function (s) { grid.appendChild(buildServiceCard(s)); });
  }

  /* ============================================================
     3. LUCIDE ICONS (after all dynamic content exists)
     ============================================================ */
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  /* ============================================================
     4. NAV — scrolled state, mobile menu, scrollspy
     ============================================================ */
  var nav = document.getElementById("site-nav");

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("nav-scrolled");
    else nav.classList.remove("nav-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var menuOpen = false;

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuOpen = open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.style.maxHeight = open ? mobileMenu.scrollHeight + "px" : "0px";
    mobileMenu.style.opacity = open ? "1" : "0";
    menuBtn.innerHTML = '<i data-lucide="' + (open ? "x" : "menu") + '" class="w-6 h-6"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen) setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && menuOpen) setMenu(false);
    });
  }

  // Scrollspy — highlight the section currently in view
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var spyTargets = navLinks
    .map(function (link) {
      var id = (link.getAttribute("href") || "").replace("#", "");
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (l) {
            l.classList.toggle(
              "active",
              l.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    spyTargets.forEach(function (t) { spyObserver.observe(t); });
  }

  /* ============================================================
     5. SCROLL REVEAL
     ============================================================ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("reveal-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ============================================================
     6. CONTACT FORM — validated + Netlify-ready
     ============================================================ */
  var form = document.getElementById("inquiry-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("hidden", "form-status-ok", "form-status-err");
    if (kind === "ok") statusEl.classList.add("form-status-ok");
    if (kind === "err") statusEl.classList.add("form-status-err");
  }

  function clearInvalid() {
    if (!form) return;
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  function validate() {
    if (!form) return true;
    clearInvalid();
    var firstBad = null;

    form.querySelectorAll("[required]").forEach(function (field) {
      var bad = !field.value || !field.value.trim() || !field.checkValidity();
      if (bad) {
        field.setAttribute("aria-invalid", "true");
        if (!firstBad) firstBad = field;
      }
    });

    if (firstBad) {
      setStatus("Please complete the highlighted fields.", "err");
      firstBad.focus();
      return false;
    }
    return true;
  }

  // File input label + drag styling
  var fileInput = document.getElementById("f-file");
  var fileLabel = document.getElementById("file-label");
  var dropzone = document.getElementById("dropzone");
  var defaultFileText = "Drop Gerber or BOM files here, or click to browse";

  if (fileInput && fileLabel) {
    fileInput.addEventListener("change", function () {
      var files = Array.prototype.slice.call(fileInput.files || []);
      fileLabel.textContent = files.length
        ? files.map(function (f) { return f.name; }).join(", ")
        : defaultFileText;
    });
  }

  if (dropzone) {
    ["dragenter", "dragover"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.add("dropzone-over");
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.remove("dropzone-over");
      });
    });
    dropzone.addEventListener("drop", function (e) {
      if (fileInput && e.dataTransfer && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: silently drop bots
      var honeypot = form.querySelector('input[name="bot-field"]');
      if (honeypot && honeypot.value) return;

      if (!validate()) return;

      var btnText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending…";
      }

      // Netlify Forms: encode and POST to "/"
      var body = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          setStatus("Thank you — your project inquiry was received. A project engineer will reply to you shortly.", "ok");
          form.reset();
          if (fileLabel) fileLabel.textContent = defaultFileText;
        })
        .catch(function () {
          // Fallback: open the visitor's mail client so the inquiry is never lost
          setStatus("Could not submit automatically — opening your email client instead.", "err");
          var get = function (name) {
            var el = form.querySelector('[name="' + name + '"]');
            return el ? String(el.value || "") : "";
          };
          var subject = encodeURIComponent("Hardware project inquiry — " + get("help_with"));
          var lines = [
            "Name: " + get("name"),
            "Company: " + get("company"),
            "Email: " + get("email"),
            "Country: " + get("country"),
            "Phone: " + get("phone"),
            "Need help with: " + get("help_with"),
            "Project stage: " + get("project_stage"),
            "Estimated quantity: " + get("estimated_quantity"),
            "Expected timeline: " + get("expected_timeline"),
            "",
            get("message")
          ].join("\n");
          window.location.href =
            "mailto:bevaronsystem@gmail.com?subject=" + subject + "&body=" + encodeURIComponent(lines);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = btnText;
            if (window.lucide) window.lucide.createIcons();
          }
        });
    });

    form.addEventListener("input", function (e) {
      if (e.target && e.target.hasAttribute("aria-invalid")) {
        e.target.removeAttribute("aria-invalid");
      }
    });
  }

  /* ============================================================
     7. FOOTER YEAR
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
