import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

export function HeaderContainer({
  LogoComponent,
  cartCount,
  categoryOrder,
  categoryLabels,
  categoryAll,
  categoryReal,
  categoryHow,
  categoryMedium,
  categoryFull,
  megaOpen,
  mobileMenuOpen,
  storefrontMiniProducts,
  onToggleMega,
  onOpenSearch,
  onOpenCart,
  onOpenMobileMenu,
  onCloseMobileMenu,
  onOpenCareer,
  onOpenToolKit,
  onSelectCategory,
  onSelectFeatured,
  onNavigateHome,
  onNavigateProducts,
  getProductFallbackMedia,
  swapBrokenImageToFallback,
}) {
  const selectableCategories = categoryOrder.filter(
    (item) => item !== categoryAll && item !== categoryReal && item !== categoryHow,
  );
  const mobileCategories = categoryOrder.filter(
    (item) => item !== categoryReal && item !== categoryHow,
  );
  const megaProduct = storefrontMiniProducts[0];
  const [megaClosing, setMegaClosing] = useState(false);
  const megaCloseTimer = useRef(null);
  const showMegaMenu = megaOpen || megaClosing;

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) {
        window.clearTimeout(megaCloseTimer.current);
      }
    };
  }, []);

  const closeMegaMenu = () => {
    if (!megaOpen || megaClosing) {
      return;
    }

    setMegaClosing(true);
    megaCloseTimer.current = window.setTimeout(() => {
      onToggleMega();
      setMegaClosing(false);
      megaCloseTimer.current = null;
    }, 220);
  };

  const selectAndCloseMega = (callback) => {
    callback();
    closeMegaMenu();
  };

  return (
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
        <button className="is-active" onClick={onNavigateHome}>2MINBOOBOO</button>
        <button onClick={onOpenToolKit}>TOOL KIT</button>
        <button onClick={onOpenCareer}>CARRER</button>
      </div>

      <header className="site-header tatti-header" data-container="site-header-main">
        <div className="tatti-header-side" data-container="site-header-left-tools">
          <button
            className="header-menu-button"
            onClick={() =>
              window.innerWidth <= 800 ? onOpenMobileMenu() : onToggleMega()
            }
            aria-label="เปิดเมนู"
          />
          <button
            className="header-search-box"
            onClick={onOpenSearch}
            aria-label="ค้นหาสินค้า"
          >
            <Search size={17} />
            <span>Search lashes, styles, kits...</span>
          </button>
        </div>

        <LogoComponent />

        <nav
          className="tatti-header-side tatti-header-actions"
          data-container="site-header-right-actions"
          aria-label="เมนูบัญชีและตะกร้า"
        >
          <button onClick={onOpenSearch} aria-label="ค้นหา">
            <Search />
          </button>
          <button onClick={() => onSelectFeatured("BEST SELLERS")}>
            BEST SELLERS
          </button>
          <button
            className="bag-button"
            onClick={onOpenCart}
            aria-label={`ตะกร้าสินค้า ${cartCount} ชิ้น`}
          >
            <ShoppingBag />
            <span>{cartCount}</span>
          </button>
        </nav>

        <button
          className="mobile-control mobile-bag"
          onClick={onOpenCart}
          aria-label={`ตะกร้าสินค้า ${cartCount} ชิ้น`}
        >
          <ShoppingBag />
          <span>{cartCount}</span>
        </button>

        {showMegaMenu ? (
          <>
          <button
            type="button"
            className={`mega-menu-backdrop${megaClosing ? " is-closing" : ""}`}
            aria-label="ปิดเมนู Shop"
            onClick={closeMegaMenu}
          />
          <div
            className={`mega-menu tatti-mega-menu${megaClosing ? " is-closing" : ""}`}
            data-container="mega-menu-shop"
          >
            <button
              type="button"
              className="mega-menu-close"
              aria-label="ปิดเมนู Shop"
              onClick={closeMegaMenu}
            >
              <X size={26} strokeWidth={1.8} />
            </button>
            <div>
              <span>SHOP BY FORMAT</span>
              {selectableCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => selectAndCloseMega(() => onSelectCategory(item))}
                >
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
                    onClick={(event) => {
                      event.preventDefault();
                      selectAndCloseMega(onNavigateProducts);
                    }}
                  >
                    {name}
                  </a>
                ),
              )}
            </div>
            <div>
              <span>HELP ME CHOOSE</span>
              <a href="#how-to" onClick={closeMegaMenu}>How to apply</a>
              <a href="#real-looks" onClick={closeMegaMenu}>Real looks</a>
              <button onClick={() => selectAndCloseMega(() => onSelectFeatured("BEST SELLERS"))}>
                Best sellers
              </button>
            </div>
            <button
              className="mega-feature"
              onClick={() => selectAndCloseMega(() => onSelectCategory("MINI Size"))}
            >
              <img
                src={megaProduct?.media?.[0]?.src ?? megaProduct?.image}
                alt=""
                onError={(event) =>
                  swapBrokenImageToFallback(
                    event,
                    getProductFallbackMedia(megaProduct, 0)?.src,
                  )
                }
              />
              <span>
                MINI SIZE SERIES
                <small>ดูคอลเลกชันมินิ</small>
              </span>
            </button>
          </div>
          </>
        ) : null}
      </header>

      <nav className="tatti-category-nav" data-container="category-navigation" aria-label="หมวดหมู่สินค้า">
         <button onClick={() => onSelectFeatured("BEST SELLERS")}>BEST SELLERS</button>
        <button className={megaOpen ? "is-active" : ""} onClick={onToggleMega}>
          SHOP <ChevronDown size={14} />
        </button>
        <button onClick={() => onSelectCategory("MINI Size")}>MINI SIZE</button>
        <button onClick={() => onSelectCategory(categoryMedium)}>MEDIUM SIZE</button>
        <button onClick={() => onSelectCategory(categoryFull)}>LARGE SIZE</button>
        <button onClick={() => onSelectCategory("Travelsize")}>OFFLINE ONLY</button>
        <button onClick={() => onSelectCategory("TOOL KIT")}>TOOL KIT</button>
        <button onClick={onNavigateProducts}>ALL PRODUCTS</button>
        <a href="#how-to">HOW TO</a>
        <a href="#real-looks">REAL LOOKS</a>
      </nav>

      {mobileMenuOpen ? (
        <div className="mobile-menu" data-container="mobile-menu-drawer">
          <div>
            <LogoComponent light />
            <button onClick={onCloseMobileMenu} aria-label="ปิดเมนู">
              <X />
            </button>
          </div>
          {mobileCategories.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelectCategory(item);
                onCloseMobileMenu();
              }}
            >
              {categoryLabels[item]}
              <ChevronRight />
            </button>
          ))}
          <button
            onClick={() => {
              onNavigateProducts();
              onCloseMobileMenu();
            }}
          >
            สินค้าทั้งหมด
            <ChevronRight />
          </button>
          <a href="#how-to" onClick={onCloseMobileMenu}>HOW TO</a>
          <a href="#real-looks" onClick={onCloseMobileMenu}>REAL LOOKS</a>
        </div>
      ) : null}
    </>
  );
}
