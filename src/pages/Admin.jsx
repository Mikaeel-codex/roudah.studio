import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { C, WA, Img, getMaintenance, setMaintenance, composeNoticeMessage, useProducts, PRODUCT_CATEGORIES, PRODUCT_TAGS, formatPrice, getScarcity } from "../shared.jsx";

// ─── Auth helpers ─────────────────────────────────────────────────────────────
const AUTH_KEY   = "roudah_admin_v1";
const ADMIN_USER = "admin@roudah.co.za";
const ADMIN_PASS = "roudah2025";

const isAuthed  = () => localStorage.getItem(AUTH_KEY) === btoa(ADMIN_USER);
const signIn    = () => localStorage.setItem(AUTH_KEY, btoa(ADMIN_USER));
const signOut   = () => localStorage.removeItem(AUTH_KEY);

// ─── Mock data ────────────────────────────────────────────────────────────────
const ORDERS = [
  { id: "#R-2047", customer: "Noor Al-Rashid",   product: "The Oasis Gown",           amount: "R 9,200", status: "Processing", date: "18 Jun 2026", method: "EFT"  },
  { id: "#R-2046", customer: "Fatima Hassan",     product: "Noor Embroidered Abaya",   amount: "R 6,200", status: "Shipped",    date: "17 Jun 2026", method: "EFT"  },
  { id: "#R-2045", customer: "Layla Mansour",     product: "The Ivory Cape Set",       amount: "R 6,900", status: "Delivered",  date: "16 Jun 2026", method: "Card" },
  { id: "#R-2044", customer: "Amira Karimi",      product: "Layla Satin Abaya",        amount: "R 3,950", status: "Processing", date: "16 Jun 2026", method: "EFT"  },
  { id: "#R-2043", customer: "Hana Al-Farsi",     product: "Desert Sand Gown",         amount: "R 8,800", status: "Cancelled",  date: "15 Jun 2026", method: "Card" },
  { id: "#R-2042", customer: "Sara Benali",       product: "Garden Hour Abaya",        amount: "R 4,600", status: "Delivered",  date: "14 Jun 2026", method: "EFT"  },
  { id: "#R-2041", customer: "Dina El-Amin",      product: "Blossom Evening Gown",     amount: "R 8,400", status: "Shipped",    date: "13 Jun 2026", method: "Card" },
  { id: "#R-2040", customer: "Rima Khalil",       product: "The Sahara Cape",          amount: "R 4,850", status: "Delivered",  date: "12 Jun 2026", method: "EFT"  },
  { id: "#R-2039", customer: "Yasmine Okafor",    product: "Al Rimal Floral Abaya",    amount: "R 7,450", status: "Processing", date: "11 Jun 2026", method: "EFT"  },
  { id: "#R-2038", customer: "Mariam Jaber",      product: "The Velvet Co-ord",        amount: "R 5,600", status: "Delivered",  date: "10 Jun 2026", method: "Card" },
];

const IMAGE_CHOICES = [0, 1, 3, 4, 5, 8, 9, 11, 13, 14, 15, 16, 18, 20, 22, 25, 27].map(n => WA(n));

const CUSTOMERS = [
  { name: "Fatima Hassan",   email: "fatima@example.com",  orders: 4, spent: "R 22,850", joined: "Jan 2026", status: "Active"    },
  { name: "Layla Mansour",   email: "layla@example.com",   orders: 3, spent: "R 19,650", joined: "Feb 2026", status: "Active"    },
  { name: "Noor Al-Rashid",  email: "noor@example.com",    orders: 2, spent: "R 16,100", joined: "Mar 2026", status: "Active"    },
  { name: "Amira Karimi",    email: "amira@example.com",   orders: 2, spent: "R 10,150", joined: "Mar 2026", status: "Active"    },
  { name: "Hana Al-Farsi",   email: "hana@example.com",    orders: 1, spent: "R 8,800",  joined: "Apr 2026", status: "Inactive"  },
  { name: "Sara Benali",     email: "sara@example.com",    orders: 3, spent: "R 15,350", joined: "Jan 2026", status: "Active"    },
  { name: "Dina El-Amin",    email: "dina@example.com",    orders: 1, spent: "R 8,400",  joined: "May 2026", status: "Active"    },
  { name: "Rima Khalil",     email: "rima@example.com",    orders: 2, spent: "R 9,700",  joined: "Apr 2026", status: "Active"    },
  { name: "Yasmine Okafor",  email: "yasmine@example.com", orders: 1, spent: "R 7,450",  joined: "Jun 2026", status: "Active"    },
  { name: "Mariam Jaber",    email: "mariam@example.com",  orders: 2, spent: "R 11,200", joined: "Feb 2026", status: "Active"    },
];

