import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Gift,
  Heart,
  Instagram,
  Menu,
  Minus,
  Package,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  WandSparkles,
  X,
  ZoomIn,
} from "lucide-react";
import "./styles.css";

const productModules = import.meta.glob(
  [
    "./assets/products/**/*.png",
    "./assets/products/**/*.jpg",
    "./assets/products/**/*.jpeg",
    "./assets/products/**/*.webp",
  ],
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const CATEGORY_ALL = "ทั้งหมด";
const CATEGORY_FULL = "กล่องใหญ่";
const CATEGORY_SINGLE = "ขนตาเดี่ยว";
const CATEGORY_REAL = "คนใส่จริง";
const CATEGORY_HOW = "แบบใส่ก้าน";

const categoryOrder = [
  CATEGORY_ALL,
  "MINI Size",
  "New MINI Size",
  "Travelsize",
  CATEGORY_FULL,
  CATEGORY_SINGLE,
  CATEGORY_REAL,
  CATEGORY_HOW,
];

const categoryLabels = {
  [CATEGORY_ALL]: "ทั้งหมด",
  "MINI Size": "MINI SIZE",
  "New MINI Size": "NEW MINI",
  Travelsize: "TRAVEL SIZE",
  [CATEGORY_FULL]: "FULL SIZE",
  [CATEGORY_SINGLE]: "LASH STYLES",
  [CATEGORY_REAL]: "REAL LOOKS",
  [CATEGORY_HOW]: "HOW TO",
};

const categoryPrices = {
  "MINI Size": 189,
  "New MINI Size": 229,
  Travelsize: 259,
  [CATEGORY_FULL]: 349,
  [CATEGORY_SINGLE]: 199,
  [CATEGORY_REAL]: 229,
  [CATEGORY_HOW]: 159,
};

const seriesColors = {
  sakura: "#ffb5c8",
  thaipop: "#e8c0f5",
  blooming: "#c5e8c0",
  "office lady": "#f5deb3",
  officelady: "#f5deb3",
  moonlight: "#b8d8f0",
  moonlight01: "#b8d8f0",
  california: "#c0c8d8",
  californiagirl: "#c0c8d8",
  hollywood: "#ff8faa",
  hoollwood: "#ff8faa",
  "bangkok babe": "#d4b0f8",
  bankkokbabe: "#d4b0f8",
  flora: "#f7bdd5",
  dahlia: "#ffd1ad",
  orchid: "#ddc7f6",
};

const seriesDetails = {
  sakura: ["Sweet Natural", "13 mm"],
  thaipop: ["Dreamy Soft", "11 mm"],
  blooming: ["Fresh Garden", "12 mm"],
  "office lady": ["Nude Minimal", "12 mm"],
  officelady: ["Nude Minimal", "12 mm"],
  moonlight: ["Cool Blue", "13 mm"],
  moonlight01: ["Cool Blue", "13 mm"],
  california: ["Cool Grey", "12 mm"],
  californiagirl: ["Cool Grey", "12 mm"],
  hollywood: ["Fierce Glam", "13 mm"],
  hoollwood: ["Fierce Glam", "13 mm"],
  "bangkok babe": ["Bold Night", "12 mm"],
  bankkokbabe: ["Bold Night", "12 mm"],
};

const prettify = (value) =>
  value
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/^tv\s*(\d+)$/i, "Travel Lash $1")
    .replace(/\s+/g, " ")
    .trim();

const getImagePresentation = (path, category, file) => {
  const isNewMiniEye =
    category === "New MINI Size" &&
    !/\d{1,2}\.(?:png|jpe?g|webp)$/i.test(file);
  const isEye = category === CATEGORY_REAL || isNewMiniEye;
  const flip =
    (isNewMiniEye &&
      /(?:^|\/)(?:dahlia|sakura แบบสั้น)\.(?:png|jpe?g|webp)$/i.test(path)) ||
    /(?:^|\/)orchid02\.(?:png|jpe?g|webp)$/i.test(path);
  return { kind: isEye ? "eye" : "product", flip };
};

const rawProducts = Object.entries(productModules).map(
  ([path, image], index) => {
    const parts = path.split("/");
    const category = parts.at(-2);
    const file = parts.at(-1);
    const name = prettify(file) || `2minBooBoo Lash ${index + 1}`;
    return {
      id: `${category}-${file}-${index}`,
      category,
      image,
      images: [image],
      media: [{ src: image, ...getImagePresentation(path, category, file) }],
      name,
      price: categoryPrices[category] ?? 229,
      isNew: category === "New MINI Size" || index % 13 === 0,
    };
  },
);

const groupableCategories = new Set(["New MINI Size", CATEGORY_FULL]);
const productGroups = new Map();
const products = [];

