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
  Minus,
  Pause,
  Package,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  ZoomIn,
} from "lucide-react";
import AdminPanel from "./AdminPanel.jsx";
import {
  BrandMarqueeContainer,
  CategoryTilesContainer,
  FooterContainer,
  HeaderContainer,
  HeroContainer,
  TrustStripContainer,
} from "./containers";
import heroWhiteLogo from "./assets/hero/hero-2minbooboo-logo-crop.png";
import heroOrangeProducts from "./assets/hero/hero-lifestyle-model-orange.png";
import allProductsBanner from "./assets/hero/all-products-banner.png";
import bigBangkokBabeImage from "./assets/big-size-md/Bangkok Babe.png";
import bigBloomingImage from "./assets/big-size-md/Blooming.png";
import bigCaliforniaGirlImage from "./assets/big-size-md/California Girl.png";
import bigHollywoodImage from "./assets/big-size-md/Hollywood.png";
import bigHoverBangkokBabeImage from "./assets/big-size-hover/Bangkok Babe.png";
import bigHoverBloomingImage from "./assets/big-size-hover/Blooming.png";
import bigHoverCaliforniaGirlImage from "./assets/big-size-hover/California Girl.png";
import bigHoverHollywoodImage from "./assets/big-size-hover/Hollywood.png";
import mediumBarbieDollImage from "./assets/medium-size-md/Barbie Doll.png";
import mediumMoonlightImage from "./assets/medium-size-md/Moonlight.png";
import mediumSakuraImage from "./assets/medium-size-md/Sakura.png";
import mediumSongkranImage from "./assets/medium-size-md/Songkran Booboo.png";
import mediumHoverBarbieDollImage from "./assets/medium-size-hover/Barbie Doll.png";
import mediumHoverMoonlightImage from "./assets/medium-size-hover/Moonlight.png";
import mediumHoverSakuraImage from "./assets/medium-size-hover/Sakura.png";
import mediumHoverSongkranImage from "./assets/medium-size-hover/Songkran Booboo.png";
import toolKitImage from "./assets/toolkit/2minBooboo.png";
import howToThaiPoster from "./assets/videos/how-to-thai-poster.jpg";
import howToThaiVideo from "./assets/videos/how-to-thai.mp4";
import realLookNaturalVideo from "./assets/real-look-videos/natural.mp4";
import realLookSoftGlamVideo from "./assets/real-look-videos/soft-glam.mp4";
import realLookBoldVideo from "./assets/real-look-videos/bold.mp4";
import realLookNightOutVideo from "./assets/real-look-videos/night-out.mp4";
import { fetchStorefrontProducts } from "./supabaseProducts";
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
const miniSizeHoverModules = import.meta.glob(
  [
    "./assets/minisize-img-two/**/*.png",
    "./assets/minisize-img-two/**/*.jpg",
    "./assets/minisize-img-two/**/*.jpeg",
    "./assets/minisize-img-two/**/*.webp",
  ],
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const eyeShowcaseModules = import.meta.glob(
  [
    "./assets/eye/**/*.png",
    "./assets/eye/**/*.jpg",
    "./assets/eye/**/*.jpeg",
    "./assets/eye/**/*.webp",
  ],
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const CATEGORY_MINI = "MINI Size";
const CATEGORY_TRAVEL = "Travelsize";
const CATEGORY_MEDIUM = "Medium Size";
const CATEGORY_TOOLKIT = "TOOL KIT";
const CATEGORY_FULL = "กล่องใหญ่";
const CATEGORY_SINGLE = "ขนตาเดี่ยว";
const CATEGORY_REAL = "คนใส่จริง";
const CATEGORY_HOW = "แบบใส่ก้าน";

const categoryOrder = [
  CATEGORY_ALL,
  CATEGORY_MINI,
  CATEGORY_TRAVEL,
  CATEGORY_MEDIUM,
  CATEGORY_FULL,
  CATEGORY_TOOLKIT,
  CATEGORY_REAL,
  CATEGORY_HOW,
];

const categoryLabels = {
  [CATEGORY_ALL]: "ALL",
  [CATEGORY_MINI]: "MINI SIZE",
  [CATEGORY_TRAVEL]: "TRAVEL SIZE",
  [CATEGORY_MEDIUM]: "MEDIUM SIZE",
  [CATEGORY_FULL]: "LARGE SIZE",
  [CATEGORY_TOOLKIT]: "TOOL KIT",
  [CATEGORY_REAL]: "REAL LOOKS",
  [CATEGORY_HOW]: "HOW TO",
};

const realLookVideos = [
  { id: "natural", label: "HOLLYWOOD LOOK", src: realLookNaturalVideo },
  { id: "soft-glam", label: "", src: realLookSoftGlamVideo },
  { id: "bold", label: "", src: realLookBoldVideo },
  { id: "night-out", label: "SAKURA LOOK", src: realLookNightOutVideo },
];

const categoryPrices = {
  [CATEGORY_MINI]: 89,
  [CATEGORY_TRAVEL]: 49,
  [CATEGORY_MEDIUM]: 299,
  [CATEGORY_FULL]: 349,
  [CATEGORY_REAL]: 229,
  [CATEGORY_HOW]: 159,
};

const getDefaultOriginalPrice = (product = {}) => {
  const category = product.category;
  const name = String(product.name || "").toLocaleLowerCase();

  if (category === CATEGORY_MINI || category === "New MINI Size") {
    return name.includes("dahlia") ? 129 : 99;
  }

  if (category === CATEGORY_MEDIUM) {
    if (/sakura|barbie|babie/.test(name)) return 258;
    if (/moonlight/.test(name)) return 318;
    if (/songkran|somgkran/.test(name)) return 376;
  }

  if (category === CATEGORY_FULL) {
    if (/blooming/.test(name)) return 378;
    if (/bangkok|hollywood|california/.test(name)) return 318;
  }

  return undefined;
};

const getOriginalPrice = (product = {}) =>
  Number(product.originalPrice ?? product.original_price ?? 0) ||
  getDefaultOriginalPrice(product);

const formatPrice = (value) =>
  `฿${Number(value || 0).toLocaleString("th-TH")}`;

function PriceDisplay({ product, className = "" }) {
  const originalPrice = getOriginalPrice(product);
  const price = Number(product?.price || 0);
  const shouldShowOriginal = originalPrice && originalPrice !== price;

  return (
    <span className={`price-display ${className}`.trim()}>
      {shouldShowOriginal ? (
        <span className="price-original">{formatPrice(originalPrice)}</span>
      ) : null}
      <strong className="price-current">{formatPrice(price)}</strong>
    </span>
  );
}

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

const limitedEditionMiniOrder = ["flora", "dahlia", "orchid"];

const prettify = (value) =>
  value
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/^somgkran(\s+\d{1,2})?$/i, "songkran$1")
    .replace(/^tv\s*(\d+)$/i, "Travel Lash $1")
    .replace(/\s+/g, " ")
    .trim();

const eyeShowcaseImages = Object.entries(eyeShowcaseModules)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  )
  .map(([path, src]) => ({
    src,
    alt: prettify(path.split("/").at(-1) ?? "2minBooBoo eye look"),
  }));

const getImagePresentation = (path, category, file) => {
  const isEye = category === CATEGORY_REAL;
  const flip = /(?:^|\/)orchid02\.(?:png|jpe?g|webp)$/i.test(path);
  return { kind: isEye ? "eye" : "product", flip };
};

const mediumSizeProductPattern =
  /(?:barbie\s*doll|sakura|somgkran|songkran|moonlight)/i;

const bigSizeReplacementImages = [
  { pattern: /bangkok\s*babe|bankkok\s*babe/i, image: bigBangkokBabeImage },
  { pattern: /blooming/i, image: bigBloomingImage },
  { pattern: /california\s*girl|california/i, image: bigCaliforniaGirlImage },
  { pattern: /holl?ywood|hoolywood/i, image: bigHollywoodImage },
];

const getBigSizeReplacementImage = (name = "") =>
  bigSizeReplacementImages.find((item) => item.pattern.test(name))?.image;

const bigSizeHoverImages = [
  { pattern: /bangkok\s*babe|bankkok\s*babe/i, image: bigHoverBangkokBabeImage },
  { pattern: /blooming/i, image: bigHoverBloomingImage },
  { pattern: /california\s*girl|california/i, image: bigHoverCaliforniaGirlImage },
  { pattern: /holl?ywood|hoolywood/i, image: bigHoverHollywoodImage },
];

const getBigSizeHoverImage = (name = "") =>
  bigSizeHoverImages.find((item) => item.pattern.test(name))?.image;

