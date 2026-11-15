(() => {
  const $ = (s) => document.querySelector(s);
  const money = (n) => `${n.toLocaleString("en-US")} ${STORE.currency}`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  // ---------- رسم النظارة (SVG) ----------
  const LENS = {
    round:   `<circle cx="70" cy="58" r="33"/>`,
    square:  `<rect x="35" y="29" width="70" height="56" rx="13"/>`,
    aviator: `<path d="M37 34 Q70 25 104 34 Q109 68 86 87 Q64 97 45 82 Q31 62 37 34Z"/>`,
    cat:     `<path d="M27 29 Q68 29 106 36 Q108 66 90 82 Q64 93 44 78 Q33 60 27 29Z"/>`,
  };
  function glasses(p) {
    const sun = p.cat === "sun";
    const g = `g-${p.id}`;
    const half = `
      <g fill="url(#${g})" stroke="${p.frame}" stroke-width="${p.shape === "aviator" || p.frame === "#b8904a" || p.frame === "#d6b577" ? 3.5 : 6}" stroke-linejoin="round">${LENS[p.shape]}</g>
      <path d="M36 42 L12 36" stroke="${p.frame}" stroke-width="5" stroke-linecap="round"/>
      <path d="M50 46 Q58 38 70 37" stroke="#fff" stroke-opacity="${sun ? 0.35 : 0.8}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    return `<svg viewBox="0 0 240 116" role="img" aria-label="${p.name}">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.lens}" stop-opacity="${sun ? 0.95 : 0.35}"/>
        <stop offset="1" stop-color="${p.lens}" stop-opacity="${sun ? 0.6 : 0.12}"/>
      </linearGradient></defs>
      ${half}<g transform="translate(240 0) scale(-1 1)">${half}</g>
      <path d="M103 52 Q120 40 137 52" stroke="${p.frame}" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // ---------- الحالة ----------
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("ora-cart")) || {}; } catch { cart = {}; }
  Object.keys(cart).forEach((id) => byId(id) || delete cart[id]);
  let filter = "all";
  let sort = "featured";

  const save = () => { try { localStorage.setItem("ora-cart", JSON.stringify(cart)); } catch {} };
  const totals = () => {
    const sub = Object.entries(cart).reduce((s, [id, q]) => s + byId(id).price * q, 0);
    const ship = sub === 0 || sub >= STORE.freeShippingFrom ? 0 : STORE.shipping;
    return { sub, ship, total: sub + ship, count: Object.values(cart).reduce((a, b) => a + b, 0) };
  };

  // ---------- المتجر ----------
  function renderChips() {
    $("#chips").innerHTML = Object.entries(CATEGORIES)
      .map(([k, v]) => `<button class="chip ${k === filter ? "on" : ""}" role="tab" aria-selected="${k === filter}" data-filter="${k}">${v}</button>`).join("");
  }
  function priceHTML(p) { return `<div class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</div>`; }
  function tagHTML(p) { return p.tag ? `<span class="tag ${p.old ? "sale" : ""}">${p.tag}</span>` : ""; }
  function renderGrid() {
    let list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    $("#grid").innerHTML = list.map((p) => `
      <article class="card">
        <button class="card-img" style="background:${p.bg}" data-open="${p.id}" aria-label="تفاصيل ${p.name}">${tagHTML(p)}${glasses(p)}</button>
        <div class="card-body">
          <span class="cat">${CATEGORIES[p.cat]} · ${SHAPES[p.shape]}</span>
          <h3>${p.name}</h3>
          ${priceHTML(p)}
          <button class="btn btn-dark" data-add="${p.id}">أضف للسلة</button>
        </div>
      </article>`).join("");
  }

  // ---------- تفاصيل المنتج ----------
  function openProduct(id) {
    const p = byId(id);
    $("#productBody").innerHTML = `
      <div class="pd">
        <button class="icon-btn modal-x" data-close aria-label="إغلاق">✕</button>
        <div class="pd-img" style="background:${p.bg}">${glasses(p)}</div>
        <div class="pd-info">
          <span class="cat">${CATEGORIES[p.cat]}</span>
          <h3>${p.name}</h3>
          ${priceHTML(p)}
          <p class="muted">${p.desc}</p>
          <ul class="specs">
            <li><span>الشكل</span><b>${SHAPES[p.shape]}</b></li>
            <li><span>الخامة</span><b>${p.material}</b></li>
            <li><span>العدسات</span><b>${p.cat === "sun" ? "UV400" : p.cat === "blue" ? "Anti Blue-Light" : "قابلة لتركيب مقاس النظر"}</b></li>
            <li><span>الضمان</span><b>سنة</b></li>
          </ul>
          <button class="btn btn-main btn-block" data-add="${p.id}" data-close>أضف للسلة</button>
        </div>
      </div>`;
    $("#productModal").showModal();
  }

  // ---------- السلة ----------
  function renderCart() {
    const t = totals();
    $("#cartCount").textContent = t.count;
    const ids = Object.keys(cart);
    $("#cartItems").innerHTML = ids.length ? ids.map((id) => {
      const p = byId(id), q = cart[id];
      return `<div class="item">
        <div class="item-img" style="background:${p.bg}">${glasses(p)}</div>
        <div><h4>${p.name}</h4>
          <div class="qty"><button data-inc="${id}" aria-label="زيادة">+</button><span>${q}</span><button data-dec="${id}" aria-label="تقليل">−</button></div>
        </div>
        <div class="item-end">${money(p.price * q)}<button class="del" data-del="${id}">حذف</button></div>
      </div>`;
    }).join("") : `<p class="empty">سلتك فارغة. تصفّح المجموعة واختر نظارتك.</p>`;

    const left = STORE.freeShippingFrom - t.sub;
    $("#cartFoot").innerHTML = ids.length ? `
      ${left > 0 ? `<p class="ship-note">أضف بقيمة ${money(left)} للحصول على شحن مجاني</p>` : `<p class="ship-note">طلبك مؤهل للشحن المجاني</p>`}
      ${summaryHTML(t)}
      <button class="btn btn-main btn-block" id="goCheckout">إتمام الطلب</button>` : "";
    $("#cartFoot").hidden = !ids.length;
  }
  function summaryHTML(t) {
    return `<div class="row"><span>المجموع</span><span>${money(t.sub)}</span></div>
      <div class="row"><span>الشحن</span><span>${t.ship ? money(t.ship) : "مجاني"}</span></div>
      <div class="row total"><span>الإجمالي</span><span>${money(t.total)}</span></div>`;
  }
  function setDrawer(open) {
    $("#drawer").classList.toggle("open", open);
    $("#drawer").setAttribute("aria-hidden", !open);
    $("#overlay").hidden = !open;
  }
  function add(id) {
    cart[id] = (cart[id] || 0) + 1;
    save(); renderCart(); toast(`تمت إضافة ${byId(id).name} للسلة`);
  }
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- الأحداث ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-filter],[data-open],[data-add],[data-inc],[data-dec],[data-del],[data-close],#goCheckout");
    if (!t) return;
    const d = t.dataset;
    if (d.filter) { filter = d.filter; renderChips(); renderGrid(); }
    if (d.open) openProduct(d.open);
    if (d.add) add(d.add);
    if (d.inc) { cart[d.inc]++; save(); renderCart(); }
    if (d.dec) { if (--cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
    if (d.del) { delete cart[d.del]; save(); renderCart(); }
    if ("close" in d) t.closest("dialog").close();
    if (t.id === "goCheckout") {
      setDrawer(false);
      $("#checkoutTotal").innerHTML = summaryHTML(totals());
      $("#checkoutModal").showModal();
    }
  });
  document.querySelectorAll("dialog").forEach((dlg) =>
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));
  $("#sort").addEventListener("change", (e) => { sort = e.target.value; renderGrid(); });
  $("#cartBtn").addEventListener("click", () => setDrawer(true));
  $("#cartClose").addEventListener("click", () => setDrawer(false));
  $("#overlay").addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

  $("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const t = totals();
    const lines = Object.entries(cart).map(([id, q]) => `• ${byId(id).name} × ${q} = ${money(byId(id).price * q)}`);
    const msg = [
      `طلب جديد من موقع ${STORE.name}`, "",
      `الاسم: ${f.name}`, `الموبايل: ${f.phone}`, `المحافظة: ${f.gov}`, `العنوان: ${f.address}`,
      f.notes ? `ملاحظات: ${f.notes}` : null, "",
      "المنتجات:", ...lines, "",
      `الشحن: ${t.ship ? money(t.ship) : "مجاني"}`, `الإجمالي: ${money(t.total)}`, "الدفع: عند الاستلام",
    ].filter((l) => l !== null).join("\n");
    window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    cart = {}; save(); renderCart();
    e.target.reset(); $("#checkoutModal").close();
    toast("تم تجهيز طلبك — أكمل الإرسال على واتساب");
  });

  // ---------- تشغيل ----------
  $("#freeFrom").textContent = money(STORE.freeShippingFrom);
  $("#waLink").href = `https://wa.me/${STORE.whatsapp}`;
  $("#govSelect").innerHTML = `<option value="">اختر المحافظة</option>` + GOVERNORATES.map((g) => `<option>${g}</option>`).join("");
  $("#heroArt").innerHTML = glasses({ id: "hero", name: "ORA", cat: "sun", shape: "aviator", frame: "#d9dce3", lens: "#7f93bd" });
  renderChips(); renderGrid(); renderCart();
})();