rawProducts.forEach((product) => {
  if (!groupableCategories.has(product.category)) {
    products.push(product);
    return;
  }
  const groupName = product.name.replace(/\s*\d{1,2}$/i, "").trim();
  const key = `${product.category}-${groupName.toLocaleLowerCase()}`;
  const existing = productGroups.get(key);
  if (existing) {
    existing.images.push(product.image);
    existing.media.push(...product.media);
    return;
  }
  const groupedProduct = {
    ...product,
    id: `grouped-${key}`,
    name: groupName,
    images: [product.image],
    media: [...product.media],
  };
  productGroups.set(key, groupedProduct);
  products.push(groupedProduct);
});

const findSeriesKey = (name) => {
  const normalized = name.toLocaleLowerCase().trim();
  return Object.keys(seriesColors).find((key) => normalized.includes(key));
};

const getSeriesColor = (name) =>
  seriesColors[findSeriesKey(name)] ?? "#fff3e8";

const getSeriesDetail = (name) =>
  seriesDetails[findSeriesKey(name)] ?? ["Everyday Lash", "Easy fit"];

const lifestyleImages = products.filter(
  (product) => product.category === CATEGORY_REAL,
);
const miniProducts = products.filter(
  (product) => product.category === "MINI Size",
);
const newMiniProducts = products.filter(
  (product) => product.category === "New MINI Size",
);
const fullSizeProducts = products.filter(
  (product) => product.category === CATEGORY_FULL,
);

const heroSlides = [
  {
    eyebrow: "NO GLUE • NO MESS • 2 MINUTES",
    title: "ขนตาสวย\nในแบบของคุณ",
    body: "ขนตาปลอมมีกาวในตัว ติดง่าย เบาสบาย และออกแบบมาเพื่อดวงตาคนเอเชีย",
    cta: "SHOP BEST SELLERS",
    image:
      lifestyleImages.find((product) => /california/i.test(product.name))
        ?.image ?? lifestyleImages[0]?.image,
    products: [
      newMiniProducts[0],
      miniProducts[0],
      fullSizeProducts[0],
      newMiniProducts[1],
    ].filter(Boolean),
    tone: "peach",
  },
  {
    eyebrow: "NEW MINI SERIES",
    title: "ลุคใหม่\nพร้อมติดทันที",
    body: "ช่อขนตาน้ำหนักเบา เรียงง่าย ติดแน่น พร้อมออกจากบ้านภายใน 2 นาที",
    cta: "DISCOVER NEW MINI",
    image:
      lifestyleImages.find((product) => /hollywood/i.test(product.name))
        ?.image ?? lifestyleImages[1]?.image,
    products: [
      newMiniProducts[1],
      newMiniProducts[2],
      miniProducts[1],
      fullSizeProducts[1],
    ].filter(Boolean),
    tone: "sunset",
  },
];

const exploreCategories = [
  { label: "NEW MINI", value: "New MINI Size" },
  { label: "MINI SIZE", value: "MINI Size" },
  { label: "TRAVEL SIZE", value: "Travelsize" },
  { label: "FULL SIZE", value: CATEGORY_FULL },
  { label: "BEST SELLERS", value: "BEST SELLERS" },
];

const marqueeMessages = [
  "ขนตาสวยใน 2 นาที",
  "NO GLUE MESS",
  "LIGHT AS AIR",
  "2MINBOOBOO",
];

const categoryTiles = [
  {
    label: "MINI SIZE",
    note: "ขายดี ติดง่าย",
    category: "MINI Size",
    icon: Sparkles,
  },
  {
    label: "NEW MINI",
    note: "ทรงใหม่ล่าสุด",
    category: "New MINI Size",
    icon: WandSparkles,
  },
  {
    label: "TRAVEL SIZE",
    note: "พกไปได้ทุกที่",
    category: "Travelsize",
    icon: Package,
  },
  {
    label: "FULL SIZE",
    note: "คุ้ม ใช้ได้นาน",
    category: CATEGORY_FULL,
    icon: Gift,
  },
  {
    label: "REAL LOOKS",
    note: "ดูบนดวงตาจริง",
    category: CATEGORY_REAL,
    icon: Eye,
  },
];

function Logo({ light = false }) {
  return (
    <a
      className={`logo ${light ? "logo-light" : ""}`}
      href="#top"
      aria-label="2minBooBoo home"
    >
      <small>2MIN</small>
      <span>BooBoo</span>
    </a>
  );
}

function Stars({ count = 5 }) {
  return (
    <span className="stars" aria-label={`${count} ดาว`}>
      {Array.from({ length: count }, (_, index) => (
        <Star key={index} size={12} fill="currentColor" />
      ))}
    </span>
  );
}

