import { SUPABASE_URL, isSupabaseReady, supabase } from "./supabaseClient";

export { isSupabaseReady };

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

export const normalizeDbProduct = (row) => {
  const images = sortByOrder(row.product_images ?? []);
  const media = images.map((image) => ({
    src: image.image_url,
    kind: image.kind || "product",
    flip: Boolean(image.flip),
  }));

  return {
    id: row.id,
    category: row.category,
    image: media[0]?.src ?? "",
    images: media.map((item) => item.src),
    media,
    name: row.name,
    price: Number(row.price ?? 0),
    isNew: Boolean(row.is_new),
    detailLeft: row.detail_left ?? undefined,
    detailRight: row.detail_right ?? undefined,
    sortOrder: row.sort_order ?? 0,
    source: "supabase",
  };
};

export const fetchStorefrontProducts = async () => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("Could not load Supabase products", error);
    return [];
  }

  return (data ?? []).map(normalizeDbProduct);
};

export const loginAdmin = async ({ username, password }) => {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");

  const { data, error } = await supabase.rpc("admin_login", {
    p_username: username,
    p_password: password,
  });

  if (error) throw error;
  return data;
};

export const logoutAdmin = async (token) => {
  if (!supabase || !token) return;
  await supabase.rpc("admin_logout", { p_token: token });
};

export const saveAdminProduct = async (token, product) => {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");

  const { data, error } = await supabase.rpc("admin_upsert_product", {
    p_token: token,
    p_id: product.id,
    p_name: product.name,
    p_category: product.category,
    p_price: Number(product.price || 0),
    p_detail_left: product.detailLeft || null,
    p_detail_right: product.detailRight || null,
    p_is_new: Boolean(product.isNew),
    p_is_active: product.isActive !== false,
    p_sort_order: Number(product.sortOrder || 0),
  });

  if (error) throw error;
  return data;
};

export const saveAdminProductImageUrl = async (
  token,
  productId,
  imageUrl,
  options = {},
) => {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");

  const { data, error } = await supabase.rpc("admin_replace_product_image", {
    p_token: token,
    p_product_id: productId,
    p_image_url: imageUrl,
    p_kind: options.kind || "product",
    p_sort_order: Number(options.sortOrder || 0),
    p_flip: Boolean(options.flip),
  });

  if (error) throw error;
  return data;
};

export const uploadAdminProductImage = async (
  token,
  productId,
  file,
  options = {},
) => {
  if (!SUPABASE_URL) throw new Error("ยังไม่ได้ตั้งค่า Supabase URL");

  const formData = new FormData();
  formData.append("token", token);
  formData.append("product_id", productId);
  formData.append("file", file);
  formData.append("kind", options.kind || "product");
  formData.append("sort_order", String(Number(options.sortOrder || 0)));
  formData.append("flip", String(Boolean(options.flip)));

  const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-upload-product-image`, {
    method: "POST",
    body: formData,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "อัปโหลดรูปไม่สำเร็จ");
  }

  return payload;
};

export const hideAdminProduct = async (token, productId) => {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");

  const { error } = await supabase.rpc("admin_delete_product", {
    p_token: token,
    p_product_id: productId,
  });

  if (error) throw error;
};

export const importStaticCatalog = async (token, staticProducts) => {
  for (const [index, product] of staticProducts.entries()) {
    await saveAdminProduct(token, {
      ...product,
      detailLeft: product.detailLeft,
      detailRight: product.detailRight,
      isActive: true,
      sortOrder: index,
    });

    for (const [mediaIndex, mediaItem] of (product.media ?? []).entries()) {
      await saveAdminProductImageUrl(token, product.id, mediaItem.src, {
        kind: mediaItem.kind || "product",
        flip: Boolean(mediaItem.flip),
        sortOrder: mediaIndex,
      });
    }
  }
};
