// FARRELL CLOTHING ADMIN DASHBOARD
const SUPABASE_URL =
  "https://fncmvimsrdawvaapspyt.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_8IVztGk6akNofrqgnci04g_HekLzPZ3";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const ORDER_STATUSES = ["Order Received", "Processing", "Shipped", "Delivered", "Cancelled"];
let allOrders = [];
let allProducts = [];
let saleSettings = null;
let currentAdminUser = null;
const MAIN_ADMIN_UID = "d013b022-ae5f-4df3-b11c-bf5ccb6dc1fb";
let selectedSaleProductIds = new Set();

const $ = id => document.getElementById(id);
const money = value => "₱" + Number(value || 0).toLocaleString("en-PH", {minimumFractionDigits: 2, maximumFractionDigits: 2});
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

function showMessage(id, message, type="success") {
  const el = $(id);
  if (!el) return;
  el.textContent = message;
  el.className = "admin-message " + type;
}
function hideMessage(id) {
  const el = $(id);
  if (el) { el.textContent = ""; el.className = "admin-message"; }
}

async function adminLogin() {
  const email = $("admin-email").value.trim();
  const password = $("admin-password").value;
  $("admin-login-error").textContent = "";
  if (!email || !password) { $("admin-login-error").textContent = "Enter your email and password."; return; }
  const {data, error} = await db.auth.signInWithPassword({email, password});
  if (error || !data.user) { $("admin-login-error").textContent = error?.message || "Login failed."; return; }
  await checkAdminAndLoad();
}

async function adminLogout() {
  await db.auth.signOut();
  $("admin-dashboard").classList.add("hidden");
  $("admin-login-screen").classList.remove("hidden");
  $("admin-logout-btn").classList.add("hidden");
}

async function checkAdminAndLoad() {
  const {data:{user}} = await db.auth.getUser();
  if (!user) return;
  currentAdminUser = user;
  const {data:profile, error} = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error || profile?.role !== "admin") {
    $("admin-login-error").textContent = "This account does not have admin access. Set profiles.role to admin for this account.";
    await db.auth.signOut();
    return;
  }
  $("admin-login-screen").classList.add("hidden");
  $("admin-dashboard").classList.remove("hidden");
  $("admin-logout-btn").classList.remove("hidden");
  $("main-admin-tab-button").classList.toggle("hidden", user.id !== MAIN_ADMIN_UID);
  await Promise.all([loadOrders(), loadProducts(), loadSaleSettings(), loadCustomDesigns(), loadSubscriptions()]);
  db.channel("farrell-admin-live")
    .on("postgres_changes",{event:"*",schema:"public",table:"orders"},loadOrders)
    .on("postgres_changes",{event:"*",schema:"public",table:"order_items"},loadOrders)
    .on("postgres_changes",{event:"*",schema:"public",table:"products"},loadProducts)
    .subscribe();
}