// ─── Colours used only in the admin UI ────────────────────────────────────────
const A = {
  sidebar:   "#1C1410",
  sideHov:   "#2A1E16",
  sideActive:"#3E1C0A",
  bg:        "#F5F2EE",
  surface:   "#FFFFFF",
  border:    "rgba(192,171,140,0.22)",
  muted:     "rgba(62,28,10,0.45)",
};

// ─── Reusable admin components ────────────────────────────────────────────────
function StatCard({ label, value, sub, color = C.terracotta, icon }) {
  return (
    <div style={{
      backgroundColor: A.surface, border: `1px solid ${A.border}`,
      padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "0.5rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ color: A.muted, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Arial" }}>{label}</p>
        <span style={{ fontSize: "1rem", opacity: 0.7 }}>{icon}</span>
      </div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "1.75rem", color: C.espresso, fontWeight: 300, letterSpacing: "0.04em" }}>{value}</p>
      <p style={{ fontSize: "0.54rem", fontFamily: "Arial", color }}>{sub}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Processing: { bg: "rgba(200,150,28,0.12)", color: "#9A6800" },
    Shipped:    { bg: "rgba(107,112,72,0.12)", color: C.sage    },
    Delivered:  { bg: "rgba(62,28,10,0.10)",   color: C.espresso},
    Cancelled:  { bg: "rgba(184,84,40,0.12)",  color: C.terracotta },
  };
  const s = map[status] || map.Processing;
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color,
      fontSize: "0.5rem", letterSpacing: "0.14em",
      textTransform: "uppercase", fontFamily: "Arial",
      padding: "3px 8px", whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

