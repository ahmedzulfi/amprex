(function() {
  var instagramUrl = "https://www.instagram.com/amprexhq?stkn=YXZ0NHg2NmU2Y3Rn";

  function getBase() {
    return "/";
  }

  function createInstagramElement(isPhone) {
    var base = getBase();
    var radius = isPhone ? "6px" : "10px";
    var iconSize = isPhone ? "12" : "14";
    var variantClass = isPhone ? "framer-v-s68ij9" : "framer-v-5iz0ml";
    var framerName = isPhone ? "Phone" : "Desktop";

    var container = document.createElement("div");
    container.className = "framer-instagram-container";
    container.style.cssText = "flex:none;width:auto;height:auto;position:relative;";

    container.innerHTML = `
      <a aria-label="Instagram" class="framer-F5PVN framer-5iz0ml ${variantClass} framer-40mk62 framer-instagram-btn" data-border="true" data-framer-name="${framerName}" href="${instagramUrl}" target="_blank" rel="noopener noreferrer" style="--border-bottom-width:1px;--border-color:var(--token-ec927806-e487-479f-a6c9-295366bd19ec, rgb(243, 255, 201));--border-left-width:1px;--border-right-width:1px;--border-style:solid;--border-top-width:1px;background-color:rgba(0, 0, 0, 0);border-bottom-left-radius:${radius};border-bottom-right-radius:${radius};border-top-left-radius:${radius};border-top-right-radius:${radius};transition:background-color 0.2s ease, transform 0.2s ease;">
        <div class="framer-e4hfid" style="width:${iconSize}px;height:${iconSize}px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;border-radius:inherit;corner-shape:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true">
            <img decoding="async" loading="lazy" width="${iconSize}" height="${iconSize}" src="${base}assets/framerusercontent.com/images/instagram.svg" alt="Instagram" style="display:block;width:100%;height:100%;border-radius:inherit;corner-shape:inherit;object-position:center;object-fit:contain">
          </div>
        </div>
      </a>
    `;
    return container;
  }

  function mountInstagram() {
    // Find all social containers (by class framer-2xv087 or by links inside)
    var containers = document.querySelectorAll(".framer-2xv087");
    if (!containers || containers.length === 0) {
      // Fallback: search parents of facebook or linkedin links
      var fbLinks = document.querySelectorAll('a[href*="facebook.com/share/1HU3T3R5gL"]');
      var list = [];
      fbLinks.forEach(function(l) {
        if (l.parentElement && l.parentElement.parentElement) {
          list.push(l.parentElement.parentElement);
        }
      });
      containers = list;
    }

    containers.forEach(function(c) {
      if (!c.querySelector('a[href*="instagram.com/amprexhq"]')) {
        var isPhone = c.closest(".hidden-1wg2atl") !== null || (c.querySelector(".framer-v-s68ij9") !== null);
        var igEl = createInstagramElement(isPhone);
        c.appendChild(igEl);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountInstagram);
  } else {
    mountInstagram();
  }

  // MutationObserver for React re-renders / hydration
  var observer = new MutationObserver(function() {
    mountInstagram();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
