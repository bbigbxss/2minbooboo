import React from "react";
import { Clock3, RefreshCw, ShieldCheck } from "lucide-react";

export function TrustStripContainer() {
  return (
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
  );
}

export function CategoryTilesContainer({ categoryTiles, onSelectCategory }) {
  return (
    <section className="category-rail tatti-collection-tiles" aria-label="Shop by category" data-container="category-tiles">
      {categoryTiles.map(({ label, note, category: itemCategory, icon: Icon }) => (
        <button key={label} onClick={() => onSelectCategory(itemCategory)}>
          <Icon />
          <span>{label}</span>
          <small>{note}</small>
        </button>
      ))}
    </section>
  );
}

export function BrandMarqueeContainer({ messages }) {
  return (
    <section className="brand-marquee" aria-label="จุดเด่นของ 2minBooBoo" data-container="brand-marquee">
      <div className="brand-marquee-track" data-container="brand-marquee-track">
        {[0, 1, 2, 3].map((copy) => (
          <div className="brand-marquee-group" key={copy} aria-hidden={copy > 0}>
            {messages.map((message) => (
              <React.Fragment key={`${copy}-${message}`}>
                <span>{message}</span>
                <i>•</i>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