function ProductZoom({ product, media, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("overlay-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("overlay-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="zoom-overlay" role="presentation" onClick={onClose}>
      <div
        className="zoom-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`ภาพขยาย ${product.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="round-close" onClick={onClose} aria-label="ปิดภาพขยาย">
          <X />
        </button>
        <div
          className="zoom-media"
          style={{ "--series-color": getSeriesColor(product.name) }}
        >
          <img
            className={media.flip ? "is-flipped" : ""}
            src={media.src}
            alt={`${product.name} ภาพขยาย`}
          />
        </div>
        <div className="zoom-copy">
          <span className="zoom-eyebrow">PRODUCT PREVIEW</span>
          <p>{categoryLabels[product.category] ?? product.category}</p>
          <h2>{product.name}</h2>
          <strong>฿{product.price.toLocaleString("th-TH")}</strong>
          <div className="zoom-divider" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProductCard({ product, onAdd, compact = false }) {
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const media = product.media?.length
    ? product.media
    : [{ src: product.image, kind: "product", flip: false }];
  const activeMedia = media[imageIndex];
  const hasMultipleImages = media.length > 1;
  const [mood, length] = getSeriesDetail(product.name);

  useEffect(() => {
    if (!hasMultipleImages || zoomOpen) return undefined;
    const timer = window.setTimeout(
      () => setImageIndex((index) => (index + 1) % media.length),
      6000,
    );
    return () => window.clearTimeout(timer);
  }, [hasMultipleImages, imageIndex, media.length, zoomOpen]);

  const previous = () =>
    setImageIndex((index) => (index === 0 ? media.length - 1 : index - 1));
  const next = () =>
    setImageIndex((index) => (index + 1) % media.length);

  return (
    <article
      className={`product-card ${compact ? "product-card-compact" : ""}`}
      style={{ "--series-color": getSeriesColor(product.name) }}
    >
      <div className="product-media">
        {product.isNew ? <span className="product-badge">NEW</span> : null}
        <button
          className={`heart-button ${liked ? "is-liked" : ""}`}
          onClick={() => setLiked((value) => !value)}
          aria-label={`${liked ? "เลิกบันทึก" : "บันทึก"} ${product.name}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          className="product-image-button"
          onClick={() => setZoomOpen(true)}
          aria-label={`ซูมภาพ ${product.name}`}
        >
          <img
            key={activeMedia.src}
            className={`${activeMedia.kind === "eye" ? "image-eye" : ""} ${
              activeMedia.flip ? "is-flipped" : ""
            }`}
            src={activeMedia.src}
            alt={`${product.name} ภาพที่ ${imageIndex + 1}`}
            loading="lazy"
          />
          <span className="zoom-hint" aria-hidden="true">
            <ZoomIn size={16} />
          </span>
        </button>
        {hasMultipleImages ? (
          <>
            <button
              className="media-arrow media-arrow-left"
              onClick={previous}
              aria-label={`ภาพก่อนหน้าของ ${product.name}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="media-arrow media-arrow-right"
              onClick={next}
              aria-label={`ภาพถัดไปของ ${product.name}`}
            >
              <ChevronRight size={18} />
            </button>
            <span className="media-count">
              {imageIndex + 1}/{media.length}
            </span>
          </>
        ) : null}
      </div>
      <div className="product-copy">
        <p className="product-category">
          {categoryLabels[product.category] ?? product.category}
        </p>
        <h3>{product.name}</h3>
        <div className="product-detail">
          <span>{mood}</span>
          <span>{length}</span>
        </div>
        <div className="rating-row">
          <Stars />
          <span>({18 + (product.name.length % 62)})</span>
        </div>
        <div className="product-action">
          <strong>฿{product.price.toLocaleString("th-TH")}</strong>
          <button onClick={() => onAdd(product)}>เพิ่มลงถุง</button>
        </div>
      </div>
      {zoomOpen ? (
        <ProductZoom
          product={product}
          media={activeMedia}
          onClose={() => setZoomOpen(false)}
        />
      ) : null}
    </article>
  );
}

function ProductRail({ title, eyebrow, items, onAdd, action }) {
  const railRef = useRef(null);
  const scroll = (direction) => {
    railRef.current?.scrollBy({
      left: direction * railRef.current.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  return (
    <section className="product-section">
      <div className="section-title-row">
        <div>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="rail-actions">
          {action}
          <button onClick={() => scroll(-1)} aria-label="เลื่อนสินค้าก่อนหน้า">
            <ChevronLeft />
          </button>
          <button onClick={() => scroll(1)} aria-label="เลื่อนสินค้าถัดไป">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="product-rail" ref={railRef}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} compact />
        ))}
      </div>
    </section>
  );
}

function CartDrawer({
  items,
  recommendations,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onAdd,
}) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const freeShippingTarget = 599;
  const remaining = Math.max(0, freeShippingTarget - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingTarget) * 100);

  useEffect(() => {
    document.body.classList.add("overlay-open");
    return () => document.body.classList.remove("overlay-open");
  }, []);

  return createPortal(
    <div className="drawer-overlay" role="presentation" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="ตะกร้าสินค้า"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span>YOUR BAG</span>
            <h2>ตะกร้าของคุณ</h2>
          </div>
          <button onClick={onClose} aria-label="ปิดตะกร้า">
            <X />
          </button>
        </div>
        <div className="shipping-meter">
          <p>
            {remaining > 0
              ? `ช้อปอีก ฿${remaining.toLocaleString("th-TH")} เพื่อรับส่งฟรี`
              : "คุณได้รับสิทธิ์ส่งฟรีแล้ว!"}
          </p>
          <div>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={42} strokeWidth={1.2} />
            <h3>ถุงยังว่างอยู่</h3>
            <p>เลือกทรงที่ใช่ แล้วพร้อมสวยใน 2 นาที</p>
            <button onClick={onClose}>ช้อปสินค้าทั้งหมด</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div
                    className="cart-thumb"
                    style={{ "--series-color": getSeriesColor(item.name) }}
                  >
                    <img
                      className={item.media?.[0]?.flip ? "is-flipped" : ""}
                      src={item.media?.[0]?.src ?? item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="cart-item-copy">
                    <p>{categoryLabels[item.category] ?? item.category}</p>
                    <h3>{item.name}</h3>
                    <strong>฿{item.price.toLocaleString("th-TH")}</strong>
                    <div className="quantity-control">
                      <button
                        onClick={() => onDecrease(item.id)}
                        aria-label={`ลดจำนวน ${item.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onIncrease(item.id)}
                        aria-label={`เพิ่มจำนวน ${item.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => onRemove(item.id)}
                    aria-label={`ลบ ${item.name}`}
                  >
                    <X size={16} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-recommendations">
              <h3>คุณอาจจะชอบ</h3>
              {recommendations.slice(0, 2).map((product) => (
                <article key={product.id}>
                  <img src={product.media?.[0]?.src ?? product.image} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <span>฿{product.price.toLocaleString("th-TH")}</span>
                  </div>
                  <button
                    onClick={() => onAdd(product)}
                    aria-label={`เพิ่ม ${product.name}`}
                  >
                    <Plus size={17} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>ยอดรวม</span>
                <strong>฿{subtotal.toLocaleString("th-TH")}</strong>
              </div>
              <p>ภาษีรวมแล้ว ค่าจัดส่งคำนวณในขั้นตอนถัดไป</p>
              <button>ดำเนินการสั่งซื้อ</button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}

function SearchOverlay({ products: allProducts, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const value = query.trim().toLocaleLowerCase();
    if (!value) return allProducts.slice(0, 6);
    return allProducts
      .filter((product) =>
        `${product.name} ${product.category}`
          .toLocaleLowerCase()
          .includes(value),
      )
      .slice(0, 8);
  }, [allProducts, query]);

  useEffect(() => {
    document.body.classList.add("overlay-open");
    return () => document.body.classList.remove("overlay-open");
  }, []);

  return createPortal(
    <div className="search-overlay" role="dialog" aria-modal="true">
      <div className="search-top">
        <Logo />
        <button onClick={onClose} aria-label="ปิดการค้นหา">
          <X />
        </button>
      </div>
      <div className="search-box">
        <Search />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหา Sakura, Bangkok Babe..."
          aria-label="ค้นหาสินค้า"
        />
      </div>
      <p className="search-label">
        {query ? `ผลการค้นหา “${query}”` : "สินค้ายอดนิยม"}
      </p>
      <div className="search-results">
        {results.map((product) => (
          <article key={product.id}>
            <img src={product.media?.[0]?.src ?? product.image} alt="" />
            <div>
              <p>{categoryLabels[product.category] ?? product.category}</p>
              <h3>{product.name}</h3>
              <span>฿{product.price.toLocaleString("th-TH")}</span>
            </div>
            <button onClick={() => onAdd(product)}>เพิ่มลงถุง</button>
          </article>
        ))}
      </div>
    </div>,
    document.body,
  );
}

function App() {
  const [category, setCategory] = useState(CATEGORY_ALL);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredCategory, setFeaturedCategory] = useState("New MINI Size");
  const catalogRailRef = useRef(null);
  const catalogDragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });
  const catalogScrollAnimationRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setHeroIndex((index) => (index + 1) % heroSlides.length),
      10000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(
    () =>
      category === CATEGORY_ALL
        ? products.filter(
            (product) =>
              product.category !== CATEGORY_REAL &&
              product.category !== CATEGORY_HOW,
          )
        : products.filter((product) => product.category === category),
    [category],
  );

  useEffect(() => {
    catalogRailRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [category]);

  useEffect(
    () => () => {
      if (catalogScrollAnimationRef.current) {
        window.cancelAnimationFrame(catalogScrollAnimationRef.current);
      }
    },
    [],
  );

  const bestSellers = useMemo(() => {
    const names = [
      "Blooming",
      "Sakura",
      "Bangkok",
      "California",
      "Moonlight",
      "Hollywood",
    ];
    return names
      .map((name) =>
        products.find(
          (product) =>
            product.category !== CATEGORY_REAL &&
            product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
        ),
      )
      .filter(Boolean);
  }, []);

  const featuredProducts = useMemo(
    () =>
      featuredCategory === "BEST SELLERS"
        ? bestSellers
        : products.filter(
            (product) => product.category === featuredCategory,
          ),
    [bestSellers, featuredCategory],
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCartOpen(true);
  };

  const increaseItem = (id) =>
    setCart((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

  const decreaseItem = (id) =>
    setCart((items) =>
      items.flatMap((item) => {
        if (item.id !== id) return [item];
        return item.quantity === 1
          ? []
          : [{ ...item, quantity: item.quantity - 1 }];
      }),
    );

  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setMegaOpen(false);
    document
      .getElementById("all-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollCatalog = (direction) => {
    const rail = catalogRailRef.current;
    if (!rail) return;

    if (catalogScrollAnimationRef.current) {
      window.cancelAnimationFrame(catalogScrollAnimationRef.current);
    }

    const startLeft = rail.scrollLeft;
    const maxLeft = rail.scrollWidth - rail.clientWidth;
    const targetLeft = Math.max(
      0,
      Math.min(maxLeft, startLeft + direction * rail.clientWidth),
    );
    const duration = 850;
    const startTime = window.performance.now();
    const easeInOutCubic = (progress) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    rail.classList.add("is-button-scrolling");

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      rail.scrollLeft =
        startLeft + (targetLeft - startLeft) * easeInOutCubic(progress);

      if (progress < 1) {
        catalogScrollAnimationRef.current =
          window.requestAnimationFrame(animate);
        return;
      }

      rail.scrollLeft = targetLeft;
      rail.classList.remove("is-button-scrolling");
      catalogScrollAnimationRef.current = null;
    };

    catalogScrollAnimationRef.current =
      window.requestAnimationFrame(animate);
  };

  const handleCatalogPointerDown = (event) => {
    const rail = catalogRailRef.current;
    if (!rail || (event.pointerType === "mouse" && event.button !== 0)) return;

    if (catalogScrollAnimationRef.current) {
      window.cancelAnimationFrame(catalogScrollAnimationRef.current);
      catalogScrollAnimationRef.current = null;
      rail.classList.remove("is-button-scrolling");
    }

    catalogDragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      hasDragged: false,
    };
    rail.classList.add("is-dragging");
  };

  const handleCatalogPointerMove = (event) => {
    const rail = catalogRailRef.current;
    const drag = catalogDragRef.current;
    if (!rail || !drag.isDragging || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) {
      drag.hasDragged = true;
      event.preventDefault();
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
    }
    rail.scrollLeft = drag.scrollLeft - distance;
  };

  const stopCatalogDrag = (event) => {
    const rail = catalogRailRef.current;
    const drag = catalogDragRef.current;
    if (!drag.isDragging || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.isDragging = false;
    drag.pointerId = null;
    rail?.classList.remove("is-dragging");

    window.setTimeout(() => {
      catalogDragRef.current.hasDragged = false;
    }, 160);
  };

  const handleCatalogClickCapture = (event) => {
    if (!catalogDragRef.current.hasDragged) return;

    event.preventDefault();
    event.stopPropagation();
    catalogDragRef.current.hasDragged = false;
  };

  const selectFeatured = (nextCategory) => {
    setFeaturedCategory(nextCategory);
    setMegaOpen(false);
    document
      .getElementById("best-sellers")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeHero = heroSlides[heroIndex];
  const lookImages = lifestyleImages.slice(0, 4);
  const socialImages = [
    ...lifestyleImages,
    ...newMiniProducts.flatMap((product) => product.media.slice(0, 1)),
  ].slice(0, 8);

  return (
    <div id="top">
      <div className="announcement-bar" aria-label="โปรโมชั่น">
        <div className="announcement-track">
          {[0, 1, 2, 3].map((copy) => (
            <div className="announcement-group" key={copy} aria-hidden={copy > 0}>
              <span>ส่งฟรีทุกออเดอร์ ไม่มีขั้นต่ำ</span>
              <i>★</i>
              <span>2 กล่อง ลดเพิ่ม 10%</span>
              <i>★</i>
              <span>NEW MINI SERIES มาใหม่!</span>
              <i>★</i>
              <span>ขนตาสวยใน 2 นาที</span>
              <i>★</i>
            </div>
          ))}
        </div>
      </div>

      <header className="site-header">
        <button
          className="mobile-control"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="เปิดเมนู"
        >
          <Menu />
        </button>
        <nav className="main-nav main-nav-left" aria-label="เมนูหลัก">
          <button
            className={megaOpen ? "is-active" : ""}
            onClick={() => setMegaOpen((value) => !value)}
          >
            SHOP <ChevronDown size={14} />
          </button>
          <button onClick={() => selectFeatured("New MINI Size")}>NEW MINI</button>
          <button onClick={() => selectFeatured("MINI Size")}>MINI SIZE</button>
          <button onClick={() => selectFeatured("Travelsize")}>TRAVEL SIZE</button>
          <button onClick={() => selectFeatured(CATEGORY_FULL)}>FULL SIZE</button>
        </nav>
        <Logo />
        <nav className="main-nav main-nav-right">
          <a href="#how-to">HOW TO</a>
          <a href="#real-looks">REAL LOOKS</a>
          <button onClick={() => setSearchOpen(true)} aria-label="ค้นหา">
            <Search />
          </button>
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`ตะกร้าสินค้า ${cartCount} ชิ้น`}
          >
            <ShoppingBag />
            <span>{cartCount}</span>
          </button>
        </nav>
        <button
          className="mobile-control mobile-bag"
          onClick={() => setCartOpen(true)}
          aria-label={`ตะกร้าสินค้า ${cartCount} ชิ้น`}
        >
          <ShoppingBag />
          <span>{cartCount}</span>
        </button>
        {megaOpen ? (
          <div className="mega-menu">
            <div>
              <span>SHOP BY FORMAT</span>
              {categoryOrder.slice(1, 5).map((item) => (
                <button key={item} onClick={() => selectCategory(item)}>
                  {categoryLabels[item]}
                </button>
              ))}
            </div>
            <div>
              <span>SHOP BY STYLE</span>
              {["Sakura", "Blooming", "Moonlight", "Bangkok Babe"].map(
                (name) => (
                  <a key={name} href="#all-products">
                    {name}
                  </a>
                ),
              )}
            </div>
            <button
              className="mega-feature"
              onClick={() => selectCategory("New MINI Size")}
            >
              <img
                src={newMiniProducts[0]?.media?.[1]?.src ?? newMiniProducts[0]?.image}
                alt=""
              />
              <span>
                NEW MINI SERIES
                <small>ดูคอลเลกชันใหม่</small>
              </span>
            </button>
          </div>
        ) : null}
      </header>

      {mobileMenuOpen ? (
        <div className="mobile-menu">
          <div>
            <Logo light />
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="ปิดเมนู"
            >
              <X />
            </button>
          </div>
          {categoryOrder
            .filter(
              (item) => item !== CATEGORY_REAL && item !== CATEGORY_HOW,
            )
            .map((item) => (
            <button
              key={item}
              onClick={() => {
                selectCategory(item);
                setMobileMenuOpen(false);
              }}
            >
              {categoryLabels[item]}
              <ChevronRight />
            </button>
            ))}
          <a href="#how-to" onClick={() => setMobileMenuOpen(false)}>
            HOW TO
          </a>
          <a href="#real-looks" onClick={() => setMobileMenuOpen(false)}>
            REAL LOOKS
          </a>
        </div>
      ) : null}

      {searchOpen ? (
        <SearchOverlay
          products={products}
          onClose={() => setSearchOpen(false)}
          onAdd={addToCart}
        />
      ) : null}

      {cartOpen ? (
        <CartDrawer
          items={cart}
          recommendations={newMiniProducts}
          onClose={() => setCartOpen(false)}
          onIncrease={increaseItem}
          onDecrease={decreaseItem}
          onRemove={(id) =>
            setCart((items) => items.filter((item) => item.id !== id))
          }
          onAdd={addToCart}
        />
      ) : null}

      <main>
        <section className={`hero hero-${activeHero.tone}`}>
          <img
            className="hero-atmosphere"
            src={activeHero.image}
            alt=""
            aria-hidden="true"
          />
          <div className="hero-copy">
            <p>{activeHero.eyebrow}</p>
            <h1>
              {activeHero.title.split("\n").map((line) => (
                <React.Fragment key={line}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h1>
            <span>{activeHero.body}</span>
            <a href="#best-sellers">
              {activeHero.cta} <ArrowRight />
            </a>
            <div className="hero-dots" aria-label="เลือกแบนเนอร์">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={heroIndex === index ? "is-active" : ""}
                  onClick={() => setHeroIndex(index)}
                  aria-label={`แบนเนอร์ ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="hero-products" aria-label="สินค้าแนะนำ">
            {activeHero.products.map((product, index) => (
              <img
                key={`${activeHero.title}-${product.id}`}
                className={`hero-product hero-product-${index + 1}`}
                src={
                  product.media?.find((item) => item.kind === "product")?.src ??
                  product.image
                }
                alt={product.name}
              />
            ))}
          </div>
          <button
            className="hero-arrow hero-arrow-left"
            onClick={() =>
              setHeroIndex((index) =>
                index === 0 ? heroSlides.length - 1 : index - 1,
              )
            }
            aria-label="แบนเนอร์ก่อนหน้า"
          >
            <ChevronLeft />
          </button>
          <button
            className="hero-arrow hero-arrow-right"
            onClick={() =>
              setHeroIndex((index) => (index + 1) % heroSlides.length)
            }
            aria-label="แบนเนอร์ถัดไป"
          >
            <ChevronRight />
          </button>
        </section>

        <section className="trust-strip" aria-label="จุดเด่นสินค้า">
          <div>
            <Clock3 />
            <span>
              <strong>2 MINUTES</strong>
              ติดง่าย พร้อมออกจากบ้าน
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>NO GLUE MESS</strong>
              มีกาวในตัว ใช้ง่าย
            </span>
          </div>
          <div>
            <RefreshCw />
            <span>
              <strong>REUSABLE</strong>
              เบาสบาย ใช้ได้หลายครั้ง
            </span>
          </div>
        </section>

        <section className="lash-explorer" id="best-sellers">
          <div className="section-centered-title">
            <p>THE FULL COLLECTION</p>
            <h2>Explore Our Lashes</h2>
          </div>
          <div className="explorer-tabs" role="tablist">
            {exploreCategories.map((item) => (
              <button
                key={item.value}
                className={featuredCategory === item.value ? "is-active" : ""}
                onClick={() => setFeaturedCategory(item.value)}
                role="tab"
                aria-selected={featuredCategory === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="explorer-rail">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                compact
              />
            ))}
          </div>
        </section>

        <section className="brand-marquee" aria-label="จุดเด่นของ 2minBooBoo">
          <div className="brand-marquee-track">
            {[0, 1, 2, 3].map((copy) => (
              <div className="brand-marquee-group" key={copy} aria-hidden={copy > 0}>
                {marqueeMessages.map((message) => (
                  <React.Fragment key={`${copy}-${message}`}>
                    <span>{message}</span>
                    <i>•</i>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="campaign-split">
          <div className="campaign-media">
            <img
              src={
                lifestyleImages.find((product) =>
                  /bangkok/i.test(product.name),
                )?.image ?? lifestyleImages[0]?.image
              }
              alt="Bangkok Babe real look"
              loading="lazy"
            />
          </div>
          <div className="campaign-copy">
            <p>MADE FOR REAL LIFE</p>
            <h2>ขนตาที่ทำให้ทุกวัน<br />รู้สึกพิเศษขึ้น</h2>
            <span>
              บางเบา เป็นธรรมชาติ และใช้งานได้จริง ทุกทรงผ่านการออกแบบ
              เพื่อให้เข้ากับรูปตาที่หลากหลาย
            </span>
            <a href="#real-looks">
              ดูลุคจริง <ArrowRight />
            </a>
          </div>
        </section>

        <section className="look-selector" id="real-looks">
          <div className="section-centered-title">
            <p>FIND YOUR LASH ENERGY</p>
            <h2>เลือกตามลุคที่คุณชอบ</h2>
          </div>
          <div className="look-grid">
            {lookImages.map((product, index) => (
              <article key={product.id}>
                <img src={product.image} alt={product.name} loading="lazy" />
                <div>
                  <span>0{index + 1}</span>
                  <h3>
                    {["NATURAL", "SOFT GLAM", "BOLD", "NIGHT OUT"][index]}
                  </h3>
                  <button onClick={() => selectCategory(CATEGORY_REAL)}>
                    SHOP THE LOOK <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div id="new-arrivals">
          <ProductRail
            eyebrow="JUST LANDED"
            title="New Mini Series"
            items={newMiniProducts}
            onAdd={addToCart}
            action={
              <button
                className="text-link"
                onClick={() => selectCategory("New MINI Size")}
              >
                ดูทั้งหมด <ArrowRight size={15} />
              </button>
            }
          />
        </div>

        <section className="how-to" id="how-to">
          <div className="how-media">
            <img
              src={newMiniProducts[1]?.media?.[0]?.src ?? newMiniProducts[0]?.image}
              alt="วิธีติดขนตา 2minBooBoo"
              loading="lazy"
            />
            <button aria-label="ดูวิดีโอวิธีใช้">
              <Play fill="currentColor" />
            </button>
          </div>
          <div className="how-copy">
            <p>THE 2-MINUTE ROUTINE</p>
            <h2>ติดง่ายใน 3 ขั้นตอน</h2>
            {[
              ["01", "เลือกทรง", "เลือกความยาวและความฟูให้เข้ากับลุค"],
              ["02", "วางช่อขนตา", "วางใต้แนวขนตาจริงจากหางเข้าหัวตา"],
              ["03", "หนีบให้แนบ", "ใช้แหนบกดเบา ๆ เท่านี้ก็พร้อมสวย"],
            ].map(([number, title, body]) => (
              <article key={number}>
                <strong>{number}</strong>
                <div>
                  <h3>{title}</h3>
                  <span>{body}</span>
                </div>
                <Check />
              </article>
            ))}
            <a href="#all-products">
              เริ่มเลือกทรงของคุณ <ArrowRight />
            </a>
          </div>
        </section>

        <section className="review-band">
          <div>
            <Stars />
            <blockquote>
              “มือใหม่มาก แต่ติดครั้งแรกก็รอด เบา ตาไม่หนัก และดูหวานขึ้นแบบไม่โป๊ะ”
            </blockquote>
            <cite>— May, Bangkok Babe lover</cite>
          </div>
          <div className="review-stats">
            <strong>4.9</strong>
            <span>คะแนนเฉลี่ยจากลูกค้าจริง</span>
            <Stars />
          </div>
        </section>

        <section className="all-products" id="all-products">
          <div className="section-centered-title">
            <p>THE FULL COLLECTION</p>
            <h2>2minBooBoo</h2>
          </div>
          <div className="category-tabs" role="tablist">
            {categoryOrder.map((item) => (
              <button
                key={item}
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
                role="tab"
                aria-selected={category === item}
              >
                {categoryLabels[item]}
              </button>
            ))}
          </div>
          <div className="collection-toolbar">
            <span>
              {category === CATEGORY_ALL
                ? "แสดงสินค้าทั้งหมด"
                : `กำลังดู ${categoryLabels[category]}`}
            </span>
            <div className="collection-actions">
              {category !== CATEGORY_ALL ? (
                <button
                  className="collection-show-all"
                  onClick={() => setCategory(CATEGORY_ALL)}
                >
                  ดูทั้งหมด
                </button>
              ) : null}
              <button
                className="catalog-arrow"
                onClick={() => scrollCatalog(-1)}
                aria-label="เลื่อนสินค้าไปทางซ้าย"
              >
                <ChevronLeft />
              </button>
              <button
                className="catalog-arrow"
                onClick={() => scrollCatalog(1)}
                aria-label="เลื่อนสินค้าไปทางขวา"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div
            className="catalog-carousel"
            ref={catalogRailRef}
            aria-label="รายการสินค้า เลื่อนได้ซ้ายขวา"
            onPointerDown={handleCatalogPointerDown}
            onPointerMove={handleCatalogPointerMove}
            onPointerUp={stopCatalogDrag}
            onPointerCancel={stopCatalogDrag}
            onPointerLeave={stopCatalogDrag}
            onClickCapture={handleCatalogClickCapture}
            onDragStart={(event) => event.preventDefault()}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
          {filteredProducts.length === 0 ? (
            <button
              className="load-more"
              onClick={() => setCategory(CATEGORY_ALL)}
            >
              ดูสินค้าทั้งหมด
            </button>
          ) : null}
        </section>

        <section className="social-section">
          <div className="section-centered-title">
            <p>@2MINBOOBOO</p>
            <h2>สวยจริงในทุกวัน</h2>
            <span>แชร์ลุคของคุณกับ #2minBooBoo</span>
          </div>
          <div className="social-grid">
            {socialImages.map((product, index) => (
              <a href="#top" key={`${product.id}-${index}`} aria-label="Instagram">
                <img
                  src={product.media?.[0]?.src ?? product.image}
                  alt=""
                  loading="lazy"
                />
                <Instagram />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-newsletter">
          <p>JOIN THE BOOBOO CLUB</p>
          <h2>รับข่าวทรงใหม่และโปรพิเศษก่อนใคร</h2>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="อีเมล" />
            <button aria-label="สมัครข่าวสาร">
              <ArrowRight />
            </button>
          </form>
        </div>
        <div className="footer-main">
          <div>
            <Logo light />
            <p>ขนตาสำหรับทุกวัน ทุกลุค และทุกเวอร์ชันของคุณ</p>
          </div>
          <div>
            <h3>SHOP</h3>
            <a href="#best-sellers">Best Sellers</a>
            <a href="#new-arrivals">New Mini</a>
            <a href="#all-products">All Lashes</a>
          </div>
          <div>
            <h3>HELP</h3>
            <a href="#how-to">How to use</a>
            <a href="#real-looks">Real looks</a>
            <a href="#top">Shipping & Returns</a>
          </div>
          <div>
            <h3>FOLLOW</h3>
            <a href="#top">Instagram</a>
            <a href="https://www.tiktok.com/@2minbooboo?is_from_webapp=1&sender_device=pc">TikTok</a>
            <a href="#top">Shopee</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 2minBooBoo</span>
          <strong>“2 minutes, love yourself.”</strong>
          <span>Thailand • No Glue • Beauty with no limits</span>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
