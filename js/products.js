// ===== إعدادات المتجر — عدّل من هنا فقط =====
const STORE = {
  name: "Lunetterie ORA",
  whatsapp: "201000000000",   // رقم واتساب المتجر بالصيغة الدولية بدون +
  currency: "ج.م",
  shipping: 60,               // مصاريف الشحن
  freeShippingFrom: 1500,     // شحن مجاني من هذا المبلغ
};

const CATEGORIES = { all: "الكل", sun: "شمسية", optical: "طبية", blue: "حماية شاشات" };
const SHAPES = { round: "دائري", square: "مربع", aviator: "أفياتور", cat: "كات آي" };

// لإضافة منتج: انسخ سطر وغيّر بياناته. لاحقاً يمكن استبدال الرسم بصورة حقيقية (image: "img/x.jpg")
const PRODUCTS = [
  { id: "sol-01", name: "Soleil Noir",   cat: "sun",     shape: "aviator", frame: "#b8904a", lens: "#1d2a24", price: 950,  old: 1200, tag: "خصم",   material: "معدن مطلي ذهبي", desc: "أفياتور كلاسيك بإطار ذهبي رفيع وعدسات داكنة UV400." },
  { id: "riv-02", name: "Riviera",       cat: "sun",     shape: "square",  frame: "#3b2416", lens: "#6b4a2b", price: 870,  material: "أسيتات", tag: "الأكثر مبيعاً", desc: "إطار عريض بلون السلحفاة وعدسات بنية دافئة." },
  { id: "lun-03", name: "Luna",          cat: "sun",     shape: "round",   frame: "#14201b", lens: "#2f4a3d", price: 790,  material: "معدن خفيف", desc: "دائرية خفيفة بعدسات خضراء — ستايل ريترو هادي." },
  { id: "fel-04", name: "Féline",        cat: "sun",     shape: "cat",     frame: "#7a1f2b", lens: "#3a1a20", price: 890,  material: "أسيتات", tag: "جديد", desc: "كات آي جريئة بلون نبيتي وعدسات متدرجة." },
  { id: "atl-05", name: "Atelier",       cat: "optical", shape: "round",   frame: "#b8904a", lens: "#cfe0e6", price: 650,  material: "تيتانيوم", desc: "إطار طبي دائري رفيع — خفيف جداً للاستخدام اليومي." },
  { id: "mar-06", name: "Marais",        cat: "optical", shape: "square",  frame: "#14201b", lens: "#dfe8ea", price: 620,  material: "أسيتات", tag: "الأكثر مبيعاً", desc: "مربعة سوداء كلاسيك تناسب أغلب أشكال الوجه." },
  { id: "cla-07", name: "Claire",        cat: "optical", shape: "cat",     frame: "#a8763e", lens: "#e4ecec", price: 680,  material: "أسيتات", desc: "كات آي ناعمة بلون العسل للإطلالة الأنثوية." },
  { id: "pil-08", name: "Pilote Clair",  cat: "optical", shape: "aviator", frame: "#5c6468", lens: "#dce7ea", price: 700,  old: 850, tag: "خصم", material: "معدن", desc: "أفياتور طبية بإطار فضي غامق." },
  { id: "ecr-09", name: "Écran",         cat: "blue",    shape: "square",  frame: "#1f3550", lens: "#bcd6ee", price: 540,  material: "TR90 مرن", tag: "جديد", desc: "حماية من الضوء الأزرق لساعات الشغل الطويلة قدام الشاشة." },
  { id: "pix-10", name: "Pixel",         cat: "blue",    shape: "round",   frame: "#4a4a4a", lens: "#c6dcee", price: 520,  material: "TR90 مرن", desc: "دائرية خفيفة بعدسات مضادة للانعكاس والضوء الأزرق." },
  { id: "dor-11", name: "Dorée",         cat: "sun",     shape: "round",   frame: "#d6b577", lens: "#7a5a2a", price: 990,  material: "معدن مطلي ذهبي", desc: "دائرية ذهبية بعدسات عسلي — توقيع ORA." },
  { id: "nui-12", name: "Nuit",          cat: "sun",     shape: "square",  frame: "#0f0f0f", lens: "#111111", price: 820,  material: "أسيتات", desc: "أسود في أسود — مربعة قوية بعدسات مستقطبة." },
];

const GOVERNORATES = ["القاهرة","الجيزة","الإسكندرية","القليوبية","الشرقية","الدقهلية","الغربية","المنوفية","البحيرة","كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","مطروح","شمال سيناء","جنوب سيناء","الوادي الجديد"];

// ألوان خلفية كروت المنتجات (بتتوزع بالترتيب)
const TILES = ["#e4ebff", "#ffecc9", "#dff2e8", "#ffe1dc", "#ebecf0", "#ece4ff"];
PRODUCTS.forEach((p, i) => { p.bg = TILES[i % TILES.length]; });
