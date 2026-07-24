import React from "react";
import { ArrowRight } from "lucide-react";

export function FooterContainer({ LogoComponent }) {
  return (
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
          <LogoComponent light />
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
          <a href="https://lin.ee/PxDSbDy">Contact Us</a>
          <a href="#how-to">How to use</a>
          <a href="#real-looks">Real looks</a>
          <a href="https://lin.ee/PxDSbDy">7-Day Returns for Defective Items</a>
        </div>
        <div>
          <h3>FOLLOW</h3>
          <a href="https://www.instagram.com/2minbooboo_official?igsh=c2d2ZHB4YzN0NGc1">Instagram</a>
          <a href="https://www.tiktok.com/@2minbooboo?is_from_webapp=1&sender_device=pc">TikTok</a>
          <a href="https://shopee.co.th/2minbooboo">Shopee</a>
        </div>
      </div>

      <div className="footer-bottom" data-container="footer-bottom-legal">
        <span>© 2026 2minBooBoo</span>
        <strong>“2 minutes, love yourself.”</strong>
        <span>Thailand • No Glue • Beauty with no limits</span>
      </div>
    </footer>
  );
}