function StockBadge({ stock }) {
  const color = stock === 0 ? C.terracotta : stock <= 2 ? "#9A6800" : C.sage;
  const label = stock === 0 ? "Sold Out" : `${stock} left`;
  return (
    <span style={{ fontSize: "0.54rem", fontFamily: "Arial", color, fontWeight: 400 }}>{label}</span>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "2rem", color: C.espresso, fontWeight: 600, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {title}
        {count != null && (
          <span style={{ fontSize: "0.52rem", fontFamily: "Arial", color: A.muted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {count} total
          </span>
        )}
      </h2>
      <div style={{ height: "1px", backgroundColor: A.border, marginTop: "0.75rem" }} />
    </div>
  );
}

// ─── Dashboard sections ───────────────────────────────────────────────────────
function Overview({ products }) {
  const revenue  = ORDERS.filter(o => o.status !== "Cancelled").reduce((s, o) => s + parseInt(o.amount.replace(/\D/g, "")), 0);
  const today    = ORDERS.filter(o => o.date === "18 Jun 2026").length;
  const lowStock = products.filter(p => p.stock <= 2);

  return (
    <div>
      <SectionHeader title="Overview" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        <StatCard label="Total Revenue"     value={`R ${revenue.toLocaleString()}`} sub="From completed orders"           color={C.sage}       icon="◈" />
        <StatCard label="Orders Today"      value={today}                            sub="2 pending fulfilment"            color={C.terracotta} icon="◇" />
        <StatCard label="Active Products"   value={products.filter(p=>p.stock>0).length} sub={`${lowStock.length} low stock`} color="#9A6800"  icon="✦" />
        <StatCard label="Total Customers"   value={CUSTOMERS.length}                 sub="10 active this month"            color={C.sage}       icon="◎" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent orders */}
        <div style={{ backgroundColor: A.surface, border: `1px solid ${A.border}`, padding: "1.5rem" }}>
          <p style={{ color: A.muted, fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.25rem" }}>Recent Orders</p>
          {ORDERS.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: `1px solid ${A.border}` }}>
              <div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "0.8rem", color: C.espresso, marginBottom: "0.1rem" }}>{o.customer}</p>
                <p style={{ fontFamily: "Arial", fontSize: "0.52rem", color: A.muted }}>{o.id} · {o.date}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso, marginBottom: "0.2rem" }}>{o.amount}</p>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Low stock alerts */}
        <div style={{ backgroundColor: A.surface, border: `1px solid ${A.border}`, padding: "1.5rem" }}>
          <p style={{ color: A.muted, fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.25rem" }}>Stock Alerts</p>
          {lowStock.length === 0 && (
            <p style={{ color: A.muted, fontSize: "0.7rem", fontFamily: "Arial" }}>All products well stocked.</p>
          )}
          {lowStock.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: `1px solid ${A.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Img file={p.file} fallbackSeed={`stock-${p.id}`} w={60} h={80}
                  style={{ width: "36px", height: "46px", objectFit: "cover" }} />
                <div>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "0.78rem", color: C.espresso, marginBottom: "0.1rem" }}>{p.name}</p>
                  <p style={{ fontFamily: "Arial", fontSize: "0.52rem", color: A.muted }}>{p.category}</p>
                </div>
              </div>
              <StockBadge stock={p.stock} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const displayed = filter === "All" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div>
      <SectionHeader title="Orders" count={ORDERS.length} />

      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: "0.35rem 0.9rem", border: `1px solid ${filter === s ? C.terracotta : A.border}`,
              backgroundColor: filter === s ? C.terracotta : "transparent",
              color: filter === s ? C.white : C.espresso,
              fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase",
              fontFamily: "Arial", fontWeight: 300, cursor: "pointer", transition: "all 200ms",
            }}>{s}</button>
        ))}
      </div>

      <div style={{ backgroundColor: A.surface, border: `1px solid ${A.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: A.bg }}>
              {["Order", "Customer", "Product", "Amount", "Method", "Status", "Date"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", color: A.muted, fontWeight: 400, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: i % 2 === 0 ? A.surface : A.bg }}>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.62rem", color: C.terracotta, fontWeight: 400, whiteSpace: "nowrap" }}>{o.id}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.78rem", color: C.espresso, whiteSpace: "nowrap" }}>{o.customer}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.6rem", color: C.charcoal, opacity: 0.75 }}>{o.product}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso, whiteSpace: "nowrap" }}>{o.amount}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.56rem", color: A.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{o.method}</td>
                <td style={{ padding: "0.85rem 1rem" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.6rem", color: A.muted, whiteSpace: "nowrap" }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <p style={{ padding: "2.5rem", textAlign: "center", color: A.muted, fontFamily: "Arial", fontSize: "0.65rem" }}>No orders match this filter.</p>
        )}
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const isEdit = !!product;
  const [form, setForm] = useState(product ? {
    ...product,
    price: String(product.price),
  } : {
    name: "", category: PRODUCT_CATEGORIES[0], price: "", stock: 1, tag: PRODUCT_TAGS[0], file: IMAGE_CHOICES[0], fabric: "", saves: 0,
  });
  const [error, setError] = useState("");

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.price || isNaN(Number(form.price))) { setError("Enter a valid price."); return; }
    onSave({
      ...form,
      id: product ? product.id : Date.now(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      saves: Number(form.saves) || 0,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      backgroundColor: "rgba(28,20,16,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: A.surface, width: "100%", maxWidth: "460px",
        maxHeight: "90vh", overflowY: "auto", padding: "2rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.15rem", color: C.espresso, fontWeight: 400 }}>
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.espresso, opacity: 0.5, fontSize: "1rem" }}>✕</button>
        </div>

        <SettingsField label="Product Name" value={form.name} onChange={set("name")} />
        <SettingsField label="Fabric / Description" value={form.fabric} onChange={set("fabric")} />

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <SettingsField label="Price (R)" type="number" value={form.price} onChange={set("price")} />
          <SettingsField label="Stock" type="number" value={form.stock} onChange={set("stock")} />
        </div>

        <div style={{ marginBottom: "1.1rem" }}>
          <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
            Category
          </label>
          <SegmentedControl options={PRODUCT_CATEGORIES.map(c => ({ value: c, label: c }))} value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
        </div>

        <div style={{ marginBottom: "1.1rem" }}>
          <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
            Tag
          </label>
          <SegmentedControl options={PRODUCT_TAGS.map(t => ({ value: t, label: t }))} value={form.tag} onChange={v => setForm(f => ({ ...f, tag: v }))} />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
            Product Image
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.4rem" }}>
            {IMAGE_CHOICES.map(file => (
              <button key={file} onClick={() => setForm(f => ({ ...f, file }))}
                style={{
                  padding: 0, border: `2px solid ${form.file === file ? C.terracotta : "transparent"}`,
                  cursor: "pointer", backgroundColor: "transparent", lineHeight: 0,
                }}>
                <Img file={file} fallbackSeed={file} w={60} h={80} style={{ width: "100%", height: "44px", objectFit: "cover", display: "block", opacity: form.file === file ? 1 : 0.6 }} />
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ color: C.terracotta, fontSize: "0.56rem", fontFamily: "Arial", marginBottom: "1rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleSave}
            style={{
              flex: 1, backgroundColor: C.terracotta, color: C.white, border: "none",
              padding: "0.75rem", fontSize: "0.58rem", letterSpacing: "0.22em",
              textTransform: "uppercase", fontFamily: "Arial", fontWeight: 400, cursor: "pointer",
            }}>
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
          <button onClick={onClose}
            style={{
              backgroundColor: "transparent", color: C.espresso, border: `1px solid ${A.border}`,
              padding: "0.75rem 1.25rem", fontSize: "0.58rem", letterSpacing: "0.22em",
              textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, cursor: "pointer",
            }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ products, onAdd, onEdit, onDelete }) {
  const [modal, setModal]       = useState(null); // null | "add" | product object
  const [confirmId, setConfirmId] = useState(null);

  const handleSave = data => {
    if (modal === "add") onAdd(data);
    else onEdit(data);
    setModal(null);
  };

  const handleDelete = id => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader title="Products" count={products.length} />
        <button onClick={() => setModal("add")}
          style={{
            backgroundColor: C.terracotta, color: C.white, border: "none",
            padding: "0.6rem 1.25rem", fontSize: "0.56rem", letterSpacing: "0.2em",
            textTransform: "uppercase", fontFamily: "Arial", fontWeight: 400, cursor: "pointer",
            whiteSpace: "nowrap", marginTop: "-1.5rem",
          }}>
          + Add Product
        </button>
      </div>
      <div style={{ backgroundColor: A.surface, border: `1px solid ${A.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: A.bg }}>
              {["", "Product", "Category", "Price", "Tag", "Stock", ""].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", color: A.muted, fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: i % 2 === 0 ? A.surface : A.bg }}>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <Img file={p.file} fallbackSeed={`prod-${p.id}`} w={60} h={80}
                    style={{ width: "38px", height: "48px", objectFit: "cover", display: "block" }} />
                </td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.8rem", color: C.espresso, whiteSpace: "nowrap" }}>{p.name}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.58rem", color: A.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.category}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso }}>{formatPrice(p.price)}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{ fontSize: "0.5rem", fontFamily: "Arial", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: p.tag === "Limited" ? C.terracotta : p.tag === "Exclusive" ? C.espresso : p.tag === "Bestseller" ? C.sage : C.copper }}>
                    {p.tag}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}><StockBadge stock={p.stock} /></td>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                    <button onClick={() => setModal(p)}
                      style={{ background: "none", border: `1px solid ${A.border}`, color: C.espresso, fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Arial", padding: "0.35rem 0.6rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      style={{
                        background: confirmId === p.id ? C.terracotta : "none",
                        border: `1px solid ${confirmId === p.id ? C.terracotta : "rgba(184,84,40,0.4)"}`,
                        color: confirmId === p.id ? C.white : C.terracotta,
                        fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Arial",
                        padding: "0.35rem 0.6rem", cursor: "pointer", whiteSpace: "nowrap",
                      }}>
                      {confirmId === p.id ? "Confirm?" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p style={{ padding: "2.5rem", textAlign: "center", color: A.muted, fontFamily: "Arial", fontSize: "0.65rem" }}>No products yet. Add your first piece.</p>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function CustomersSection() {
  return (
    <div>
      <SectionHeader title="Customers" count={CUSTOMERS.length} />
      <div style={{ backgroundColor: A.surface, border: `1px solid ${A.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: A.bg }}>
              {["Customer", "Email", "Orders", "Total Spent", "Joined", "Status"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", color: A.muted, fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c, i) => (
              <tr key={c.email} style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: i % 2 === 0 ? A.surface : A.bg }}>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.8rem", color: C.espresso, whiteSpace: "nowrap" }}>{c.name}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.6rem", color: A.muted }}>{c.email}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.68rem", color: C.espresso, textAlign: "center" }}>{c.orders}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso }}>{c.spent}</td>
                <td style={{ padding: "0.85rem 1rem", fontFamily: "Arial", fontSize: "0.6rem", color: A.muted }}>{c.joined}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{
                    fontSize: "0.5rem", fontFamily: "Arial", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: c.status === "Active" ? C.sage : A.muted,
                    backgroundColor: c.status === "Active" ? "rgba(107,112,72,0.1)" : "rgba(192,171,140,0.15)",
                    padding: "3px 8px",
                  }}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Settings ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "38px", height: "20px", borderRadius: "10px",
        border: "none", padding: "2px", cursor: "pointer",
        backgroundColor: checked ? C.sage : "rgba(62,28,10,0.18)",
        transition: "background-color 200ms", flexShrink: 0,
        display: "flex", alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: C.white, transition: "transform 200ms" }} />
    </button>
  );
}

