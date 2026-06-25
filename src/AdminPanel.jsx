import React, { useEffect, useMemo, useState } from "react";
import {
  fetchStorefrontProducts,
  hideAdminProduct,
  importStaticCatalog,
  isSupabaseReady,
  loginAdmin,
  logoutAdmin,
  saveAdminProduct,
  saveAdminProductImageUrl,
  uploadAdminProductImage,
} from "./supabaseProducts";

const ADMIN_TOKEN_KEY = "2minbooboo_admin_token";

const emptyProduct = {
  id: "",
  name: "",
  category: "New MINI Size",
  price: 229,
  detailLeft: "",
  detailRight: "",
  isNew: true,
  isActive: true,
  sortOrder: 0,
  media: [],
};

function ProductForm({
  product,
  onChange,
  imageIndex,
  onImageIndexChange,
  imageUrl,
  onImageUrlChange,
  file,
  onFileChange,
  saving,
  onSave,
  onHide,
}) {
  const media = product?.media ?? [];

  return (
    <form className="admin-editor-card" onSubmit={onSave}>
      <div className="admin-editor-head">
        <div>
          <p>แก้ไขสินค้า</p>
          <h2>{product?.name || "สินค้าใหม่"}</h2>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึกสินค้า"}
        </button>
      </div>

      <div className="admin-form-grid">
        <label>
          Product ID
          <input
            value={product.id}
            onChange={(event) => onChange({ ...product, id: event.target.value })}
            placeholder="เช่น new-mini-flora"
            required
          />
        </label>
        <label>
          ชื่อสินค้า
          <input
            value={product.name}
            onChange={(event) =>
              onChange({ ...product, name: event.target.value })
            }
            required
          />
        </label>
        <label>
          หมวดหมู่
          <select
            value={product.category}
            onChange={(event) =>
              onChange({ ...product, category: event.target.value })
            }
          >
            <option>New MINI Size</option>
            <option>MINI Size</option>
            <option>Travelsize</option>
            <option>กล่องใหญ่</option>
            <option>ขนตาเดี่ยว</option>
            <option>คนใส่จริง</option>
            <option>แบบใส่ก้าน</option>
          </select>
        </label>
        <label>
          ราคา
          <input
            type="number"
            value={product.price}
            onChange={(event) =>
              onChange({ ...product, price: Number(event.target.value) })
            }
          />
        </label>
        <label>
          รายละเอียดซ้าย
          <input
            value={product.detailLeft || ""}
            onChange={(event) =>
              onChange({ ...product, detailLeft: event.target.value })
            }
            placeholder="Everyday Lash"
          />
        </label>
        <label>
          รายละเอียดขวา
          <input
            value={product.detailRight || ""}
            onChange={(event) =>
              onChange({ ...product, detailRight: event.target.value })
            }
            placeholder="12 mm"
          />
        </label>
        <label>
          ลำดับ
          <input
            type="number"
            value={product.sortOrder || 0}
            onChange={(event) =>
              onChange({ ...product, sortOrder: Number(event.target.value) })
            }
          />
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={Boolean(product.isNew)}
            onChange={(event) =>
              onChange({ ...product, isNew: event.target.checked })
            }
          />
          แสดงป้าย NEW
        </label>
      </div>

      <div className="admin-image-editor">
        <div>
          <p>เลือกรูปที่ต้องการแก้</p>
          <div className="admin-image-strip">
            {(media.length ? media : [{ src: "" }]).map((item, index) => (
              <button
                type="button"
                key={`${item.src || "blank"}-${index}`}
                className={imageIndex === index ? "is-active" : ""}
                onClick={() => onImageIndexChange(index)}
              >
                {item.src ? <img src={item.src} alt="" /> : <span>+</span>}
                <small>รูป {index + 1}</small>
              </button>
            ))}
          </div>
        </div>
        <label>
          URL รูป
          <input
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
            placeholder="วาง URL รูป หรืออัปโหลดไฟล์ด้านล่าง"
          />
        </label>
        <label>
          อัปโหลดรูปใหม่
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
        <div className="admin-preview">
          {file ? (
            <img src={URL.createObjectURL(file)} alt="" />
          ) : imageUrl ? (
            <img src={imageUrl} alt="" />
          ) : (
            <span>ยังไม่มีรูป</span>
          )}
        </div>
      </div>

      <div className="admin-danger-zone">
        <button type="button" onClick={onHide}>
          ซ่อนสินค้านี้
        </button>
        <span>ซ่อนแล้วหน้าร้านจะไม่แสดง แต่ข้อมูลยังอยู่ในฐานข้อมูล</span>
      </div>
    </form>
  );
}

