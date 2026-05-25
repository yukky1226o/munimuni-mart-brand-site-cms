const loader = document.querySelector(".loader");
const hideLoader = () => window.setTimeout(() => loader?.classList.add("is-hidden"), 180);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
} else {
  hideLoader();
}
window.setTimeout(() => loader?.classList.add("is-hidden"), 1200);

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const heroForHeader = document.querySelector(".hero-layered, .hero-poster, .hero-scene");

const updateHeaderState = () => {
  if (!siteHeader) return;
  if (!heroForHeader) {
    siteHeader.classList.add("is-solid");
    return;
  }

  const headerHeight = siteHeader.offsetHeight || 76;
  const threshold = heroForHeader.offsetTop + heroForHeader.offsetHeight - headerHeight;
  siteHeader.classList.toggle("is-solid", window.scrollY >= threshold);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", updateHeaderState);

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.querySelectorAll(".reveal").forEach((node) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.16 }
  );
  observer.observe(node);
});

const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll("[data-category]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    productCards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
    });
  });
});

const productSeriesGrid = document.querySelector("[data-product-series-grid]");
const galleryItems = Array.isArray(window.munimuniProductSeries) ? window.munimuniProductSeries : [];
const catalogModal = document.querySelector("[data-catalog-modal]");
const catalogModalTitle = document.querySelector("[data-catalog-modal-title]");
const catalogModalBody = document.querySelector("[data-catalog-modal-body]");
const catalogCloseButtons = document.querySelectorAll("[data-catalog-close]");
const getSeriesThumbSrc = (src) => src.replace("/series/", "/series/thumbs/").replace(".webp", ".jpg");

const openCatalogModal = (categoryId) => {
  if (!catalogModal || !catalogModalTitle || !catalogModalBody) return;
  const series = galleryItems.find((item) => item.id === categoryId);
  if (!series) return;

  productSeriesGrid?.querySelectorAll("[data-series-card]").forEach((tab) => {
    const isActive = tab.dataset.seriesTab === categoryId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  catalogModalTitle.textContent = `${series.label}シリーズ`;
  catalogModalBody.innerHTML = series.hasCatalog
    ? `<img src="${series.catalogImage}" alt="${series.label}シリーズのカタログ画像" loading="eager" decoding="async">`
    : `<div class="catalog-coming-soon"><span>Coming soon</span><p>このシリーズのカタログは準備中です。</p></div>`;
  catalogModal.hidden = false;
  document.body.classList.add("modal-open");
};

const closeCatalogModal = () => {
  if (!catalogModal) return;
  catalogModal.hidden = true;
  document.body.classList.remove("modal-open");
};

if (productSeriesGrid && galleryItems.length) {
  productSeriesGrid.innerHTML = galleryItems
    .map(
      (series, index) => {
        const isPriority = index < 6;
        return `
        <button class="product-series-card" data-series-card data-series-tab="${series.id}" type="button" aria-pressed="false">
          <span class="product-series-thumb"><img src="${getSeriesThumbSrc(series.seriesImage)}" alt="${series.label}シリーズ" width="480" height="480" loading="${isPriority ? "eager" : "lazy"}" decoding="async" fetchpriority="${isPriority ? "high" : "auto"}"></span>
          <span class="product-series-name">${series.label}</span>
          <span class="product-series-action">${series.hasCatalog ? "カタログを見る" : "Coming soon"}</span>
        </button>
      `;
      }
    )
    .join("");

  productSeriesGrid.querySelectorAll("[data-series-card]").forEach((tab) => {
    tab.addEventListener("click", () => {
      openCatalogModal(tab.dataset.seriesTab);
    });
  });
}

catalogCloseButtons.forEach((button) => button.addEventListener("click", closeCatalogModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCatalogModal();
});

document.querySelectorAll(".accordion button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion");
    const panel = item.querySelector(".accordion-panel");
    const open = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
    panel.style.maxHeight = open ? `${panel.scrollHeight}px` : "0";
  });
});

const faqSearch = document.querySelector("[data-faq-search]");
faqSearch?.addEventListener("input", () => {
  const term = faqSearch.value.trim().toLowerCase();
  document.querySelectorAll(".accordion").forEach((item) => {
    item.hidden = term && !item.textContent.toLowerCase().includes(term);
  });
});

const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("[required]")];
  let valid = true;

  fields.forEach((field) => {
    const error = contactForm.querySelector(`[data-error-for="${field.id}"]`);
    let message = "";
    if (!field.value.trim()) {
      message = "入力してください。";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      message = "メールアドレスの形式を確認してください。";
    }
    if (error) error.textContent = message;
    if (message) valid = false;
  });

  const success = contactForm.querySelector(".form-success");
  if (!valid || !success) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton?.setAttribute("disabled", "true");

  try {
    if (window.location.protocol !== "file:") {
      const formData = new FormData(contactForm);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });
      if (!response.ok) throw new Error("Form submission failed");
    }

    success.style.display = "block";
    contactForm.reset();
  } catch (error) {
    success.style.display = "block";
    success.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});

const newsList = document.querySelector("[data-news-list]");
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

const renderNewsItems = (items) => {
  if (!newsList || !Array.isArray(items)) return;
  newsList.innerHTML = items
    .map(
      (item) => `
        <article class="news-muni-item">
          <span class="news-muni-label ${escapeHtml(item.categoryTone)}">${escapeHtml(item.category)}</span>
          <time>${escapeHtml(item.date)}</time>
          <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
          <span class="news-muni-arrow" aria-hidden="true">›</span>
        </article>
      `
    )
    .join("");
};

const loadNewsItems = async () => {
  if (!newsList) return;
  try {
    const response = await fetch("assets/news-data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("News data not found");
    const data = await response.json();
    renderNewsItems(data.news);
  } catch (error) {
    renderNewsItems(window.munimuniNews);
  }
};

loadNewsItems();