function showAdminTab(tab) {
  ["orders","products","sale","designs","subscribers","access"].forEach(name => $("tab-"+name).classList.toggle("hidden", name !== tab));
  document.querySelectorAll(".admin-nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
}

async function loadOrders() {
  const {data, error} = await db.from("orders").select("*").order("created_at",{ascending:false});
  if (error) { $("admin-orders-list").innerHTML = `<p class="admin-empty">Could not load orders: ${escapeHTML(error.message)}</p>`; return; }
  const ids = (data || []).map(o => o.id);
  let items = [];
  if (ids.length) {
    const result = await db.from("order_items").select("*").in("order_id",ids);
    if (result.error) { $("admin-orders-list").innerHTML = `<p class="admin-empty">Could not load order items: ${escapeHTML(result.error.message)}</p>`; return; }
    items = result.data || [];
  }
  allOrders = (data || []).map(order => ({...order, items:items.filter(item => String(item.order_id) === String(order.id))}));
  renderStats();
  renderOrders();
}

function renderStats() {
  const pending = allOrders.filter(o => !["Delivered","Cancelled"].includes(o.status)).length;
  const delivered = allOrders.filter(o => o.status === "Delivered").length;
  const revenue = allOrders.filter(o => o.status !== "Cancelled").reduce((sum,o) => sum + Number(o.total || 0),0);
  const lowStock = allProducts.filter(p => Number(p.stock || 0) <= 5 && p.is_active !== false).length;
  $("admin-stats").innerHTML = `
    <div class="admin-stat"><strong>${allOrders.length}</strong><span>TOTAL ORDERS</span></div>
    <div class="admin-stat"><strong>${pending}</strong><span>ACTIVE ORDERS</span></div>
    <div class="admin-stat"><strong>${delivered}</strong><span>DELIVERED</span></div>
    <div class="admin-stat"><strong>${money(revenue)}</strong><span>ORDER REVENUE</span></div>
    <div class="admin-stat"><strong>${lowStock}</strong><span>LOW STOCK ITEMS</span></div>`;
}

function badgeClass(status) {
  return {"Processing":"badge-processing","Shipped":"badge-shipped","Delivered":"badge-delivered","Cancelled":"badge-cancelled"}[status] || "badge-received";
}

function renderOrders() {
  const query = ($("order-search")?.value || "").toLowerCase().trim();
  const status = $("order-filter")?.value || "All";
  const showArchived = $("show-archived-orders")?.checked;
  const filtered = allOrders.filter(o => {
    if (!!o.archived_at !== !!showArchived) return false;
    const matchesStatus = status === "All" || o.status === status;
    const matchesQuery = !query || [o.order_id,o.name,o.contact,o.address].some(v => String(v || "").toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });
  if (!filtered.length) { $("admin-orders-list").innerHTML = '<p class="admin-empty">No orders found.</p>'; return; }
  $("admin-orders-list").innerHTML = filtered.map(order => {
    const itemHTML = order.items.map(item => `<div class="admin-item-line">${escapeHTML(item.product_name || "Product")} · ${escapeHTML(item.size || "No size")} × ${Number(item.quantity || 0)} · ${money(item.price)}${item.custom_design_id ? " · ✦ Custom design" : ""}</div>`).join("");
    const options = ORDER_STATUSES.map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`).join("");
    return `<article class="admin-order-card">
      <div class="admin-order-top"><h3>${escapeHTML(order.order_id || "Order")}</h3><span class="admin-badge ${badgeClass(order.status)}">${escapeHTML(order.status || "Order Received")}</span></div>
      <p><b>Customer:</b> ${escapeHTML(order.name)}</p><p><b>Contact:</b> ${escapeHTML(order.contact)}</p>
      <p><b>Address:</b> ${escapeHTML(order.address)}</p><p><b>Payment:</b> ${escapeHTML(order.payment)}</p>
      <p><b>Total:</b> ${money(order.total)}</p><p><b>Date:</b> ${order.created_at ? new Date(order.created_at).toLocaleString() : "—"}</p>
      <div style="margin-top:10px"><b style="font-size:12px;color:#7ceeff">ORDER ITEMS</b>${itemHTML || '<p>No item details found.</p>'}</div>
      <label style="display:block;margin-top:12px;font-size:11px;color:#a9c8df;font-weight:800">UPDATE ORDER STATUS</label>
      <select class="admin-status-select" onchange="updateOrderStatus(${Number(order.id)},this.value)" ${order.archived_at ? "disabled" : ""}>${options}</select>
      <div class="product-admin-actions"><button class="${order.archived_at ? "primary-btn" : "danger-btn"}" onclick="archiveOrder(${Number(order.id)},${!order.archived_at})">${order.archived_at ? "Restore Order" : "Archive Order"}</button></div>
    </article>`;
  }).join("");
}

async function updateOrderStatus(id, status) {
  if (!ORDER_STATUSES.includes(status)) return;
  const {error} = await db.from("orders").update({status}).eq("id",id);
  if (error) { alert("Could not update order: " + error.message); return; }
  await loadOrders();
}

async function loadProducts() {
  const {data,error} = await db.from("products").select("*").order("id",{ascending:true});
  if (error) { $("admin-products-list").innerHTML = `<p class="admin-empty">Could not load products: ${escapeHTML(error.message)}</p>`; return; }
  allProducts = data || [];
  renderStats();
  renderProducts();
  renderSaleProductPicker();
}

function renderProducts() {
  const query = ($("product-search")?.value || "").toLowerCase().trim();
  const filter = $("product-filter")?.value || "All";
  const rows = allProducts.filter(p => {
    const active = p.is_active !== false;
    const matchesQuery = !query || `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(query);
    const matchesFilter = filter === "All" || (filter === "active" && active) || (filter === "inactive" && !active) || (filter === "low" && active && Number(p.stock || 0) <= 5);
    return matchesQuery && matchesFilter;
  });
  if (!rows.length) { $("admin-products-list").innerHTML = '<p class="admin-empty">No products found.</p>'; return; }
  $("admin-products-list").innerHTML = rows.map(p => `
    <article class="product-admin-card">
      <img src="${escapeHTML(p.image || "images/item1.png")}" alt="" onerror="this.src='images/item1.png'">
      <div><h3>${escapeHTML(p.name)}</h3><p>ID #${p.id} · ${escapeHTML(p.category)}</p>
      <p>${money(p.price)} ${p.old_price ? `<span style="text-decoration:line-through;color:#7c93a6">${money(p.old_price)}</span>` : ""}</p>
      <p>Stock: <b>${Number(p.stock || 0)}</b> · Rating: ${Number(p.rating || 0).toFixed(1)}</p>
      <p>${p.is_active === false ? "ARCHIVED" : Number(p.stock || 0) <= 5 ? "LOW STOCK" : "ACTIVE"}</p>
      <div class="product-admin-actions"><button class="secondary-btn" onclick="editProduct(${p.id})">Edit</button>
      <button class="${p.is_active === false ? "primary-btn" : "danger-btn"}" onclick="toggleProductActive(${p.id},${p.is_active === false})">${p.is_active === false ? "Restore" : "Archive"}</button></div></div>
    </article>`).join("");
}

function openProductForm(product=null) {
  hideMessage("product-form-message");
  $("product-form").reset();
  $("product-id").value = product?.id || "";
  $("product-form-title").textContent = product ? "EDIT PRODUCT" : "ADD PRODUCT";
  $("product-name").value = product?.name || "";
  $("product-price").value = product?.price ?? "";
  $("product-old-price").value = product?.old_price ?? "";
  $("product-category").value = product?.category || "Shirts";
  $("product-rating").value = product?.rating ?? 5;
  $("product-stock").value = product?.stock ?? 0;
  $("product-image").value = product?.image || "";
  $("product-modal").classList.remove("hidden");
}
function closeProductForm() { $("product-modal").classList.add("hidden"); }
function editProduct(id) { const p = allProducts.find(x => Number(x.id) === Number(id)); if (p) openProductForm(p); }

async function saveProduct(event) {
  event.preventDefault();
  hideMessage("product-form-message");
  const id = $("product-id").value;
  const row = {
    name:$("product-name").value.trim(),
    price:Number($("product-price").value),
    old_price:$("product-old-price").value === "" ? null : Number($("product-old-price").value),
    category:$("product-category").value,
    rating:Number($("product-rating").value || 0),
    stock:Number($("product-stock").value),
    image:$("product-image").value.trim() || "images/item1.png",
    is_active:true
  };
  if (!row.name || !Number.isFinite(row.price) || row.price < 0 || !Number.isInteger(row.stock) || row.stock < 0) {
    showMessage("product-form-message","Check product name, price, and stock values.","error"); return;
  }
  let result;
  if (id) {
    delete row.is_active;
    result = await db.from("products").update(row).eq("id",Number(id));
  } else {
    result = await db.from("products").insert(row);
  }
  if (result.error) { showMessage("product-form-message",result.error.message,"error"); return; }
  closeProductForm();
  await loadProducts();
  showAdminTab("products");
}
async function toggleProductActive(id, restore) {
  const action = restore ? "restore" : "archive";
  if (!confirm(`Are you sure you want to ${action} this product? Archived products are hidden from the store but retained for order history.`)) return;
  const {error} = await db.from("products").update({is_active:restore}).eq("id",id);
  if (error) { alert("Could not update product: " + error.message); return; }
  await loadProducts();
}

async function loadSaleSettings() {
  const {data,error} = await db.from("sale_settings").select("*").eq("id",1).maybeSingle();
  if (error) { $("sale-current-status").textContent = "Settings unavailable: " + error.message; return; }
  saleSettings = data;
  await loadSaleProducts();
  if (!data) { $("sale-current-status").textContent = "Not configured"; return; }
  const end = data.ends_at ? new Date(data.ends_at) : null;
  const active = data.is_active && end && end.getTime() > Date.now();
  $("sale-current-status").textContent = active ? "ACTIVE — ends " + end.toLocaleString() : "INACTIVE / EXPIRED";
  if (end) {
    const local = new Date(end.getTime() - end.getTimezoneOffset()*60000).toISOString().slice(0,16);
    $("sale-end-at").value = local;
  }
}
async function saveSaleSettings(isActive, endsAt) {
  const {data:{user}} = await db.auth.getUser();
  const row = {id:1,is_active:isActive,ends_at:endsAt,updated_at:new Date().toISOString(),updated_by:user?.id || null};
  const {error} = await db.from("sale_settings").upsert(row,{onConflict:"id"});
  if (error) { showMessage("sale-message",error.message,"error"); return false; }
  await loadSaleSettings();
  showMessage("sale-message",isActive ? "Sale timer updated successfully." : "Sale has been ended.");
  return true;
}
async function startSale() {
  hideMessage("sale-message");
  let end;
  if ($("sale-end-at").value) end = new Date($("sale-end-at").value);
  else {
    const hours = Number($("sale-duration").value);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 720) { showMessage("sale-message","Enter a duration from 0.1 to 720 hours.","error"); return; }
    end = new Date(Date.now() + hours*3600000);
  }
  if (Number.isNaN(end.getTime()) || end.getTime() <= Date.now()) { showMessage("sale-message","Choose an end time in the future.","error"); return; }
  await saveSaleSettings(true,end.toISOString());
}
async function stopSale() {
  hideMessage("sale-message");
  if (!confirm("End the flash sale now?")) return;
  await saveSaleSettings(false,new Date().toISOString());
}


async function archiveOrder(id, archive) {
  const action = archive ? "archive" : "restore";
  if (!confirm(`Are you sure you want to ${action} this order? Order history and items will be retained.`)) return;
  const { error } = await db.from("orders").update({ archived_at: archive ? new Date().toISOString() : null }).eq("id", id);
  if (error) { alert(`Could not ${action} order: ` + error.message); return; }
  await loadOrders();
}

function renderSaleProductPicker() {
  const el = $("sale-products-picker");
  if (!el) return;
  const active = allProducts.filter(p => p.is_active !== false);
  if (!active.length) { el.innerHTML = '<p class="admin-empty">No active products.</p>'; return; }
  el.innerHTML = active.map(p => `<label class="product-admin-card" style="cursor:pointer">
    <img src="${escapeHTML(p.image || "images/item1.png")}" alt="">
    <div><b>${escapeHTML(p.name)}</b><p>ID #${p.id} · ${money(p.price)}</p>
    <label style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" class="sale-product-check" value="${Number(p.id)}" ${selectedSaleProductIds.has(Number(p.id)) ? "checked" : ""} style="width:auto"> Include in Flash Sale</label></div>
  </label>`).join("");
}

async function loadSaleProducts() {
  const { data, error } = await db.from("sale_products").select("product_id");
  if (error) { showMessage("sale-message", "Could not load selected products: " + error.message, "error"); return; }
  selectedSaleProductIds = new Set((data || []).map(x => Number(x.product_id)));
  renderSaleProductPicker();
}

async function saveSaleProducts() {
  hideMessage("sale-message");
  const ids = [...document.querySelectorAll(".sale-product-check:checked")].map(x => Number(x.value));
  if (ids.length > 8) { showMessage("sale-message", "Choose up to 8 Flash Sale products.", "error"); return; }
  const { error: deleteError } = await db.from("sale_products").delete().gte("product_id", 0);
  if (deleteError) { showMessage("sale-message", deleteError.message, "error"); return; }
  if (ids.length) {
    const { error } = await db.from("sale_products").insert(ids.map((product_id, sort_order) => ({ product_id, sort_order })));
    if (error) { showMessage("sale-message", error.message, "error"); return; }
  }
  selectedSaleProductIds = new Set(ids);
  showMessage("sale-message", "Flash Sale products saved.");
}

async function loadCustomDesigns() {
  const el = $("admin-designs-list");
  if (!el) return;
  const { data, error } = await db.from("custom_designs").select("*, products(name)").order("created_at", {ascending:false}).limit(100);
  if (error) { el.innerHTML = `<p class="admin-empty">Could not load designs: ${escapeHTML(error.message)}</p>`; return; }
  if (!data?.length) { el.innerHTML = '<p class="admin-empty">No customer designs found.</p>'; return; }
  const cards = await Promise.all(data.map(async d => {
    const getPreview = async path => {
      if (!path) return "";
      const { data: signed } = await db.storage.from("custom-designs").createSignedUrl(path, 3600);
      return signed?.signedUrl || "";
    };
    const [front, back] = await Promise.all([getPreview(d.front_preview_path), getPreview(d.back_preview_path)]);
    return `<article class="admin-order-card"><h3>${escapeHTML(d.products?.name || "Custom product")}</h3><p>Design ID: ${escapeHTML(d.id)}</p><p>Status: ${escapeHTML(d.status || "saved")}</p><p>Customer UID: ${escapeHTML(d.user_id || "—")}</p>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px">${front ? `<div><small>FRONT</small><img src="${front}" alt="Front design" style="width:100%;border-radius:10px"></div>` : ""}${back ? `<div><small>BACK</small><img src="${back}" alt="Back design" style="width:100%;border-radius:10px"></div>` : ""}</div>
    </article>`;
  }));
  el.innerHTML = cards.join("");
}

async function loadSubscriptions() {
  const el = $("admin-subscriptions-list");
  if (!el) return;
  const { data, error } = await db.from("subscriptions").select("*").order("created_at", {ascending:false});
  if (error) { el.innerHTML = `<p class="admin-empty">Could not load subscriptions: ${escapeHTML(error.message)}</p>`; return; }
  if (!data?.length) { el.innerHTML = '<p class="admin-empty">No subscription requests yet.</p>'; return; }
  el.innerHTML = data.map(s => `<article class="admin-order-card"><h3>${escapeHTML(s.email)}</h3><p>User ID: ${escapeHTML(s.user_id)}</p><p>Status: <b>${escapeHTML(s.status)}</b></p><p>Requested: ${new Date(s.created_at).toLocaleString()}</p>
    ${s.status === "pending" ? `<div class="product-admin-actions"><button class="primary-btn" onclick="reviewSubscription(${Number(s.id)},'approved')">Approve 10% Discount</button><button class="danger-btn" onclick="reviewSubscription(${Number(s.id)},'rejected')">Reject</button></div>` : ""}</article>`).join("");
}

async function reviewSubscription(id, status) {
  if (!['approved','rejected'].includes(status)) return;
  const { error } = await db.from("subscriptions").update({ status, reviewed_at: new Date().toISOString(), reviewed_by: currentAdminUser?.id || null }).eq("id", id).eq("status", "pending");
  if (error) { alert("Could not update subscription: " + error.message); return; }
  await loadSubscriptions();
}

async function setAdminAccess(makeAdmin) {
  const uid = $("access-user-uid").value.trim();
  if (!uid) { showMessage("access-message", "Enter a user Auth UID.", "error"); return; }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)) { showMessage("access-message", "Enter a valid UUID.", "error"); return; }
  if (!confirm(`${makeAdmin ? "Grant" : "Revoke"} admin access for ${uid}?`)) return;
  const { error } = await db.rpc("set_farrell_admin_role", { target_user_id: uid, make_admin: makeAdmin });
  if (error) { showMessage("access-message", error.message, "error"); return; }
  showMessage("access-message", makeAdmin ? "Admin access granted." : "Admin access revoked.");
  $("access-user-uid").value = "";
}

document.addEventListener("DOMContentLoaded",async()=>{
  const {data:{user}} = await db.auth.getUser();
  if (user) await checkAdminAndLoad();
});