export default function AdminPanel({ staticProducts, onProductsChange }) {
  const [token, setToken] = useState(
    () => window.localStorage.getItem(ADMIN_TOKEN_KEY) || "",
  );
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "" });
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(emptyProduct);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId),
    [products, selectedId],
  );

  const loadProducts = async () => {
    const remoteProducts = await fetchStorefrontProducts();
    setProducts(remoteProducts);
    onProductsChange?.(remoteProducts.length ? remoteProducts : staticProducts);
    if (!selectedId && remoteProducts[0]) {
      setSelectedId(remoteProducts[0].id);
    }
  };

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  useEffect(() => {
    if (!selectedProduct) return;
    setDraft({
      ...emptyProduct,
      ...selectedProduct,
      detailLeft: selectedProduct.detailLeft || "",
      detailRight: selectedProduct.detailRight || "",
      sortOrder: selectedProduct.sortOrder || 0,
      isActive: true,
    });
    setImageIndex(0);
    setImageUrl(selectedProduct.media?.[0]?.src ?? selectedProduct.image ?? "");
    setFile(null);
  }, [selectedProduct]);

  useEffect(() => {
    setImageUrl(draft.media?.[imageIndex]?.src ?? "");
    setFile(null);
  }, [imageIndex]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const nextToken = await loginAdmin(loginForm);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, nextToken);
      setToken(nextToken);
      setMessage("ล็อกอินสำเร็จ");
    } catch (error) {
      setMessage(error.message || "ล็อกอินไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin(token);
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setProducts([]);
    setSelectedId("");
  };

  const handleImport = async () => {
    setBusy(true);
    setMessage("กำลังนำเข้าสินค้าจากหน้าเว็บเดิม...");
    try {
      await importStaticCatalog(token, staticProducts);
      await loadProducts();
      setMessage("นำเข้าสินค้าเดิมเข้า Supabase แล้ว");
    } catch (error) {
      setMessage(error.message || "นำเข้าสินค้าไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await saveAdminProduct(token, draft);
      if (file) {
        await uploadAdminProductImage(token, draft.id, file, {
          kind: draft.media?.[imageIndex]?.kind || "product",
          flip: Boolean(draft.media?.[imageIndex]?.flip),
          sortOrder: imageIndex,
        });
      } else if (imageUrl) {
        await saveAdminProductImageUrl(token, draft.id, imageUrl, {
          kind: draft.media?.[imageIndex]?.kind || "product",
          flip: Boolean(draft.media?.[imageIndex]?.flip),
          sortOrder: imageIndex,
        });
      }
      await loadProducts();
      setSelectedId(draft.id);
      setMessage("บันทึกสำเร็จ");
    } catch (error) {
      setMessage(error.message || "บันทึกไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  const handleHide = async () => {
    if (!draft.id) return;
    setBusy(true);
    try {
      await hideAdminProduct(token, draft.id);
      await loadProducts();
      setMessage("ซ่อนสินค้าแล้ว");
    } catch (error) {
      setMessage(error.message || "ซ่อนสินค้าไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseReady) {
    return (
      <main className="admin-page">
        <section className="admin-login-card">
          <h1>ยังไม่ได้ตั้งค่า Supabase</h1>
          <p>กรุณาเพิ่ม VITE_SUPABASE_URL และ VITE_SUPABASE_PUBLISHABLE_KEY ในไฟล์ .env.local</p>
        </section>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="admin-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <p>2minBooBoo Admin</p>
          <h1>เข้าสู่ระบบหลังบ้าน</h1>
          <label>
            Username
            <input
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm({ ...loginForm, username: event.target.value })
              }
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm({ ...loginForm, password: event.target.value })
              }
              autoComplete="current-password"
              placeholder="123456"
            />
          </label>
          <button disabled={busy}>{busy ? "กำลังเข้า..." : "Login"}</button>
          {message ? <span>{message}</span> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <p>2minBooBoo Backend</p>
          <h1>จัดการสินค้าและรูปภาพ</h1>
        </div>
        <div>
          <a href={import.meta.env.BASE_URL || "/"}>กลับหน้าร้าน</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {message ? <div className="admin-message">{message}</div> : null}

      <section className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className="admin-import-button"
            onClick={handleImport}
            disabled={busy}
          >
            {products.length ? "Sync สินค้าเดิมอีกครั้ง" : "นำเข้าสินค้าจากเว็บเดิม"}
          </button>
          <button
            className="admin-new-button"
            onClick={() => {
              setSelectedId("");
              setDraft({
                ...emptyProduct,
                id: `product-${Date.now()}`,
                sortOrder: products.length,
              });
              setImageIndex(0);
              setImageUrl("");
              setFile(null);
            }}
          >
            + เพิ่มสินค้าใหม่
          </button>
          <div className="admin-product-list">
            {products.map((product) => (
              <button
                key={product.id}
                className={product.id === selectedId ? "is-active" : ""}
                onClick={() => setSelectedId(product.id)}
              >
                <img src={product.media?.[0]?.src || product.image} alt="" />
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <ProductForm
          product={draft}
          onChange={setDraft}
          imageIndex={imageIndex}
          onImageIndexChange={setImageIndex}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          file={file}
          onFileChange={setFile}
          saving={busy}
          onSave={handleSave}
          onHide={handleHide}
        />
      </section>
    </main>
  );
}
