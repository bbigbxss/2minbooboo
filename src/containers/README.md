# 2minBooBoo Container Map

โฟลเดอร์นี้เก็บ container component ของหน้าเว็บ เพื่อให้แก้แต่ละส่วนได้ง่ายโดยไม่ต้องไล่หาใน `main.jsx` ทั้งไฟล์

## ไฟล์ container หลัก

- `HeaderContainer.jsx`
  - แถบโปรโมชันด้านบน
  - Navbar
  - Mega menu
  - Category navigation
  - Mobile menu

- `HeroContainer.jsx`
  - Hero section หน้าแรก
  - รูปพื้นหลัง hero
  - โลโก้ hero
  - ข้อความ headline และ feature pill

- `HomeSupportContainers.jsx`
  - `TrustStripContainer` = แถบจุดเด่นสินค้า 3 ช่อง
  - `CategoryTilesContainer` = ปุ่มหมวดหมู่สินค้า
  - `BrandMarqueeContainer` = แถบข้อความเลื่อน

- `FooterContainer.jsx`
  - Newsletter
  - Footer links
  - Copyright / legal bottom

- `index.js`
  - ไฟล์รวม export container ทั้งหมด เพื่อให้ `main.jsx` import ง่ายขึ้น

## วิธีแก้เร็ว

- อยากแก้ Navbar / เมนู / ปุ่มตะกร้า: ไปที่ `HeaderContainer.jsx`
- อยากแก้ Hero หน้าแรก: ไปที่ `HeroContainer.jsx`
- อยากแก้แถบข้อความเลื่อน: ไปที่ `HomeSupportContainers.jsx` แล้วดู `BrandMarqueeContainer`
- อยากแก้ Footer: ไปที่ `FooterContainer.jsx`
