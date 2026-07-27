import React from "react";

export function HeroContainer({ heroImage, logoImage }) {
  return (
    <section className="hero tatti-hero" data-container="hero-main">
      <img
        className="hero-atmosphere"
        src={heroImage}
        alt=""
        aria-hidden="true"
      />
      <div className="hero-copy" data-container="hero-copy">
        <p>NO GLUE • NO MESS • 2 MINUTES</p>
        <img
          className="hero-logo-image"
          src={logoImage}
          alt="2minBooBoo"
        />
        <h1>
          <span className="hero-title-line">2Minutes to Love Yourself</span>
          <span className="hero-title-line">Beauty with No Limits</span>
        </h1>
        {/* <span>มีกาวในตัว ติดปุ๊บสวยปั๊บ ภายใน 2 นาที</span> */}
        <div className="hero-feature-pills" data-container="hero-feature-pills">
          <h2><i>มีกาวในตัว ติดปุ๊บสวยปั๊บ ภายใน 2 นาที</i></h2>
        </div>
      </div>
    </section>
  );
}