const mediumSizeReplacementImages = [
  { pattern: /barbie\s*(?:doll|boll)/i, image: mediumBarbieDollImage },
  { pattern: /moonlight/i, image: mediumMoonlightImage },
  { pattern: /sakura/i, image: mediumSakuraImage },
  { pattern: /songkran|somgkran/i, image: mediumSongkranImage },
];

const getMediumSizeReplacementImage = (name = "") =>
  mediumSizeReplacementImages.find((item) => item.pattern.test(name))?.image;

const mediumSizeHoverImages = [
  { pattern: /barbie\s*(?:doll|boll)/i, image: mediumHoverBarbieDollImage },
  { pattern: /moonlight/i, image: mediumHoverMoonlightImage },
  { pattern: /sakura/i, image: mediumHoverSakuraImage },
  { pattern: /songkran|somgkran/i, image: mediumHoverSongkranImage },
];

const getMediumSizeHoverImage = (name = "") =>
  mediumSizeHoverImages.find((item) => item.pattern.test(name))?.image;

const normalizeHoverLookupKey = (value = "") =>
  value
    .toLocaleLowerCase()
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/calofornia/g, "california")
    .replace(/hoolywood/g, "hollywood")
    .replace(/holly\s*wood/g, "hollywood")
    .replace(/thai\s*pop/g, "thaipop")
    .replace(/bangkok\s*babe/g, "bangkokbabe")
    .replace(/bankkok\s*babe/g, "bangkokbabe")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9ก-๙]/g, "");

const miniSizeHoverImages = Object.entries(miniSizeHoverModules).map(
  ([path, image]) => ({
    key: normalizeHoverLookupKey(path.split("/").at(-1) ?? ""),
    image,
  }),
);

const getMiniSizeHoverImage = (name = "") => {
  const key = normalizeHoverLookupKey(name);
  return miniSizeHoverImages.find(
    (item) => key.includes(item.key) || item.key.includes(key),
  )?.image;
};

const getProductCategory = (category, file) => {
  if (category === CATEGORY_FULL && mediumSizeProductPattern.test(file)) {
    return CATEGORY_MEDIUM;
  }

  return category;
};

const rawProducts = Object.entries(productModules).map(
  ([path, image], index) => {
    const parts = path.split("/");
    const originalCategory = parts.at(-2);
    const file = parts.at(-1);
    const category = getProductCategory(originalCategory, file);
    const name = prettify(file) || `2minBooBoo Lash ${index + 1}`;
    return {
      id: `${category}-${file}-${index}`,
      category,
      image,
      images: [image],
      media: [{ src: image, ...getImagePresentation(path, category, file) }],
      name,
      price: categoryPrices[category] ?? 229,
      originalPrice: getDefaultOriginalPrice({ category, name }),
      isNew: index % 13 === 0,
    };
  },
);

const groupableCategories = new Set([CATEGORY_MEDIUM, CATEGORY_FULL]);
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

products.forEach((product) => {
  product.originalPrice = getOriginalPrice(product);

  const replacementImage =
    product.category === CATEGORY_FULL
      ? getBigSizeReplacementImage(product.name)
      : product.category === CATEGORY_MEDIUM
        ? getMediumSizeReplacementImage(product.name)
        : undefined;

  const hoverImage =
    product.category === CATEGORY_MINI
      ? getMiniSizeHoverImage(product.name)
      : product.category === CATEGORY_MEDIUM
        ? getMediumSizeHoverImage(product.name)
        : product.category === CATEGORY_FULL
          ? getBigSizeHoverImage(product.name)
          : undefined;

  if (replacementImage) {
    product.image = replacementImage;
    product.images = [replacementImage];
    product.media = [
      {
        src: replacementImage,
        kind: "product",
        flip: false,
      },
    ];
  }

  if (hoverImage) {
    product.hoverImage = hoverImage;

    if (product.category === CATEGORY_MINI) {
      const hasHoverMedia = product.media?.some((item) => item.src === hoverImage);
      product.images = [...new Set([...(product.images ?? []), hoverImage])];
      if (!hasHoverMedia) {
        product.media = [
          ...(product.media ?? []),
          {
            src: hoverImage,
            kind: "hover",
            flip: false,
          },
        ];
      }
    }
  }
});

const normalizeProductName = (value = "", options = {}) => {
  const normalized = value
    .toLocaleLowerCase()
    .replace(/booboo/g, "")
    .replace(/false eyelash/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (options.keepNumbers) return normalized;

  return normalized.replace(/\b0?([12])\b/g, "").replace(/\s+/g, " ").trim();
};

const normalizeProductNameForCategory = (value = "", category = "") =>
  normalizeProductName(value, { keepNumbers: category === CATEGORY_TRAVEL });

const getLimitedEditionMiniIndex = (product) => {
  if (product?.category !== CATEGORY_MINI) return -1;
  const name = normalizeProductName(product.name);
  return limitedEditionMiniOrder.findIndex((item) => name.includes(item));
};

const isLimitedEditionMini = (product) => getLimitedEditionMiniIndex(product) >= 0;

const sortLimitedEditionMiniFirst = (items) =>
  [...items].sort((a, b) => {
    const aIndex = getLimitedEditionMiniIndex(a);
    const bIndex = getLimitedEditionMiniIndex(b);

    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return 0;
  });

const staticProductsById = new Map(products.map((product) => [product.id, product]));
const staticProductsByName = new Map(
  products.map((product) => [
    `${product.category}-${normalizeProductNameForCategory(product.name, product.category)}`,
    product,
  ]),
);

const isDeployUnsafeImageSrc = (src = "") => {
  const value = String(src).trim();

  if (!value) return true;
  if (/^(blob:|file:)/i.test(value)) return true;
  if (/^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])/i.test(value)) return true;
  if (/^[a-z]:\\/i.test(value)) return true;
  if (/^\/src\//i.test(value)) return true;
  if (/^\.{1,2}\//.test(value)) return true;
  if (/\/assets\/[^?#]+\.(?:png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(value)) {
    return true;
  }

  return false;
};

const getStaticProductMatch = (product) =>
  staticProductsById.get(product.id) ??
  staticProductsByName.get(
    `${product.category}-${normalizeProductNameForCategory(product.name, product.category)}`,
  ) ??
  products.find((staticProduct) => {
    if (staticProduct.category !== product.category) return false;

    const staticName = normalizeProductNameForCategory(
      staticProduct.name,
      staticProduct.category,
    );
    const productName = normalizeProductNameForCategory(
      product.name,
      product.category,
    );
    if (!staticName || !productName) return false;

    return staticName.includes(productName) || productName.includes(staticName);
  });

const ensureDeploySafeProductImages = (remoteProducts) =>
  remoteProducts.map((product) => {
    const staticMatch = getStaticProductMatch(product);
    const fallbackMedia = staticMatch?.media ?? [];
    const hasUnsafeMedia =
      !product.media?.length ||
      product.media.some((item) => isDeployUnsafeImageSrc(item.src));

    if (!staticMatch?.media?.length) return product;

    const productWithFallbacks = {
      ...product,
      originalPrice: getOriginalPrice(product) ?? staticMatch.originalPrice,
      fallbackImage: staticMatch.image,
      fallbackImages: staticMatch.images,
      fallbackMedia,
      hoverImage: product.hoverImage ?? staticMatch.hoverImage,
    };

    if (!hasUnsafeMedia) return productWithFallbacks;

    return {
      ...productWithFallbacks,
      image: staticMatch.image,
      images: staticMatch.images,
      media: staticMatch.media,
    };
  });

const getProductFallbackMedia = (product, index = 0) => {
  if (!product) return undefined;

  const fallbackMedia = product.fallbackMedia?.length
    ? product.fallbackMedia
    : product.media?.length
      ? product.media
      : product.fallbackImage
        ? [{ src: product.fallbackImage, kind: "product", flip: false }]
        : [];

  return fallbackMedia[index % Math.max(fallbackMedia.length, 1)];
};

const swapBrokenImageToFallback = (event, fallbackSrc) => {
  if (!fallbackSrc || event.currentTarget.dataset.fallbackApplied === "true") return;
  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.src = fallbackSrc;
};

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
  (product) => product.category === CATEGORY_MINI,
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
      miniProducts[0],
      fullSizeProducts[0],
      miniProducts[1],
      miniProducts[2],
    ].filter(Boolean),
    tone: "peach",
  },
  {
    eyebrow: "MINI SIZE SERIES",
    title: "ลุคใหม่\nพร้อมติดทันที",
    body: "ช่อขนตาน้ำหนักเบา เรียงง่าย ติดแน่น พร้อมออกจากบ้านภายใน 2 นาที",
    cta: "SHOP MINI SIZE",
    image:
      lifestyleImages.find((product) => /hollywood/i.test(product.name))
        ?.image ?? lifestyleImages[1]?.image,
    products: [
      miniProducts[1],
      fullSizeProducts[1],
      miniProducts[3],
      miniProducts[4],
    ].filter(Boolean),
    tone: "sunset",
  },
];

