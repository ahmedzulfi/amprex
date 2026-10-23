(function() {
  function getTemplate(basePath) {
    return `
<section id="amprex-testimonials" class="amprex-testimonials-section" data-framer-name="Testimonials">
  <div class="amprex-testimonials-header">
    <div class="amprex-badge">
      <span class="amprex-badge-dot"></span>
      Client Stories & Endorsements
    </div>
    <h2 class="amprex-testimonials-title">Trusted by Founders, Clients & Engineering Leads</h2>
    <p class="amprex-testimonials-subtitle">
      Verified recommendations from partners and clients who have collaborated with us to build and scale products.
    </p>
  </div>

  <div class="amprex-testimonials-grid">
    <!-- Testimonial 1: Muhammad Hamza -->
    <div class="amprex-testimonial-card">
      <div>
        <div class="amprex-card-author">
          <div class="amprex-avatar-wrap">
            <img class="amprex-avatar" src="${basePath}assets/testimonials/hamza.png" alt="Muhammad Hamza" loading="lazy" />
            <div class="amprex-linkedin-badge" title="LinkedIn Recommendation">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </div>
          </div>
          <div class="amprex-author-info">
            <div class="amprex-author-name-row">
              <h3 class="amprex-author-name">Muhammad Hamza</h3>
              <span class="amprex-verified-icon" title="Verified Member">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </span>
            </div>
            <p class="amprex-author-role">Co-Founder at @BizBuddy</p>
            <span class="amprex-context-pill">August 27, 2025 • Client</span>
          </div>
        </div>

        <div class="amprex-stars">★★★★★</div>
        <p class="amprex-quote-text">“One the Best creative minds i ever came across. perfection in Every Pixel Highly Recommended !”</p>
      </div>

      <div class="amprex-card-footer">
        <span class="amprex-recommendation-source">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          LinkedIn Recommendation
        </span>
      </div>
    </div>

    <!-- Testimonial 2: Maleeha Asif -->
    <div class="amprex-testimonial-card">
      <div>
        <div class="amprex-card-author">
          <div class="amprex-avatar-wrap">
            <img class="amprex-avatar" src="${basePath}assets/testimonials/maleeha.png" alt="Maleeha Asif" loading="lazy" />
            <div class="amprex-linkedin-badge" title="LinkedIn Recommendation">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </div>
          </div>
          <div class="amprex-author-info">
            <div class="amprex-author-name-row">
              <h3 class="amprex-author-name">Maleeha Asif</h3>
            </div>
            <p class="amprex-author-role">Web Designer for Creators, Coaches & Brands 🚀</p>
            <span class="amprex-context-pill">January 21, 2025 • Managed Directly</span>
          </div>
        </div>

        <div class="amprex-stars">★★★★★</div>
        <p class="amprex-quote-text">“Aseer is flexible and goes above and beyond to meet the needs of his clients. I worked with him on a client project and I was impressed by his work ethic and design skills. I would highly recommend him.”</p>
      </div>

      <div class="amprex-card-footer">
        <span class="amprex-recommendation-source">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          LinkedIn Recommendation
        </span>
      </div>
    </div>

    <!-- Testimonial 3: Naseem Saher MBA -->
    <div class="amprex-testimonial-card featured-card">
      <div>
        <div class="amprex-card-author">
          <div class="amprex-avatar-wrap">
            <img class="amprex-avatar" src="${basePath}assets/testimonials/naseem.png" alt="Naseem Saher MBA" loading="lazy" />
            <div class="amprex-linkedin-badge" title="LinkedIn Recommendation">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </div>
          </div>
          <div class="amprex-author-info">
            <div class="amprex-author-name-row">
              <h3 class="amprex-author-name">Naseem Saher MBA</h3>
              <span class="amprex-verified-icon" title="Verified Member">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </span>
            </div>
            <p class="amprex-author-role">Founder & Managing Director at Alpamayo Technical Services L.L.C, Dubai, UAE</p>
            <span class="amprex-context-pill">September 6, 2025 • Client</span>
          </div>
        </div>

        <div class="amprex-stars">★★★★★</div>
        <p class="amprex-quote-text">“We hired Aseer Khan to manage our social media presence at Alpamayo Technical Services, and the results have been outstanding. From day one, he took full ownership of our digital marketing, creating content, running ad campaigns, and managing our platforms with professionalism and creativity.

He successfully grew our social presence from zero to a strong, engaging brand, and his ad strategies even brought us real leads and new clients. What impressed us most was his consistency, innovative ideas, and ability to understand our business goals and deliver on them.

If you’re looking for a digital marketer who can transform your online presence and drive results, I highly recommend Aseer khan.”</p>
      </div>

      <div class="amprex-card-footer">
        <span class="amprex-recommendation-source">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          LinkedIn Recommendation
        </span>
      </div>
    </div>

    <!-- Testimonial 4: Junaid Ali -->
    <div class="amprex-testimonial-card">
      <div>
        <div class="amprex-card-author">
          <div class="amprex-avatar-wrap">
            <img class="amprex-avatar" src="${basePath}assets/testimonials/junaid.png" alt="Junaid Ali" loading="lazy" />
            <div class="amprex-linkedin-badge" title="LinkedIn Recommendation">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </div>
          </div>
          <div class="amprex-author-info">
            <div class="amprex-author-name-row">
              <h3 class="amprex-author-name">Junaid Ali</h3>
            </div>
            <p class="amprex-author-role">Full Stack Developer | Laravel, React, Node | MSCS - IBA</p>
            <span class="amprex-context-pill">January 19, 2025 • Team Colleague</span>
          </div>
        </div>

        <div class="amprex-stars">★★★★★</div>
        <p class="amprex-quote-text">“Aseer is amazing! 🎨 Their creativity and attention to detail brought my ideas to life beautifully. Highly recommend their work! 🙌✨”</p>
      </div>

      <div class="amprex-card-footer">
        <span class="amprex-recommendation-source">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          LinkedIn Recommendation
        </span>
      </div>
    </div>
  </div>
</section>
`;
  }

  function mountTestimonials() {
    var path = window.location.pathname;
    var isHome = path === "/" || path === "/index.html" || path === "";
    var isAbout = path.indexOf("/about") !== -1 || document.querySelector("section[data-framer-name='Client']") !== null;

    if (!isHome && !isAbout) {
      // Don't mount testimonials on contact, blog, case studies, or legal pages
      return;
    }

    var basePath = isAbout ? "../" : "./";
    var existing = document.getElementById("amprex-testimonials");

    if (isAbout) {
      var clientSection = document.querySelector("section[data-framer-name='Client']");
      if (clientSection) {
        if (!clientSection.querySelector(".amprex-testimonials-grid")) {
          clientSection.innerHTML = getTemplate(basePath);
        }
        return;
      }
    }

    // Home page
    if (isHome && !existing) {
      var temp = document.createElement("div");
      temp.innerHTML = getTemplate(basePath);
      var newSec = temp.firstElementChild;

      var pricingSec = document.querySelector("section[data-framer-name='Pricing']");
      if (pricingSec && pricingSec.parentNode) {
        pricingSec.parentNode.insertBefore(newSec, pricingSec);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountTestimonials);
  } else {
    mountTestimonials();
  }

  // Observer to re-mount if React hydration or SPA route changes clear it
  var observer = new MutationObserver(function() {
    var path = window.location.pathname;
    var isHome = path === "/" || path === "/index.html" || path === "";
    var isAbout = path.indexOf("/about") !== -1 || document.querySelector("section[data-framer-name='Client']") !== null;

    if (isAbout) {
      var cs = document.querySelector("section[data-framer-name='Client']");
      if (cs && !cs.querySelector(".amprex-testimonials-grid")) {
        mountTestimonials();
      }
    } else if (isHome) {
      if (!document.getElementById("amprex-testimonials")) {
        mountTestimonials();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
