const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const normalize = (value) => String(value || "").toLocaleLowerCase();

const getOriginalPrice = (product) => {
  const name = normalize(product.name);
  const category = normalize(product.category);

  if (category.includes("mini") && !category.includes("medium")) {
    return name.includes("dahlia") ? 129 : 99;
  }

  if (category.includes("medium")) {
    if (/sakura|barbie|babie/.test(name)) return 258;
    if (name.includes("moonlight")) return 318;
    if (/songkran|somgkran/.test(name)) return 376;
  }

  if (
    category.includes("ใหญ่") ||
    category.includes("large") ||
    category.includes("full")
  ) {
    if (name.includes("blooming")) return 378;
    if (/bangkok|hollywood|california/.test(name)) return 318;
  }

  return null;
};

(async () => {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,category,price");

  if (error) throw error;

  let updated = 0;
  for (const product of data ?? []) {
    const originalPrice = getOriginalPrice(product);
    if (!originalPrice) continue;

    const { error: updateError } = await supabase
      .from("products")
      .update({ original_price: originalPrice })
      .eq("id", product.id);

    if (updateError) throw updateError;
    updated += 1;
  }

  console.log(`Synced original_price rows: ${updated}`);
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