const exploreCategories = [
  { label: "BEST SELLERS", value: "BEST SELLERS" },
  { label: "MINI SIZE", value: "MINI Size" },
  { label: "MEDIUM SIZE", value: CATEGORY_MEDIUM },
  { label: "LARGE SIZE", value: CATEGORY_FULL },
  { label: "OFFLINE ONLY", value: "Travelsize" },
  { label: "TOOL KIT", value: CATEGORY_TOOLKIT}
];

const marqueeMessages = [
  "2MINBOOBOO BEST SELLERS",
  "NO GLUE · NO MESS",
  "BEAUTY WITH NO LIMITS",
  "ติดง่ายใน 2 นาที",
];

const productSystemMeta = {
  flora: {
    style: "หวานละมุน · เบาสบาย",
    role: "ดึงลูกค้า",
    scene: "เดต / คาเฟ่ / แต่งหน้าเบา ๆ",
    stars: 3,
  },
  dahlia: {
    style: "เป็นธรรมชาติ ดูโดดเด่น · รุ่นแนะนำ",
    role: "รุ่นทำกำไรหลัก",
    scene: "ไปทำงาน / เดต / ใช้ได้ทุกโอกาส",
    stars: 4,
  },
  orchid: {
    style: "ลุคใส เรียบร้อย · เป็นธรรมชาติ",
    role: "ดึงลูกค้า",
    scene: "เรียน / สัมภาษณ์งาน / พบผู้ใหญ่",
    stars: 2,
  },
  sakura: {
    style: "รุ่นเด่นของแบรนด์ · เป็นธรรมชาติสูง",
    role: "ดึงลูกค้า",
    scene: "ทุกวัน / ไปเรียน / ทำงาน",
    stars: 4,
  },
  blooming: {
    style: "ละมุน สดใส · ใช้ง่ายทุกวัน",
    role: "ซื้อซ้ำง่าย",
    scene: "คาเฟ่ / เดต / วันสบาย ๆ",
    stars: 4,
  },
  moonlight: {
    style: "คมขึ้นแต่ยังนุ่ม · ลุคกลางคืน",
    role: "อัปเกรดลุค",
    scene: "ดินเนอร์ / งานกลางคืน",
    stars: 4,
  },
  hollywood: {
    style: "เด่น ชัด ถ่ายรูปขึ้น",
    role: "เพิ่มบิล",
    scene: "ปาร์ตี้ / ถ่ายคอนเทนต์",
    stars: 5,
  },
  "bangkok babe": {
    style: "คมหวาน · แต่งแล้วตาเปิด",
    role: "ขายดี",
    scene: "ทำงาน / ออกงาน / แต่งเต็ม",
    stars: 5,
  },
};

const getProductSystemMeta = (name = "") => {
  const normalized = name.toLocaleLowerCase();
  const key = Object.keys(productSystemMeta).find((item) =>
    normalized.includes(item),
  );

  return (
    productSystemMeta[key] ?? {
      style: "สไตล์ใช้ง่าย · ติดไวใน 2 นาที",
      role: "เติมไลน์สินค้า",
      scene: "ใช้ได้ทุกวัน / ทดลองลุคใหม่",
      stars: 3,
    }
  );
};