function SettingsRow({ label, sub, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 0", borderBottom: `1px solid ${A.border}` }}>
      <div>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso, marginBottom: "0.15rem" }}>{label}</p>
        {sub && <p style={{ fontFamily: "Arial", fontSize: "0.54rem", color: A.muted }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function SettingsField({ label, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.4rem" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", backgroundColor: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? C.terracotta : "rgba(62,28,10,0.2)"}`,
          padding: "0.45rem 0", fontSize: "0.8rem",
          fontFamily: "Georgia,serif", color: C.espresso, fontWeight: 300,
          outline: "none", transition: "border-color 200ms",
        }}
      />
    </div>
  );
}

function SettingsTextArea({ label, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.4rem" }}>
        {label}
      </label>
      <textarea
        value={value} onChange={onChange} rows={3}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", backgroundColor: "transparent",
          border: `1px solid ${focused ? C.terracotta : "rgba(62,28,10,0.2)"}`,
          padding: "0.5rem 0.6rem", fontSize: "0.78rem",
          fontFamily: "Georgia,serif", color: C.espresso, fontWeight: 300,
          outline: "none", transition: "border-color 200ms",
          resize: "vertical",
        }}
      />
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.1rem" }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: "0.5rem 0.6rem",
            border: `1px solid ${value === opt.value ? C.terracotta : "rgba(62,28,10,0.2)"}`,
            backgroundColor: value === opt.value ? C.terracotta : "transparent",
            color: value === opt.value ? C.white : C.espresso,
            fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase",
            fontFamily: "Arial", fontWeight: 300, cursor: "pointer", transition: "all 180ms",
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SettingsCard({ title, children, accent }) {
  return (
    <div style={{ backgroundColor: A.surface, border: `1px solid ${accent ? "rgba(184,84,40,0.35)" : A.border}`, padding: "1.5rem 1.75rem" }}>
      <p style={{ color: A.muted, fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.1rem" }}>{title}</p>
      {children}
    </div>
  );
}

function SettingsSection() {
  const [store, setStore] = useState({
    name: "Roudah Studio",
    email: "hello@roudah.co.za",
    phone: "+27 71 234 5678",
    address: "Johannesburg, South Africa",
  });
  const [payments, setPayments] = useState({ eft: true, card: true, deliveryEftOnly: true });
  const [notify, setNotify]     = useState({ newOrder: true, lowStock: true, newCustomer: false });
  const [maintenance, setMaintenanceState] = useState(getMaintenance());
  const [saved, setSaved]       = useState(false);

  const setField = key => e => setStore(s => ({ ...s, [key]: e.target.value }));
  const setMaint  = key => val => setMaintenanceState(m => ({ ...m, [key]: val }));
  const setNotice = key => val => setMaintenanceState(m => ({ ...m, notice: { ...m.notice, [key]: val } }));

  const handleSave = () => {
    setMaintenance(maintenance);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div>
      <SectionHeader title="Settings" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <SettingsCard title="Store Information">
          <SettingsField label="Store Name"  value={store.name}    onChange={setField("name")} />
          <SettingsField label="Contact Email" type="email" value={store.email} onChange={setField("email")} />
          <SettingsField label="Phone"       value={store.phone}    onChange={setField("phone")} />
          <SettingsField label="Address"     value={store.address} onChange={setField("address")} />
        </SettingsCard>

        <SettingsCard title="Payment Methods">
          <SettingsRow label="EFT" sub="Bank transfer payments">
            <Toggle checked={payments.eft} onChange={v => setPayments(p => ({ ...p, eft: v }))} />
          </SettingsRow>
          <SettingsRow label="Card Payments" sub="Visa, Mastercard via gateway">
            <Toggle checked={payments.card} onChange={v => setPayments(p => ({ ...p, card: v }))} />
          </SettingsRow>
          <SettingsRow label="Delivery → EFT Only" sub="Restrict card payments when delivery is selected">
            <Toggle checked={payments.deliveryEftOnly} onChange={v => setPayments(p => ({ ...p, deliveryEftOnly: v }))} />
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Notifications">
          <SettingsRow label="New Order Alerts" sub="Email when an order is placed">
            <Toggle checked={notify.newOrder} onChange={v => setNotify(n => ({ ...n, newOrder: v }))} />
          </SettingsRow>
          <SettingsRow label="Low Stock Alerts" sub="Notify when a product hits 2 or fewer">
            <Toggle checked={notify.lowStock} onChange={v => setNotify(n => ({ ...n, lowStock: v }))} />
          </SettingsRow>
          <SettingsRow label="New Customer Sign-ups" sub="Notify on account registration">
            <Toggle checked={notify.newCustomer} onChange={v => setNotify(n => ({ ...n, newCustomer: v }))} />
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Admin Account">
          <SettingsField label="Admin Email" type="email" value={ADMIN_USER} onChange={() => {}} />
          <SettingsField label="New Password" type="password" value="" onChange={() => {}} />
          <SettingsField label="Confirm Password" type="password" value="" onChange={() => {}} />
        </SettingsCard>

        {/* ── Developer Settings ──────────────────────────────────────────── */}
        <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
          <p style={{ color: A.muted, fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
            Developer Settings
          </p>
          <div style={{ height: "1px", backgroundColor: A.border }} />
        </div>

        <SettingsCard title="Maintenance Mode" accent={maintenance.enabled}>
          <SettingsRow
            label="Take Site Offline"
            sub={maintenance.enabled ? "Visitors see ONLY the maintenance page. No other page is reachable." : "Site is live and fully accessible to visitors."}
          >
            <Toggle checked={maintenance.enabled} onChange={setMaint("enabled")} />
          </SettingsRow>

          {maintenance.enabled && (
            <div style={{ backgroundColor: "rgba(184,84,40,0.08)", border: "1px solid rgba(184,84,40,0.25)", padding: "0.65rem 0.85rem", margin: "0.9rem 0" }}>
              <p style={{ fontFamily: "Arial", fontSize: "0.56rem", color: C.terracotta, lineHeight: 1.5 }}>
                Customers cannot sign in, browse, or check out while this is on. Only the Admin Login button on the maintenance page (back to this dashboard) remains reachable.
              </p>
            </div>
          )}

          <SettingsTextArea
            label="Maintenance Page Message"
            value={maintenance.message}
            onChange={e => setMaint("message")(e.target.value)}
          />

          <div>
            <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
              Preview
            </label>
            <div style={{ backgroundColor: C.espresso, padding: "2rem 1.25rem", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "0.7rem", letterSpacing: "0.4em", color: C.white, textTransform: "uppercase", marginBottom: "1rem" }}>ROUDAH</p>
              <p style={{ color: C.gold, fontSize: "0.8rem", marginBottom: "0.6rem" }}>✦</p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "0.85rem", color: C.white, marginBottom: "0.6rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Under Maintenance</p>
              <p style={{ fontFamily: "Arial", fontSize: "0.56rem", color: C.sand, opacity: 0.8, lineHeight: 1.6, marginBottom: "0.9rem" }}>{maintenance.message}</p>
              <span style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.3)", color: C.white, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", padding: "0.45rem 1rem" }}>
                Admin Login
              </span>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Advance Notice">
          <SettingsRow label="Notify Customers in Advance" sub="Shows a heads-up while the site stays fully live">
            <Toggle checked={maintenance.notice.enabled} onChange={setNotice("enabled")} />
          </SettingsRow>

          <div style={{ marginTop: "1.1rem" }}>
            <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
              Display As
            </label>
            <SegmentedControl
              options={[{ value: "banner", label: "Top Banner" }, { value: "popup", label: "Popup Modal" }]}
              value={maintenance.notice.type}
              onChange={setNotice("type")}
            />
          </div>

          <SettingsTextArea
            label="Notice Message"
            value={maintenance.notice.message}
            onChange={e => setNotice("message")(e.target.value)}
          />

          <div style={{ display: "flex", gap: "0.8rem" }}>
            <SettingsField label="Date" type="date" value={maintenance.notice.date} onChange={e => setNotice("date")(e.target.value)} />
            <SettingsField label="Time" type="time" value={maintenance.notice.time} onChange={e => setNotice("time")(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", color: A.muted, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>
              Preview
            </label>
            {maintenance.notice.type === "banner" ? (
              <div style={{ backgroundColor: C.terracotta, padding: "0.7rem 1rem", textAlign: "center" }}>
                <p style={{ color: C.white, fontSize: "0.62rem", fontFamily: "Arial", letterSpacing: "0.02em" }}>{composeNoticeMessage(maintenance.notice)}</p>
              </div>
            ) : (
              <div style={{ backgroundColor: "rgba(28,20,16,0.85)", padding: "1.75rem 1.25rem", display: "flex", justifyContent: "center" }}>
                <div style={{ backgroundColor: C.white, padding: "1.5rem", maxWidth: "260px", textAlign: "center" }}>
                  <p style={{ color: C.gold, fontSize: "0.95rem", marginBottom: "0.6rem" }}>✦</p>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "0.85rem", color: C.espresso, marginBottom: "0.5rem" }}>We'll be right back</p>
                  <p style={{ fontFamily: "Arial", fontSize: "0.6rem", color: C.charcoal, opacity: 0.7, lineHeight: 1.5 }}>{composeNoticeMessage(maintenance.notice)}</p>
                </div>
              </div>
            )}
          </div>
        </SettingsCard>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={handleSave}
          style={{
            backgroundColor: C.terracotta, color: C.white, border: "none",
            padding: "0.75rem 1.75rem", fontSize: "0.58rem", letterSpacing: "0.24em",
            textTransform: "uppercase", fontFamily: "Arial", fontWeight: 400, cursor: "pointer",
            transition: "background-color 200ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.espresso; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.terracotta; }}
        >
          Save Changes
        </button>
        {saved && (
          <span style={{ color: C.sage, fontSize: "0.56rem", fontFamily: "Arial", letterSpacing: "0.1em" }}>✓ Settings saved</span>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",   label: "Overview",   icon: "◈" },
  { id: "orders",     label: "Orders",     icon: "◇" },
  { id: "products",   label: "Products",   icon: "✦" },
  { id: "customers",  label: "Customers",  icon: "◎" },
  { id: "settings",   label: "Settings",   icon: "⚙" },
];

// ─── Dashboard shell ──────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [active, setActive] = useState("overview");
  const [hovered, setHovered] = useState(null);
  const [products, setProducts] = useProducts();

  const handleAddProduct    = data => setProducts(ps => [...ps, data]);
  const handleEditProduct   = data => setProducts(ps => ps.map(p => p.id === data.id ? data : p));
  const handleDeleteProduct = id   => setProducts(ps => ps.filter(p => p.id !== id));

  const section = {
    overview:  <Overview products={products} />,
    orders:    <OrdersSection />,
    products:  <ProductsSection products={products} onAdd={handleAddProduct} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />,
    customers: <CustomersSection />,
    settings:  <SettingsSection />,
  }[active];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: A.bg }}>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside style={{
        width: "220px", flexShrink: 0,
        backgroundColor: A.sidebar,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "2rem 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "0.95rem", letterSpacing: "0.5em", color: C.white, fontWeight: 300, textTransform: "uppercase" }}>ROUDAH</p>
          <span style={{ fontSize: "0.46rem", fontFamily: "Arial", letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, opacity: 0.75 }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, padding: "1.25rem 0" }}>
          {NAV.map(item => {
            const isActive = active === item.id;
            const isHov    = hovered === item.id;
            return (
              <button key={item.id}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  width: "100%", padding: "0.8rem 1.5rem",
                  backgroundColor: isActive ? A.sideActive : isHov ? A.sideHov : "transparent",
                  border: "none", borderLeft: `3px solid ${isActive ? C.terracotta : "transparent"}`,
                  cursor: "pointer", transition: "background-color 180ms, border-color 180ms",
                  textAlign: "left",
                }}
              >
                <span style={{ color: isActive ? C.gold : "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>{item.icon}</span>
                <span style={{ fontFamily: "Arial", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: isActive ? C.white : "rgba(255,255,255,0.5)", fontWeight: isActive ? 400 : 300 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "Arial", fontSize: "0.52rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "0.85rem" }}>
            admin@roudah.co.za
          </p>
          <Link to="/"
            style={{
              display: "flex", alignItems: "center", gap: "0.55rem",
              backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.12)",
              padding: "0.5rem 0.9rem", cursor: "pointer", width: "100%",
              textDecoration: "none", marginBottom: "0.6rem",
              transition: "border-color 200ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,150,28,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>⌂</span>
            <span style={{ fontFamily: "Arial", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>View Website</span>
          </Link>
          <button onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: "0.55rem",
              backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.12)",
              padding: "0.5rem 0.9rem", cursor: "pointer", width: "100%",
              transition: "border-color 200ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(184,84,40,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>↩</span>
            <span style={{ fontFamily: "Arial", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "2.5rem 2.5rem", overflowY: "auto", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "Arial", fontSize: "0.52rem", color: A.muted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: C.sage }} />
            <span style={{ fontFamily: "Arial", fontSize: "0.52rem", color: A.muted, letterSpacing: "0.14em" }}>Live</span>
          </div>
        </div>
        {section}
      </main>
    </div>
  );
}

// ─── Admin login ──────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (email === ADMIN_USER && password === ADMIN_PASS) {
      signIn();
      onSuccess();
    } else {
      setError("Invalid credentials. Access denied.");
    }
  };

  const inputStyle = name => ({
    width: "100%", backgroundColor: "transparent", border: "none",
    borderBottom: `1px solid ${focused === name ? C.terracotta : "rgba(62,28,10,0.25)"}`,
    padding: "0.6rem 0", fontSize: "0.88rem",
    fontFamily: "Georgia,serif", color: C.espresso, fontWeight: 300,
    outline: "none", transition: "border-color 250ms",
  });

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: A.sidebar,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        backgroundColor: C.white,
        padding: "3.5rem 3rem",
        width: "100%", maxWidth: "380px",
      }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "1rem", letterSpacing: "0.52em", color: C.espresso, fontWeight: 300, textTransform: "uppercase", textAlign: "center", marginBottom: "0.5rem" }}>ROUDAH</p>
        <p style={{ fontFamily: "Arial", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: "3rem", opacity: 0.8 }}>Admin Access</p>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: A.border }} />
          <span style={{ fontSize: "1rem", opacity: 0.4 }}>◈</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: A.border }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: C.espresso, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.55rem", opacity: 0.7 }}>Email</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@roudah.co.za"
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              style={inputStyle("email")} autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", color: C.espresso, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.55rem", opacity: 0.7 }}>Password</label>
            <input
              type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              style={inputStyle("password")} autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ color: C.terracotta, fontSize: "0.54rem", fontFamily: "Arial", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>{error}</p>
          )}

          <button type="submit"
            style={{
              width: "100%", backgroundColor: C.espresso, color: C.white,
              border: "none", padding: "0.9rem",
              fontSize: "0.58rem", letterSpacing: "0.28em",
              textTransform: "uppercase", fontFamily: "Arial",
              fontWeight: 400, cursor: "pointer", transition: "background-color 200ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.terracotta; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.espresso; }}
          >
            Enter Dashboard
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: A.muted, fontSize: "0.54rem", fontFamily: "Arial" }}>
          Authorised personnel only
        </p>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed());
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    setAuthed(false);
    navigate("/admin");
  };

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