const categoryTiles = [
  {
    label: "MINI SIZE",
    note: "ขายดี ติดง่าย",
    category: "MINI Size",
    icon: Sparkles,
  },
  {
    label: "MEDIUM SIZE",
    note: "กล่องกลาง ใช้ง่าย",
    category: CATEGORY_MEDIUM,
    icon: Gift,
  },
  {
    label: "LARGE SIZE",
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
  {
    label: "OFFLINE ONLY",
    note: "พกไปได้ทุกที่",
    category: "Travelsize",
    icon: Package,
  },
];

const getAppRoute = () => {
  const hash = window.location.hash.replace(/^#\/?/, "").toLocaleLowerCase();
  if (hash === "admin" || window.location.pathname.toLocaleLowerCase().includes("/admin")) {
    return "admin";
  }
  if (hash === "products" || window.location.pathname.toLocaleLowerCase().includes("/products")) {
    return "products";
  }
  return "home";
};

function Logo({ light = false }) {
  return (
    <a
      className={`logo ${light ? "logo-light" : ""}`}
      data-container="brand-logo"
      href="#top"
      aria-label="2minBooboo home"
    >
      <span>2minBooboo</span>
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

function ProductZoom({ product, media, fallbackMedia, onClose }) {
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
    <div
      className="zoom-overlay"
      role="presentation"
      onClick={onClose}
      data-container="product-zoom-overlay"
    >
      <div
        className="zoom-dialog"
        data-container="product-zoom-dialog"
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
          data-container="product-zoom-media"
          style={{ "--series-color": getSeriesColor(product.name) }}
        >
          <img
            className={media.flip ? "is-flipped" : ""}
            src={media.src}
            onError={(event) =>
              swapBrokenImageToFallback(event, fallbackMedia?.src)
            }
            alt={`${product.name} ภาพขยาย`}
          />
        </div>
        <div className="zoom-copy" data-container="product-zoom-copy">
          <span className="zoom-eyebrow">PRODUCT PREVIEW</span>
          <p>{categoryLabels[product.category] ?? product.category}</p>
          <h2>{product.name}</h2>
          <PriceDisplay product={product} className="zoom-price" />
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
  const cardClassName = [
    "product-card",
    compact ? "product-card-compact" : "",
    product.category === CATEGORY_MEDIUM ? "is-medium-size" : "",
  ].filter(Boolean).join(" ");
  const hoverImage =
    product.hoverImage ?? product.media?.find((item) => item.kind === "hover")?.src;
  const media = product.media?.filter((item) => item.kind !== "hover").length
    ? product.media.filter((item) => item.kind !== "hover")
    : [{ src: product.image, kind: "product", flip: false }];
  const activeMedia = media[imageIndex] ?? media[0];
  const activeFallbackMedia = getProductFallbackMedia(product, imageIndex);
  const hasMultipleImages = media.length > 1;
  const [mood, length] = getSeriesDetail(product.name);
  const badgeText = isLimitedEditionMini(product)
    ? "NEW · LIMITED EDITION"
    : product.isNew
      ? "NEW"
      : "";

  useEffect(() => {
    if (imageIndex >= media.length) {
      setImageIndex(0);
    }
  }, [imageIndex, media.length]);

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
      className={cardClassName}
      data-container="product-card"
      style={{ "--series-color": getSeriesColor(product.name) }}
    >
      <div className="product-media" data-container="product-card-media">
        {badgeText ? <span className="product-badge">{badgeText}</span> : null}
        <button
          className={`heart-button ${liked ? "is-liked" : ""}`}
          onClick={() => setLiked((value) => !value)}
          aria-label={`${liked ? "เลิกบันทึก" : "บันทึก"} ${product.name}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          className={`product-image-button ${hoverImage ? "has-hover-image" : ""}`}
          onClick={() => setZoomOpen(true)}
          aria-label={`ซูมภาพ ${product.name}`}
        >
          <img
            key={activeMedia.src}
            className={`product-main-image ${activeMedia.kind === "eye" ? "image-eye" : ""} ${
              activeMedia.flip ? "is-flipped" : ""
            }`}
            src={activeMedia.src}
            alt={`${product.name} ภาพที่ ${imageIndex + 1}`}
            loading="lazy"
            onError={(event) =>
              swapBrokenImageToFallback(event, activeFallbackMedia?.src)
            }
          />
          {hoverImage ? (
            <img
              className="product-hover-image"
              src={hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          ) : null}
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
      <div className="product-copy" data-container="product-card-copy">
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
        <div className="product-action" data-container="product-card-action">
          <PriceDisplay product={product} />
          <button onClick={() => onAdd(product)}>เพิ่มลงถุง</button>
        </div>
      </div>
      {zoomOpen ? (
        <ProductZoom
          product={product}
          media={activeMedia}
          fallbackMedia={activeFallbackMedia}
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
    <section className="product-section" data-container="product-rail-carousel">
      <div className="section-title-row" data-container="product-rail-header">
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
      <div className="product-rail" ref={railRef} data-container="product-rail-items">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} compact />
        ))}
      </div>
    </section>
  );
}

function ProductSystemCard({ product, tier, index }) {
  const media =
    product.media?.find((item) => item.kind === "product") ??
    product.media?.[0] ??
    { src: product.image, flip: false };
  const hoverImage =
    product.hoverImage ?? product.media?.find((item) => item.kind === "hover")?.src;
  const meta = getProductSystemMeta(product.name);
  const fallbackMedia = getProductFallbackMedia(product, 0);
  const isFeatured =
    tier === "mini" && /flora|dahlia|orchid/i.test(product.name);

  return (
    <article
      className={`system-product-card ${isFeatured ? "is-featured" : ""}`}
      data-container={`product-system-card-${tier}`}
    >
      {isFeatured ? (
        <span className="system-product-limited">NEW · LIMITED EDITION</span>
      ) : null}
      <div
        className={`system-product-image ${hoverImage ? "has-hover-image" : ""}`}
        data-container="product-system-card-media"
      >
        <img
          className={`system-product-main-image ${media.flip ? "is-flipped" : ""}`}
          src={media.src}
          alt={product.name}
          loading="lazy"
          onError={(event) =>
            swapBrokenImageToFallback(event, fallbackMedia?.src)
          }
        />
        {hoverImage ? (
          <img
            className="system-product-hover-image"
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="system-product-copy" data-container="product-system-card-copy">
        <h3>
          {product.name}
          <span>{product.name.toLocaleUpperCase()}</span>
        </h3>
        <p>{meta.style}</p>
        <small>{meta.scene}</small>
      </div>
    </article>
  );
}

function ProductSystemSection({
  miniItems,
  mediumItems,
  fullItems,
  onSelectCategory,
}) {
  const groups = [
    {
      key: "mini",
      label: "Mini Size",
      note: "กล่องเล็ก",
      products: miniItems,
      category: "MINI Size",
    },
    {
      key: "medium",
      label: "Medium Size",
      note: "กล่องกลาง",
      products: mediumItems,
      category: CATEGORY_MEDIUM,
    },
    {
      key: "full",
      label: "Large Size",
      note: "กล่องใหญ่",
      products: fullItems,
      category: CATEGORY_FULL,
    },
  ].filter((group) => group.products.length);

  return (
    <section className="product-system" id="product-system" data-container="product-system-all-sizes">
      <div className="product-system-head" data-container="product-system-header">
        <div>
          <h2>ALL SIZE</h2>
        </div>
      </div>

      {groups.map((group) => (
        <div className="product-system-group" key={group.key} data-container={`product-system-${group.key}`}>
          <div className="product-system-subhead" data-container={`product-system-${group.key}-header`}>
            <div>
              <strong>{group.label}</strong>
              <small>{group.note}</small>
            </div>
            <button onClick={() => onSelectCategory(group.category)}>
              ดูหมวดนี้ <ArrowRight size={15} />
            </button>
          </div>
          <div className="product-system-grid" data-container={`product-system-${group.key}-grid`}>
            {group.products.map((product, index) => (
              <ProductSystemCard
                key={`${group.key}-${product.id}`}
                product={product}
                tier={group.key}
                index={index}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function ProductListingPage({
  products: allProducts,
  activeCategory,
  onCategoryChange,
  onAdd,
  onBackHome,
}) {
  const visibleProducts = useMemo(
    () =>
      activeCategory === CATEGORY_ALL
        ? allProducts.filter(
            (product) =>
              product.category !== CATEGORY_REAL &&
              product.category !== CATEGORY_HOW,
          )
        : allProducts.filter((product) => product.category === activeCategory),
    [activeCategory, allProducts],
  );

  const pageCategories = categoryOrder.filter(
    (item) => item !== CATEGORY_REAL && item !== CATEGORY_HOW,
  );

  return (
    <main className="products-page" data-container="products-page">
      <section className="products-page-hero" data-container="products-page-hero">
        <img
          src={allProductsBanner}
          alt="2minBooboo All Products Collection"
          width="2048"
          height="768"
          loading="eager"
        />
      </section>

      <section className="products-page-panel" data-container="products-page-catalog">
        <div className="products-page-toolbar" data-container="products-page-toolbar">
          <div>
            <p>เลือกหมวดหมู่</p>
            <h2>{categoryLabels[activeCategory] ?? activeCategory}</h2>
          </div>
          <span>{visibleProducts.length} รายการ</span>
        </div>

        <div className="products-page-tabs" role="tablist" data-container="products-page-category-tabs">
          {pageCategories.map((item) => (
            <button
              key={item}
              className={activeCategory === item ? "is-active" : ""}
              onClick={() => onCategoryChange(item)}
              role="tab"
              aria-selected={activeCategory === item}
            >
              {categoryLabels[item]}
            </button>
          ))}
        </div>

        <div className="products-grid" data-container="products-page-product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="products-empty" data-container="products-page-empty-state">
            <p>ยังไม่มีสินค้าในหมวดนี้</p>
            <button onClick={() => onCategoryChange(CATEGORY_ALL)}>
              ดูสินค้าทั้งหมด
            </button>
          </div>
        ) : null}
      </section>
    </main>
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
  const freeShippingTarget = 399;
  const remaining = Math.max(0, freeShippingTarget - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingTarget) * 100);

  useEffect(() => {
    document.body.classList.add("overlay-open");
    return () => document.body.classList.remove("overlay-open");
  }, []);

  return createPortal(
    <div className="drawer-overlay" role="presentation" onClick={onClose} data-container="cart-overlay">
      <aside
        className="cart-drawer"
        data-container="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="ตะกร้าสินค้า"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header" data-container="cart-header">
          <div>
            <span>YOUR BAG</span>
            <h2>ตะกร้าของคุณ</h2>
          </div>
          <button onClick={onClose} aria-label="ปิดตะกร้า">
            <X />
          </button>
        </div>
        <div className="shipping-meter" data-container="cart-shipping-meter">
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
          <div className="empty-cart" data-container="cart-empty-state">
            <ShoppingBag size={42} strokeWidth={1.2} />
            <h3>ถุงยังว่างอยู่</h3>
            <p>เลือกทรงที่ใช่ แล้วพร้อมสวยใน 2 นาที</p>
            <button onClick={onClose}>ช้อปสินค้าทั้งหมด</button>
          </div>
        ) : (
          <>
            <div className="cart-items" data-container="cart-items-list">
              {items.map((item) => (
                <article className="cart-item" key={item.id} data-container="cart-item">
                  <div
                    className="cart-thumb"
                    data-container="cart-item-media"
                    style={{ "--series-color": getSeriesColor(item.name) }}
                  >
                    <img
                      className={item.media?.[0]?.flip ? "is-flipped" : ""}
                      src={item.media?.[0]?.src ?? item.image}
                      alt={item.name}
                      onError={(event) =>
                        swapBrokenImageToFallback(
                          event,
                          getProductFallbackMedia(item, 0)?.src,
                        )
                      }
                    />
                  </div>
                  <div className="cart-item-copy" data-container="cart-item-copy">
                    <p>{categoryLabels[item.category] ?? item.category}</p>
                    <h3>{item.name}</h3>
                    <PriceDisplay product={item} className="cart-item-price" />
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
            <div className="cart-recommendations" data-container="cart-recommendations">
              <h3>คุณอาจจะชอบ</h3>
              {recommendations.slice(0, 2).map((product) => (
                <article key={product.id} data-container="cart-recommendation-card">
                  <img
                    src={product.media?.[0]?.src ?? product.image}
                    alt=""
                    onError={(event) =>
                      swapBrokenImageToFallback(
                        event,
                        getProductFallbackMedia(product, 0)?.src,
                      )
                    }
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <PriceDisplay product={product} className="cart-recommendation-price" />
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
            <div className="cart-summary" data-container="cart-summary">
              <div>
                <span>ยอดรวม</span>
                <strong>฿{subtotal.toLocaleString("th-TH")}</strong>
              </div>
              <p>ภาษีรวมแล้ว ค่าจัดส่งคำนวณในขั้นตอนถัดไป</p>
              <button onClick={() => window.open("https://linktr.ee/2minBooboolashes?utm_source=linktree_profile_share&ltsid=421f992e-0dcb-4aaf-b5c9-5c43f2717a9a", "_blank")}>
                ดำเนินการสั่งซื้อ
              </button>
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
    <div className="search-overlay" role="dialog" aria-modal="true" data-container="search-overlay">
      <div className="search-top" data-container="search-header">
        <Logo />
        <button onClick={onClose} aria-label="ปิดการค้นหา">
          <X />
        </button>
      </div>
      <div className="search-box" data-container="search-input-box">
        <Search />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหา Sakura, Bangkok Babe..."
          aria-label="ค้นหาสินค้า"
        />
      </div>
      <p className="search-label" data-container="search-results-label">
        {query ? `ผลการค้นหา “${query}”` : "สินค้ายอดนิยม"}
      </p>
      <div className="search-results" data-container="search-results-list">
        {results.map((product) => (
          <article key={product.id} data-container="search-result-card">
            <img
              src={product.media?.[0]?.src ?? product.image}
              alt=""
              onError={(event) =>
                swapBrokenImageToFallback(
                  event,
                  getProductFallbackMedia(product, 0)?.src,
                )
              }
            />
            <div>
              <p>{categoryLabels[product.category] ?? product.category}</p>
              <h3>{product.name}</h3>
              <PriceDisplay product={product} className="search-result-price" />
             </div>
            <button onClick={() => onAdd(product)}>เพิ่มลงถุง</button>
          </article>
        ))}
      </div>
    </div>,
    document.body,
  );
}

function CareerModal({ onClose }) {
  useEffect(() => {
    document.body.classList.add("overlay-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("overlay-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="career-modal-overlay"
      role="presentation"
      onClick={onClose}
      data-container="career-modal-overlay"
    >
      <section
        className="career-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-modal-title"
        onClick={(event) => event.stopPropagation()}
        data-container="career-modal"
      >
        <button
          className="career-modal-close"
          onClick={onClose}
          aria-label="ปิด popup career"
        >
          <X size={24} />
        </button>
        <p className="career-modal-eyebrow">2MINBOOBOO CARRER</p>
        <h2 id="career-modal-title">สมัครเป็น</h2>
        <h2 id="career-modal-title">( AFFILIATE )</h2>
        <h2 id="career-modal-title">2minBooboo</h2>
        <p className="career-modal-copy">CONTACT US</p>
        <a href="mailto:2minbooboolashes@gmail.com">
          2minbooboolashes@gmail.com
        </a>
      </section>
    </div>,
    document.body,
  );
}

function ToolKitModal({ onClose, onShopAll }) {
  useEffect(() => {
    document.body.classList.add("overlay-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("overlay-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="career-modal-overlay"
      role="presentation"
      onClick={onClose}
      data-container="toolkit-modal-overlay"
    >
      <section
        className="career-modal toolkit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="toolkit-modal-title"
        onClick={(event) => event.stopPropagation()}
        data-container="toolkit-modal"
      >
        <button
          className="career-modal-close"
          onClick={onClose}
          aria-label="ปิด popup tool kit"
        >
          <X size={24} />
        </button>

        <div className="toolkit-modal-grid">
          <div className="toolkit-modal-copy">
            <p className="career-modal-eyebrow">2MINBOOBOO TOOL KIT</p>
            <h2 id="toolkit-modal-title">KIT SET</h2>
            <p>
              อุปกรณ์สำหรับติดขนตาให้สวยไว ใช้ง่าย และพร้อมพกไปได้ทุกที่
            </p>
          </div>

          <div className="toolkit-modal-image-card">
            <img src={toolKitImage} alt="2minBooBoo Eyelash Tool Kit" />
          </div>
        </div>

        <div className="toolkit-modal-actions">
          <button className="toolkit-modal-shop" onClick={onShopAll}>
            BUY
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getAppRoute);
  const isAdminRoute = currentRoute === "admin";
  const [category, setCategory] = useState(CATEGORY_ALL);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [toolKitOpen, setToolKitOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredCategory, setFeaturedCategory] = useState("MINI Size");
  const [miniShowcaseIndex, setMiniShowcaseIndex] = useState(0);
  const [eyeShowcaseIndex, setEyeShowcaseIndex] = useState(0);
  const [storeProducts, setStoreProducts] = useState(products);
  const featuredRailRef = useRef(null);
  const catalogRailRef = useRef(null);
  const howMediaRef = useRef(null);
  const howVideoRef = useRef(null);
  const userPausedHowVideoRef = useRef(false);
  const [isHowVideoPlaying, setIsHowVideoPlaying] = useState(false);
  const featuredDragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });
  const catalogDragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });
  const featuredScrollAnimationRef = useRef(null);
  const catalogScrollAnimationRef = useRef(null);

  const storefrontProducts = useMemo(
    () =>
      (storeProducts.length ? storeProducts : products).filter(
        (product) => product.category !== CATEGORY_SINGLE,
      ),
    [storeProducts],
  );
  const storefrontLifestyleImages = useMemo(
    () =>
      storefrontProducts.filter(
        (product) => product.category === CATEGORY_REAL,
      ),
    [storefrontProducts],
  );
  const storefrontMiniProducts = useMemo(
    () =>
      storefrontProducts.filter((product) => product.category === CATEGORY_MINI),
    [storefrontProducts],
  );
  const miniShowcaseSourceProducts = useMemo(
    () => storefrontMiniProducts.filter((product) => product.category === CATEGORY_MINI),
    [storefrontMiniProducts],
  );
  const storefrontFullSizeProducts = useMemo(
    () =>
      storefrontProducts.filter((product) => product.category === CATEGORY_FULL),
    [storefrontProducts],
  );
  const showcaseProducts = useMemo(
    () =>
      storefrontProducts.filter(
        (product) =>
          product.category !== CATEGORY_REAL &&
          product.category !== CATEGORY_HOW &&
          product.category !== CATEGORY_SINGLE,
      ),
    [storefrontProducts],
  );
  const storefrontHeroSlides = useMemo(
    () =>
      heroSlides.map((slide, index) => ({
        ...slide,
        image:
          index === 0
            ? storefrontLifestyleImages.find((product) =>
                /california/i.test(product.name),
              )?.image ?? storefrontLifestyleImages[0]?.image ?? slide.image
            : storefrontLifestyleImages.find((product) =>
                /hollywood/i.test(product.name),
              )?.image ?? storefrontLifestyleImages[1]?.image ?? slide.image,
        products:
          index === 0
            ? [
                storefrontMiniProducts[0],
                storefrontFullSizeProducts[0],
                storefrontMiniProducts[1],
                storefrontMiniProducts[2],
              ].filter(Boolean)
            : [
                storefrontMiniProducts[1],
                storefrontFullSizeProducts[1],
                storefrontMiniProducts[3],
                storefrontMiniProducts[4],
              ].filter(Boolean),
      })),
    [
      storefrontFullSizeProducts,
      storefrontLifestyleImages,
      storefrontMiniProducts,
    ],
  );

  const refreshStorefrontProducts = async () => {
    const remoteProducts = await fetchStorefrontProducts();
    if (remoteProducts.length) {
      setStoreProducts(ensureDeploySafeProductImages(remoteProducts));
    }
    return remoteProducts;
  };

  const navigateToRoute = (route) => {
    if (route === "home") {
      window.history.pushState(null, "", import.meta.env.BASE_URL || "/");
      setCurrentRoute("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = window.setInterval(
      () => setHeroIndex((index) => (index + 1) % heroSlides.length),
      10000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    refreshStorefrontProducts();
  }, []);

  useEffect(() => {
    if (miniShowcaseSourceProducts.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setMiniShowcaseIndex(
        (index) => (index + 1) % miniShowcaseSourceProducts.length,
      );
    }, 2000);
    return () => window.clearInterval(timer);
  }, [miniShowcaseSourceProducts.length]);

  useEffect(() => {
    if (!miniShowcaseSourceProducts.length) return;
    setMiniShowcaseIndex((index) => index % miniShowcaseSourceProducts.length);
  }, [miniShowcaseSourceProducts.length]);

  useEffect(() => {
    if (eyeShowcaseImages.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setEyeShowcaseIndex((index) => (index + 1) % eyeShowcaseImages.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = howMediaRef.current;
    const video = howVideoRef.current;
    if (!media || !video) return undefined;

    const syncVideoState = () => {
      setIsHowVideoPlaying(!video.paused && !video.ended);
    };

    const playVideo = () => {
      video.play().catch(() => {
        setIsHowVideoPlaying(false);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.42) {
          if (!userPausedHowVideoRef.current) {
            playVideo();
          }
          return;
        }

        video.pause();
      },
      {
        threshold: [0, 0.42, 0.75],
      },
    );

    video.addEventListener("play", syncVideoState);
    video.addEventListener("pause", syncVideoState);
    video.addEventListener("ended", syncVideoState);
    observer.observe(media);
    syncVideoState();

    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener("play", syncVideoState);
      video.removeEventListener("pause", syncVideoState);
      video.removeEventListener("ended", syncVideoState);
    };
  }, []);

  useEffect(() => {
    const syncRoute = () => setCurrentRoute(getAppRoute());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentRoute]);

  const filteredProducts = useMemo(
    () =>
      category === CATEGORY_ALL
        ? storefrontProducts.filter(
            (product) =>
              product.category !== CATEGORY_REAL &&
              product.category !== CATEGORY_HOW,
          )
        : storefrontProducts.filter((product) => product.category === category),
    [category, storefrontProducts],
  );

  useEffect(() => {
    catalogRailRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [category]);

  useEffect(() => {
    featuredRailRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [featuredCategory]);

  useEffect(
    () => () => {
      if (featuredScrollAnimationRef.current) {
        window.cancelAnimationFrame(featuredScrollAnimationRef.current);
      }
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
        storefrontProducts.find(
          (product) =>
            product.category !== CATEGORY_REAL &&
            product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
        ),
      )
      .filter(Boolean);
  }, [storefrontProducts]);

  const featuredProducts = useMemo(
    () => {
      const nextProducts =
        featuredCategory === "BEST SELLERS"
          ? bestSellers
          : storefrontProducts.filter(
              (product) => product.category === featuredCategory,
            );

      return featuredCategory === CATEGORY_MINI
        ? sortLimitedEditionMiniFirst(nextProducts)
        : nextProducts;
    },
    [bestSellers, featuredCategory, storefrontProducts],
  );
  const featuredProductsFitInDesktop = featuredProducts.length <= 5;
  const featuredCategoryShouldScroll =
    featuredCategory === CATEGORY_MEDIUM || featuredCategory === CATEGORY_FULL;
  const featuredRailIsShort =
    featuredProductsFitInDesktop && !featuredCategoryShouldScroll;

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
    setMobileMenuOpen(false);
    navigateToRoute("products");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document
          .querySelector('[data-container="products-page-catalog"]')
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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

  const scrollFeatured = (direction) => {
    const rail = featuredRailRef.current;
    if (!rail) return;

    if (featuredScrollAnimationRef.current) {
      window.cancelAnimationFrame(featuredScrollAnimationRef.current);
    }

    const startLeft = rail.scrollLeft;
    const maxLeft = rail.scrollWidth - rail.clientWidth;
    const targetLeft = Math.max(
      0,
      Math.min(maxLeft, startLeft + direction * rail.clientWidth * 0.9),
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
        featuredScrollAnimationRef.current =
          window.requestAnimationFrame(animate);
        return;
      }

      rail.scrollLeft = targetLeft;
      rail.classList.remove("is-button-scrolling");
      featuredScrollAnimationRef.current = null;
    };

    featuredScrollAnimationRef.current =
      window.requestAnimationFrame(animate);
  };

  const handleFeaturedPointerDown = (event) => {
    const rail = featuredRailRef.current;
    if (!rail || (event.pointerType === "mouse" && event.button !== 0)) return;

    if (featuredScrollAnimationRef.current) {
      window.cancelAnimationFrame(featuredScrollAnimationRef.current);
      featuredScrollAnimationRef.current = null;
      rail.classList.remove("is-button-scrolling");
    }

    featuredDragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      hasDragged: false,
    };
    rail.classList.add("is-dragging");
  };

  const handleFeaturedPointerMove = (event) => {
    const rail = featuredRailRef.current;
    const drag = featuredDragRef.current;
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

  const stopFeaturedDrag = (event) => {
    const rail = featuredRailRef.current;
    const drag = featuredDragRef.current;
    if (!drag.isDragging || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.isDragging = false;
    drag.pointerId = null;
    rail?.classList.remove("is-dragging");

    window.setTimeout(() => {
      featuredDragRef.current.hasDragged = false;
    }, 160);
  };

  const handleFeaturedClickCapture = (event) => {
    if (!featuredDragRef.current.hasDragged) return;

    event.preventDefault();
    event.stopPropagation();
    featuredDragRef.current.hasDragged = false;
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
    if (currentRoute !== "home") {
      navigateToRoute("home");
    }
    window.setTimeout(() => {
      document
        .getElementById("best-sellers")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const selectHeaderCategory = (nextCategory) => {
    selectCategory(nextCategory);
  };

  const activeHero = storefrontHeroSlides[heroIndex] ?? heroSlides[heroIndex];
  const socialImages = [
    ...storefrontLifestyleImages,
    ...storefrontMiniProducts.flatMap((product) => product.media.slice(0, 1)),
  ].slice(0, 8);
  const miniShowcaseProducts = useMemo(() => {
    if (!miniShowcaseSourceProducts.length) return [];
    return Array.from(
      { length: Math.min(5, miniShowcaseSourceProducts.length) },
      (_, offset) =>
        miniShowcaseSourceProducts[
          (miniShowcaseIndex + offset) % miniShowcaseSourceProducts.length
        ],
    );
  }, [miniShowcaseIndex, miniShowcaseSourceProducts]);
  const activeMiniShowcaseProduct = miniShowcaseProducts[0];
  const activeEyeShowcaseImage =
    eyeShowcaseImages[eyeShowcaseIndex % eyeShowcaseImages.length];
  const productSystemMiniProducts = useMemo(() => {
    const miniPriority = ["flora", "dahlia", "orchid"];
    const sortedMini = [...storefrontMiniProducts].sort((a, b) => {
      const aIndex = miniPriority.findIndex((item) =>
        a.name.toLocaleLowerCase().includes(item),
      );
      const bIndex = miniPriority.findIndex((item) =>
        b.name.toLocaleLowerCase().includes(item),
      );

      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

    return sortedMini.slice(0, 11);
  }, [storefrontMiniProducts]);
  const productSystemFullProducts = useMemo(
    () => storefrontFullSizeProducts.slice(0, 4),
    [storefrontFullSizeProducts],
  );
  const productSystemMediumProducts = useMemo(
    () =>
      storefrontProducts
        .filter((product) => product.category === CATEGORY_MEDIUM)
        .slice(0, 4),
    [storefrontProducts],
  );
  const nextMiniShowcase = () => {
    if (!miniShowcaseSourceProducts.length) return;
    setMiniShowcaseIndex(
      (index) => (index + 1) % miniShowcaseSourceProducts.length,
    );
  };

  const toggleHowVideo = () => {
    const video = howVideoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      userPausedHowVideoRef.current = false;
      video.play().catch(() => {
        setIsHowVideoPlaying(false);
      });
      return;
    }

    userPausedHowVideoRef.current = true;
    video.pause();
  };

  if (isAdminRoute) {
    return (
      <AdminPanel
        staticProducts={products}
        onProductsChange={(nextProducts) =>
          setStoreProducts(
            nextProducts?.length
              ? ensureDeploySafeProductImages(nextProducts)
              : products,
          )
        }
      />
    );
  }

  return (
    <div id="top" data-container="site-root">
      <HeaderContainer
        LogoComponent={Logo}
        cartCount={cartCount}
        categoryOrder={categoryOrder}
        categoryLabels={categoryLabels}
        categoryAll={CATEGORY_ALL}
        categoryReal={CATEGORY_REAL}
        categoryHow={CATEGORY_HOW}
        categoryMedium={CATEGORY_MEDIUM}
        categoryFull={CATEGORY_FULL}
        megaOpen={megaOpen}
        mobileMenuOpen={mobileMenuOpen}
        storefrontMiniProducts={storefrontMiniProducts}
        onToggleMega={() => setMegaOpen((value) => !value)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onOpenCareer={() => setCareerOpen(true)}
        onOpenToolKit={() => setToolKitOpen(true)}
        onSelectCategory={selectCategory}
        onSelectFeatured={selectFeatured}
        onNavigateHome={() => navigateToRoute("home")}
        onNavigateProducts={() => {
          setMegaOpen(false);
          setCategory(CATEGORY_ALL);
          navigateToRoute("products");
        }}
        getProductFallbackMedia={getProductFallbackMedia}
        swapBrokenImageToFallback={swapBrokenImageToFallback}
      />
      {false ? (
      <>
      <div className="announcement-bar" data-container="announcement-bar" aria-label="โปรโมชั่น">
        <div className="announcement-track" data-container="announcement-marquee-track">
          {[0, 1, 2, 3].map((copy) => (
            <div className="announcement-group" key={copy} aria-hidden={copy > 0}>
              <span>ส่งฟรีทุกออเดอร์ ไม่มีขั้นต่ำ</span>
              <i>★</i>
              <span>2 กล่อง ลดเพิ่ม 10%</span>
              <i>★</i>
              <span>MINI SIZE เพิ่มรุ่นใหม่!</span>
              <i>★</i>
              <span>ขนตาสวยใน 2 นาที</span>
              <i>★</i>
            </div>
          ))}
        </div>
      </div>

      <div className="audience-tabs" data-container="audience-tabs" aria-label="เลือกประสบการณ์">
        <button className="is-active">2MINBOOBOO</button>
        <button onClick={() => setToolKitOpen(true)}>TOOL KIT</button>
        <button onClick={() => selectCategory(CATEGORY_MEDIUM)}>RESELLERS</button>
      </div>

      <header className="site-header tatti-header" data-container="site-header-main">
        <div className="tatti-header-side" data-container="site-header-left-tools">
          <button
            className="header-menu-button"
            onClick={() =>
              window.innerWidth <= 800
                ? setMobileMenuOpen(true)
                : setMegaOpen((value) => !value)
            }
            aria-label="เปิดเมนู"
          >
          </button>
          <button
            className="header-search-box"
            onClick={() => setSearchOpen(true)}
            aria-label="ค้นหาสินค้า"
          >
            <Search size={17} />
            <span>Search lashes, styles, kits...</span>
          </button>
        </div>

        <Logo />

        <nav className="tatti-header-side tatti-header-actions" data-container="site-header-right-actions" aria-label="เมนูบัญชีและตะกร้า">
          <button onClick={() => setSearchOpen(true)} aria-label="ค้นหา">
            <Search />
          </button>
          <button onClick={() => selectFeatured("BEST SELLERS")}>BEST SELLERS</button>
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
          <div className="mega-menu tatti-mega-menu" data-container="mega-menu-shop">
            <div>
              <span>SHOP BY FORMAT</span>
              {categoryOrder
                .filter((item) => item !== CATEGORY_ALL && item !== CATEGORY_REAL && item !== CATEGORY_HOW)
                .map((item) => (
                  <button key={item} onClick={() => selectCategory(item)}>
                    {categoryLabels[item]}
                  </button>
                ))}
            </div>
            <div>
              <span>SHOP BY STYLE</span>
              {["Flora", "Dahlia", "Orchid", "Sakura", "Blooming", "Bangkok Babe"].map(
                (name) => (
                  <a
                    key={name}
                    href="#/products"
                    onClick={() => {
                      setMegaOpen(false);
                      navigateToRoute("products");
                    }}
                  >
                    {name}
                  </a>
                ),
              )}
            </div>
            <div>
              <span>HELP ME CHOOSE</span>
              <a href="#how-to" onClick={() => setMegaOpen(false)}>How to apply</a>
              <a href="#real-looks" onClick={() => setMegaOpen(false)}>Real looks</a>
              <button onClick={() => selectFeatured("BEST SELLERS")}>Best sellers</button>
            </div>
            <button
              className="mega-feature"
              onClick={() => selectCategory("MINI Size")}
            >
              <img
                src={
                  storefrontMiniProducts[0]?.media?.[0]?.src ??
                  storefrontMiniProducts[0]?.image
                }
                alt=""
                onError={(event) =>
                  swapBrokenImageToFallback(
                    event,
                    getProductFallbackMedia(storefrontMiniProducts[0], 0)?.src,
                  )
                }
              />
              <span>
                MINI SIZE SERIES
                <small>ดูคอลเลกชันมินิ</small>
              </span>
            </button>
          </div>
        ) : null}
      </header>

      <nav className="tatti-category-nav" data-container="category-navigation" aria-label="หมวดหมู่สินค้า">
        <button
          className={megaOpen ? "is-active" : ""}
          onClick={() => setMegaOpen((value) => !value)}
        >
          SHOP <ChevronDown size={14} />
        </button>
        <button onClick={() => selectHeaderCategory("MINI Size")}>MINI SIZE</button>
        <button onClick={() => selectHeaderCategory(CATEGORY_MEDIUM)}>MEDIUM SIZE</button>
        <button onClick={() => selectHeaderCategory("Travelsize")}>TRAVEL SIZE</button>
        <button onClick={() => selectHeaderCategory(CATEGORY_FULL)}>FULL SIZE</button>
        <button onClick={() => selectHeaderCategory(CATEGORY_TOOLKIT)}>TOOL KIT</button>
        <button onClick={() => selectFeatured("BEST SELLERS")}>BEST SELLERS</button>
        <button onClick={() => navigateToRoute("products")}>ALL PRODUCTS</button>
        <a href="#how-to">HOW TO</a>
        <a href="#real-looks">REAL LOOKS</a>
      </nav>

      {mobileMenuOpen ? (
        <div className="mobile-menu" data-container="mobile-menu-drawer">
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
          <button
            onClick={() => {
              navigateToRoute("products");
              setMobileMenuOpen(false);
            }}
          >
            สินค้าทั้งหมด
            <ChevronRight />
          </button>
          <a href="#how-to" onClick={() => setMobileMenuOpen(false)}>
            HOW TO
          </a>
          <a href="#real-looks" onClick={() => setMobileMenuOpen(false)}>
            REAL LOOKS
          </a>
        </div>
      ) : null}

      </>
      ) : null}

      {careerOpen ? <CareerModal onClose={() => setCareerOpen(false)} /> : null}
      {toolKitOpen ? (
        <ToolKitModal
          onClose={() => setToolKitOpen(false)}
          onShopAll={() => {
            setCategory(CATEGORY_TOOLKIT);
            setToolKitOpen(false);
            navigateToRoute("products");
          }}
        />
      ) : null}

      {searchOpen ? (
        <SearchOverlay
          products={storefrontProducts}
          onClose={() => setSearchOpen(false)}
          onAdd={addToCart}
        />
      ) : null}

      {cartOpen ? (
        <CartDrawer
          items={cart}
          recommendations={storefrontMiniProducts}
          onClose={() => setCartOpen(false)}
          onIncrease={increaseItem}
          onDecrease={decreaseItem}
          onRemove={(id) =>
            setCart((items) => items.filter((item) => item.id !== id))
          }
          onAdd={addToCart}
        />
      ) : null}

      {currentRoute === "products" ? (
        <ProductListingPage
          products={storefrontProducts}
          activeCategory={category}
          onCategoryChange={setCategory}
          onAdd={addToCart}
          onBackHome={() => navigateToRoute("home")}
        />
      ) : (
      <main data-container="homepage-main">
        <HeroContainer heroImage={heroOrangeProducts} logoImage={heroWhiteLogo} />
        {false ? (
        <section className="hero tatti-hero" data-container="hero-main">
          <img
            className="hero-atmosphere"
            src={heroOrangeProducts}
            alt=""
            aria-hidden="true"
          />
          <div className="hero-copy" data-container="hero-copy">
            <p>NO GLUE • NO MESS • 2 MINUTES</p>
            <img
              className="hero-logo-image"
              src={heroWhiteLogo}
              alt="2minBooBoo"
            />
            <h1>
              <span className="hero-title-line">2Minutes to Love Yourself</span>
              <span className="hero-title-line">Bueaty with No Limits</span>
            </h1>
            <span>ขนตามีกาวในตัว เริ่มต้นจากขนตาปลอมแบบมีกาวในตัว</span>
            <div className="hero-feature-pills" data-container="hero-feature-pills">
              <i>มีกาวในตัว ไม่ต้องใช้กาว • สวยได้ใน 2 นาที</i>
            </div>
          </div>
        </section>
        ) : null}

        <TrustStripContainer />
        {false ? (
        <section className="trust-strip" aria-label="จุดเด่นสินค้า" data-container="trust-strip-benefits">
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
        ) : null}

        <CategoryTilesContainer
          categoryTiles={categoryTiles}
          onSelectCategory={selectCategory}
        />
        {false ? (
        <section className="category-rail tatti-collection-tiles" aria-label="Shop by category" data-container="category-tiles">
          {categoryTiles.map(({ label, note, category: itemCategory, icon: Icon }) => (
            <button key={label} onClick={() => selectCategory(itemCategory)}>
              <Icon />
              <span>{label}</span>
              <small>{note}</small>
            </button>
          ))}
        </section>
        ) : null}

        <section className="lash-explorer" id="best-sellers" data-container="best-sellers-explorer">
          <div className="section-centered-title" data-container="best-sellers-heading">
            <p>SHOP OUR FAVES</p>
            <h2>Trending</h2>
          </div>
          <div className="explorer-tabs" role="tablist" data-container="best-sellers-tabs">
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
          <div
            className={`explorer-controls ${
              featuredRailIsShort ? "is-short" : ""
            }`}
            data-container="best-sellers-carousel-controls"
          >
            <button
              className="explorer-arrow"
              onClick={() => scrollFeatured(-1)}
              aria-label="เลื่อน Explore Our Lashes ไปทางซ้าย"
            >
              <ChevronLeft />
            </button>
            <button
              className="explorer-arrow"
              onClick={() => scrollFeatured(1)}
              aria-label="เลื่อน Explore Our Lashes ไปทางขวา"
            >
              <ChevronRight />
            </button>
          </div>
          <div
            className={`explorer-rail ${
              featuredRailIsShort ? "is-centered" : ""
            }`}
            ref={featuredRailRef}
            data-container="best-sellers-product-carousel"
            aria-label="Explore Our Lashes เลื่อนได้ซ้ายขวา"
            onPointerDown={handleFeaturedPointerDown}
            onPointerMove={handleFeaturedPointerMove}
            onPointerUp={stopFeaturedDrag}
            onPointerCancel={stopFeaturedDrag}
            onPointerLeave={stopFeaturedDrag}
            onClickCapture={handleFeaturedClickCapture}
            onDragStart={(event) => event.preventDefault()}
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                compact
              />
            ))}
          </div>
        </section>

        <BrandMarqueeContainer messages={marqueeMessages} />
        {false ? (
        <section className="brand-marquee" aria-label="จุดเด่นของ 2minBooBoo" data-container="brand-marquee">
          <div className="brand-marquee-track" data-container="brand-marquee-track">
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
        ) : null}

        {activeMiniShowcaseProduct ? (
          <section
            className="tatti-feature-collection"
            data-container="mini-feature-collection"
            style={{ "--series-color": getSeriesColor(activeMiniShowcaseProduct.name) }}
          >
            <button
              className="tatti-feature-banner"
              data-container="mini-feature-large-card"
              onClick={() => selectCategory(activeMiniShowcaseProduct.category)}
            >
              <img
                className="tatti-feature-eye-image"
                src={
                  activeEyeShowcaseImage?.src ??
                  activeMiniShowcaseProduct.media?.[0]?.src ??
                  activeMiniShowcaseProduct.image
                }
                alt={activeEyeShowcaseImage?.alt ?? activeMiniShowcaseProduct.name}
                loading="lazy"
                onError={(event) =>
                  swapBrokenImageToFallback(
                    event,
                    getProductFallbackMedia(activeMiniShowcaseProduct, 0)?.src,
                  )
                }
              />
              <span>
                <em>Discover now</em>
              </span>
            </button>
            <div className="tatti-feature-products" data-container="mini-feature-side-products">
              {miniShowcaseProducts.slice(1, 5).map((product) => (
                <ProductCard
                  key={`feature-${product.id}`}
                  product={product}
                  onAdd={addToCart}
                  compact
                />
              ))}
              <button
                className="tatti-feature-next"
                onClick={nextMiniShowcase}
                aria-label="เลื่อนรุ่น MINI Size ถัดไป"
              >
                <ChevronRight />
              </button>
            </div>
          </section>
        ) : null}

        <section className="campaign-split" data-container="campaign-split-real-look">
          <div className="campaign-media" data-container="campaign-media">
            <img
              src={
                storefrontLifestyleImages.find((product) =>
                  /bangkok/i.test(product.name),
                )?.image ?? storefrontLifestyleImages[0]?.image
              }
              alt="Bangkok Babe real look"
              loading="lazy"
              onError={(event) =>
                swapBrokenImageToFallback(
                  event,
                  getProductFallbackMedia(
                    storefrontLifestyleImages.find((product) =>
                      /bangkok/i.test(product.name),
                    ) ?? storefrontLifestyleImages[0],
                    0,
                  )?.src,
                )
              }
            />
          </div>
          <div className="campaign-copy" data-container="campaign-copy">
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

        <section className="look-selector" id="real-looks" data-container="real-looks-video-collection">
          <div className="section-centered-title" data-container="real-looks-heading">
            <h2>REAL LOOKS</h2>
          </div>
          <div className="look-grid" data-container="real-looks-video-grid">
            {realLookVideos.map((look) => (
              <article key={look.id}>
                <video
                  src={look.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={look.label}
                />
                <div>
                  <h3>{look.label}</h3>
                  <button onClick={() => selectCategory(CATEGORY_REAL)}>
                    SHOP THE LOOK <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how-to" id="how-to" data-container="how-to-section">
          <div className="how-media" ref={howMediaRef} data-container="how-to-video-panel">
            <video
              ref={howVideoRef}
              className="how-video"
              muted
              playsInline
              preload="metadata"
              poster={howToThaiPoster}
              loop
              aria-label="วิธีติดขนตา 2minBooBoo"
            >
              <source src={howToThaiVideo} type="video/mp4" />
            </video>
            <button
              className="how-video-toggle"
              onClick={toggleHowVideo}
              aria-label={isHowVideoPlaying ? "หยุดวิดีโอวิธีใช้" : "เล่นวิดีโอวิธีใช้"}
              aria-pressed={isHowVideoPlaying}
            >
              {isHowVideoPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <img
              src={
                storefrontMiniProducts[1]?.media?.[0]?.src ??
                storefrontMiniProducts[0]?.image
              }
              alt="วิธีติดขนตา 2minBooBoo"
              loading="lazy"
              onError={(event) =>
                swapBrokenImageToFallback(
                  event,
                  getProductFallbackMedia(
                    storefrontMiniProducts[1] ?? storefrontMiniProducts[0],
                    0,
                  )?.src,
                )
              }
            />
            <button aria-label="ดูวิดีโอวิธีใช้">
              <Play fill="currentColor" />
            </button>
          </div>
          <div className="how-copy" data-container="how-to-step-copy">
            {/* <p>THE 2-MINUTE ROUTINE</p> */}
            <h2>ติดง่ายใน 3 ขั้นตอน</h2>
            {[
              ["01", "เลือกทรง", "เลือกความยาวและความฟูให้เข้ากับลุค"],
              ["02", "วางช่อขนตา", "วางใต้แนวขนตาจริงจากหางเข้าหัวตา"],
              ["03", "กดให้แน่น", "ใช้แหนบกดเบา ๆ เท่านี้ก็พร้อมสวย"],
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
            <a
              href="#/products"
              onClick={(event) => {
                event.preventDefault();
                navigateToRoute("products");
              }}
            >
              เริ่มเลือกทรงของคุณ <ArrowRight />
            </a>
          </div>
        </section>

        <section className="review-band" data-container="review-band">
          <div>
            <Stars />
            <blockquote>
              “แบรนด์ขนตาแรกที่ลองใส่นอนค่ำคืน นุ่มบางเบาสบายจริง”
            </blockquote>
            <Stars count={4} />
            <blockquote>
              “ไม่ระคายเคืองใส้ไปเรียนก็ไม่โป๊ะ”
            </blockquote>
            <Stars count={4} />
            <blockquote>
              “พกพาง่ายสามารถเปลี่ยนลุคในห้องน้ำไม่ถึง2นาที”
            </blockquote>
          </div>
          <div className="review-stats">
            <strong>4.9</strong>
            <span>คะแนนเฉลี่ยจากลูกค้าจริง</span>
            <Stars />
          </div>
        </section>
{/* 
        <ProductRail
          title="Best Selling Big Size"
          eyebrow="FULL SIZE"
          items={productSystemFullProducts}
          onAdd={addToCart}
          action={
            <button className="collection-show-all" onClick={() => selectCategory(CATEGORY_FULL)}>
              Shop all
            </button>
          }
        /> */}

        <ProductSystemSection
          miniItems={productSystemMiniProducts}
          mediumItems={productSystemMediumProducts}
          fullItems={productSystemFullProducts}
          onSelectCategory={selectCategory}
        />

        <section className="social-section" data-container="social-proof-gallery">
          <div className="section-centered-title" data-container="social-proof-heading">
            <p>@2MINBOOBOO</p>
            <h2>สวยจริงในทุกวัน</h2>
            <span>แชร์ลุคของคุณกับ #2minBooBoo</span>
          </div>
          <div className="social-grid" data-container="social-proof-grid">
            {socialImages.map((product, index) => (
              <a href="#top" key={`${product.id}-${index}`} aria-label="Instagram">
                <img
                  src={product.media?.[0]?.src ?? product.image}
                  alt=""
                  loading="lazy"
                  onError={(event) =>
                    swapBrokenImageToFallback(
                      event,
                      getProductFallbackMedia(product, 0)?.src,
                    )
                  }
                />
                <Instagram />
              </a>
            ))}
          </div>
        </section>
      </main>
      )}

      <FooterContainer LogoComponent={Logo} />
      {false ? (
      <footer data-container="site-footer">
        <div className="footer-newsletter" data-container="footer-newsletter">
          <p>JOIN THE BOOBOO CLUB</p>
          <h2>รับข่าวทรงใหม่และโปรพิเศษก่อนใคร</h2>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="อีเมล" />
            <button aria-label="สมัครข่าวสาร">
              <ArrowRight />
            </button>
          </form>
        </div>
        <div className="footer-main" data-container="footer-main-links">
          <div>
            <Logo light />
            <p>ขนตาสำหรับทุกวัน ทุกลุค และทุกเวอร์ชันของคุณ</p>
          </div>
          <div>
            <h3>SHOP</h3>
            <a href="#best-sellers">Best Sellers</a>
            <a href="#product-system">Mini Size</a>
            <a href="#/products">All Lashes</a>
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
        <div className="footer-bottom" data-container="footer-bottom-legal">
          <span>© 2026 2minBooBoo</span>
          <strong>“2 minutes, love yourself.”</strong>
          <span>Thailand • No Glue • Beauty with no limits</span>
        </div>
      </footer>
      ) : null}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
