import { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart, Plus, Minus, X, Trash2, Check, Copy,
  Search, Phone, CreditCard, Star, MapPin, KeyRound, DollarSign, Wallet,
  Download, PieChart, Crown, Clock, Bike, Utensils, Trophy, Users, Home, ChevronLeft,
  Percent, ShieldCheck, Headphones, ArrowUpRight, ArrowDownRight, LayoutGrid, CheckCircle2,
  Navigation, Share2, RefreshCw, MessageCircle
} from "lucide-react";

// الهوية الجديدة لمطعم مستر سلطع
const RESTAURANT_NAME = "مستر سلطع";
const TAGLINE = "MR SALTA3 BURGER — سلطعها صح 🍔🔥";
const ADDRESS = "شربين - شارع المركز - أمام مطعم مية مية";
const PHONE_1 = "01021020076";
const PHONE_2 = "01050146229";
const WHATSAPP_NUMBER = "+201021020076";
const VODAFONE_CASH = "01021020076";
const INSTAPAY = "salta3@instapay";

const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxoJBFVMk_jbmuLC5w59zQko5tYn9NvoZ9iWWPnLyyBMf4u-J6OfArH6JhIU8UK95o/exec";
const ADMIN_SECRET_KEY = "Adam";

const DEFAULT_DELIVERY_AREAS = [
  { name: "شربين (داخل البلد)", price: 15 },
  { name: "شارع المركز والقرى المجاورة", price: 20 },
  { name: "البرامون", price: 30 },
  { name: "كفر الحطبة", price: 35 },
  { name: "الشناوي", price: 35 },
  { name: "دنجواي", price: 40 }
];

const DEFAULT_PROMO_CODES = [
  { code: "SALTA3", discount: 10 },
  { code: "BURGER15", discount: 15 }
];

// قائمة الطعام الكاملة المستخرجة من الصور المرفقة
const DEFAULT_MENU = [
  // --- قسم البرجر ---
  { id: "b1", cat: "البرجر", name: "كلاسيك بيف", desc: "خس + طماطم + خيار مخلل + لحم بقري محشو جبن + صوص تكساس + صوص باربيكيو + شيدر", sizes: [{ label: "كلاسيك", price: 100 }, { label: "دبل", price: 170 }] },
  { id: "b2", cat: "البرجر", name: "أمريكان هاووس", desc: "خس + طماطم + خيار مخلل + لحم بقري محشو جبن + بيف بيكون + مشروم + بصل مكرمل + صوص تكساس + صوص باربيكيو + شيدر", sizes: [{ label: "كلاسيك", price: 135 }, { label: "دبل", price: 205 }] },
  { id: "b3", cat: "البرجر", name: "مستر سلطع (سبيشال)", desc: "خس + طماطم + خيار مخلل + لحم بقري محشو جبن + بيف بيكون + مشروم + بصل مكرمل + موتزريلا استيك + حلقات بصل + صوص تكساس + صوص باربيكيو + شيدر", isBestSeller: true, rank: 1, sizes: [{ label: "كلاسيك", price: 160 }, { label: "دبل", price: 230 }] },
  { id: "b4", cat: "البرجر", name: "تشيزي رانش", desc: "عيش راوند + خس + طماطم + خيار مخلل + فيليه فريش + صوص رانش + صوص شيدر", sizes: [{ label: "كلاسيك", price: 90 }, { label: "دبل", price: 160 }] },
  { id: "b5", cat: "البرجر", name: "بيج فاير", desc: "عيش راوند + خس + طماطم + خيار مخلل + فيليه فريش + تركي مدخن + دوريتوس + صوص رانش + صوص شيدر", sizes: [{ label: "كلاسيك", price: 105 }, { label: "دبل", price: 175 }] },
  { id: "b6", cat: "البرجر", name: "ميجا فاير", desc: "خس + طماطم + خيار مخلل + فيليه فريش + تركي مدخن + سلامي + موتزريلا استيك + صوص رانش + صوص شيدر + صوص ألف جزيرة", isBestSeller: true, rank: 2, sizes: [{ label: "كلاسيك", price: 150 }, { label: "دبل", price: 220 }] },

  // --- قسم ركن البيتزا ---
  { id: "p1", cat: "ركن البيتزا", name: "بيتزا مارجريتا", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + زعتر", sizes: [{ label: "L", price: 150 }, { label: "XL", price: 200 }] },
  { id: "p2", cat: "ركن البيتزا", name: "بيتزا مكس جبن", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا مكس + صوص الشيدر", sizes: [{ label: "L", price: 175 }, { label: "XL", price: 225 }] },
  { id: "p3", cat: "ركن البيتزا", name: "بيتزا تشيكن باربيكيو", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + شيش + زنجر + فلفل + زيتون + صوص باربيكيو", sizes: [{ label: "L", price: 215 }, { label: "XL", price: 295 }] },
  { id: "p4", cat: "ركن البيتزا", name: "بيتزا تشيكن رانش", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + قطع استربس فريش + فلفل + زيتون + صوص رانش", isBestSeller: true, rank: 3, sizes: [{ label: "L", price: 215 }, { label: "XL", price: 295 }] },
  { id: "p5", cat: "ركن البيتزا", name: "بيتزا ببيروني", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + شرائح ببيروني + فلفل + زيتون + صوص سويت شيلي", sizes: [{ label: "L", price: 180 }, { label: "XL", price: 225 }] },
  { id: "p6", cat: "ركن البيتزا", name: "بيتزا مكس سلطع", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + شيش + زنجر + فلفل + زيتون + كوردن بلو", isBestSeller: true, rank: 4, sizes: [{ label: "L", price: 260 }, { label: "XL", price: 320 }] },
  { id: "p7", cat: "ركن البيتزا", name: "بيتزا مكس بيف", desc: "عجينة بيتزا بخلطة سلطع السحرية بالزبدة + صلصة سلطع + جبنة موتزريلا طبيعي + مفروم + هوت دوج + ببيروني + فلفل + زيتون", sizes: [{ label: "L", price: 280 }, { label: "XL", price: 340 }] },
  { id: "p8", cat: "ركن البيتزا", name: "إضافة حشو أطراف", desc: "إضافة حشو أطراف غني للبيتزا", price: 80 },

  // --- قسم الكريبات ---
  { id: "c1", cat: "الكريبات", name: "كريب بانيه", desc: "قطع بانيه + شيدر + كاتشب", sizes: [{ label: "عادي", price: 90 }, { label: "كونو", price: 110 }] },
  { id: "c2", cat: "الكريبات", name: "كريب سوبر كرانشي", desc: "استريتس فريش + تركي مدخن + صوص رانش + كاتشب + شيدر", sizes: [{ label: "عادي", price: 120 }, { label: "كونو", price: 140 }] },
  { id: "c3", cat: "الكريبات", name: "كريب زنجر", desc: "استريتس سبايسي + سويت شيلي + صوص شيدر", sizes: [{ label: "عادي", price: 120 }, { label: "كونو", price: 140 }] },
  { id: "c4", cat: "الكريبات", name: "كريب شيش طاووق", desc: "قطع شيش فريش + صوص باربيكيو", sizes: [{ label: "عادي", price: 120 }, { label: "كونو", price: 140 }] },
  { id: "c5", cat: "الكريبات", name: "كريب بلي بلو", desc: "كوردن بلو فريش + صوص شيدر + رانش", sizes: [{ label: "عادي", price: 130 }, { label: "كونو", price: 150 }] },
  { id: "c6", cat: "الكريبات", name: "كريب كفتة", desc: "كفتة فحم فريش + صوص تكساس", sizes: [{ label: "عادي", price: 110 }, { label: "كونو", price: 130 }] },
  { id: "c7", cat: "الكريبات", name: "كريب مكس نووي", desc: "كوردن بلو + استرس + بانيه + شيش + صوص ثاوزند ايلاند + صوص شيدر", sizes: [{ label: "عادي", price: 150 }, { label: "كونو", price: 170 }] },
  { id: "c8", cat: "الكريبات", name: "كريب مكس لحوم", desc: "كفتة + مفروم + هوت دوج + ببيروني + تكساس + باربيكيو", sizes: [{ label: "عادي", price: 160 }, { label: "كونو", price: 180 }] },
  { id: "c9", cat: "الكريبات", name: "كريب بوم", desc: "شيش + كفتة + صوص باربيكيو + صوص شيدر + كاتشب", sizes: [{ label: "عادي", price: 150 }] },
  { id: "c10", cat: "الكريبات", name: "كريب بطاطس", desc: "بطاطس + صوص شيدر", sizes: [{ label: "عادي", price: 70 }, { label: "كونو", price: 90 }] },
  { id: "c11", cat: "الكريبات", name: "كريب مكس تشيز", desc: "جبن موتزريلا طبيعية مكس + صوص شيدر", sizes: [{ label: "عادي", price: 75 }] },

  // --- قسم الباستا ---
  { id: "pa1", cat: "الباستا", name: "النجرسكو", desc: "صوص الوايت + ماشروم + مكرونة + قطع فراخ فريش + جبنة موتزريلا", price: 150 },
  { id: "pa2", cat: "الباستا", name: "الفريدوا", desc: "صوص الوايت + ماشروم + مكرونة + قطع فراخ فريش + جبنة رومي + توست", price: 140 },
  { id: "pa3", cat: "الباستا", name: "ماك اند تشيز", desc: "مكرونة غرقانة بصوص الشيدر", price: 100 },

  // --- قسم الساندوتشات ---
  { id: "s1", cat: "الساندوتشات", name: "بيج فيلر", desc: "عيش فيلر زبدة + خس + 3 استريس فريش + صوص رانش + أمريكان شيدر + سلامي", price: 120 },
  { id: "s2", cat: "الساندوتشات", name: "بيج تويستر", desc: "عيش تورتيلا + صوص رانش + صوص شيدر + جبنة موتزريلا طبيعي + استريس فريش", price: 95 },

  // --- قسم الريزو ---
  { id: "r1", cat: "الريزو", name: "ريزو شيش", desc: "أرز بسمتي + قطع شيش طاووق + صوص الريزو", price: 80 },
  { id: "r2", cat: "الريزو", name: "ريزو تشيكن", desc: "أرز بسمتي + قطع استريس + صوص الريزو", price: 90 },

  // --- قسم المقبلات ---
  { id: "m1", cat: "المقبلات", name: "باكت فرايز", desc: "بطاطس مقرمشة ذهبية", price: 20 },
  { id: "m2", cat: "المقبلات", name: "تشيز فرايز", desc: "بطاطس + صوص شيدر غني", price: 50 },
  { id: "m3", cat: "المقبلات", name: "تشيز تشيكن", desc: "بطاطس + قطع استرس فريش + صوص شيدر + هالبينيو", price: 90 },
  { id: "m4", cat: "المقبلات", name: "سموك فرايز", desc: "بطاطس + قطع استرس فريش + صوص باربيكيو + بيف بيكون", price: 100 }
];

const money = (n) => Number(n || 0).toLocaleString("en-US") + " جنيه";

const checkRestaurantStatus = () => {
  const nowInEgypt = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
  const hours = nowInEgypt.getHours();
  const isOpen = hours >= 12 || hours < 3; // يعمل من 12 ظهراً وحتى 3 صباحاً

  return {
    isOpen,
    text: isOpen ? "مفتوح الآن 🟢" : "مغلق حالياً 🔴",
    timeText: "يومياً من 12:00 ظهراً لـ 3:00 صباحاً"
  };
};

const copyTextToClipboard = (text) => {
  if (typeof document === "undefined") return false;
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let success = false;
  try { success = document.execCommand("copy"); } catch (err) {}
  document.body.removeChild(textArea);
  return success;
};

export default function Salta3Menu() {
  const [items, setItems] = useState(DEFAULT_MENU);
  const [activeCat, setActiveCat] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedCart = localStorage.getItem("salta3-saved-cart");
      if (savedCart) {
        try { return JSON.parse(savedCart); } catch (e) {}
      }
    }
    return {};
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [animateCart, setAnimateCart] = useState(false);
  const [restaurantStatus] = useState(checkRestaurantStatus());

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedOrderResult, setTrackedOrderResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  const [deliveryAreas, setDeliveryAreas] = useState(DEFAULT_DELIVERY_AREAS);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(-1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [validationError, setValidationError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState("");

  const [enteredPromo, setEnteredPromo] = useState("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  const findItem = (id) => items.find((i) => i.id === id);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("salta3-saved-cart", JSON.stringify(cart));
    }
  }, [cart]);

  const cartList = useMemo(() => {
    return Object.entries(cart)
      .filter((entry) => entry[1] > 0)
      .map((entry) => {
        const key = entry[0];
        const qty = entry[1];
        const parts = key.split("::");
        const id = parts[0];
        const sizeLabel = parts[1] || "";
        const item = findItem(id);
        if (!item) return null;
        const price = sizeLabel ? item.sizes?.find((s) => s.label === sizeLabel)?.price ?? 0 : item.price;
        const label = sizeLabel ? item.name + " (" + sizeLabel + ")" : item.name;
        return { key, id, label, price, qty };
      })
      .filter(Boolean);
  }, [cart, items]);

  const cartCount = useMemo(() => cartList.reduce((s, i) => s + i.qty, 0), [cartList]);
  const cartTotal = useMemo(() => cartList.reduce((s, i) => s + i.qty * i.price, 0), [cartList]);

  const addToCart = (key, delta) => {
    setCart((c) => {
      const nextCart = { ...c };
      nextCart[key] = Math.max(0, (c[key] || 0) + delta);
      return nextCart;
    });

    if (delta > 0) {
      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 500);
    }
  };

  const handleClearCart = () => {
    setCart({});
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("salta3-saved-cart");
    }
  };

  const activeDeliveryArea = useMemo(() => {
    if (selectedAreaIndex >= 0 && selectedAreaIndex < deliveryAreas.length) {
      return deliveryAreas[selectedAreaIndex];
    }
    return { name: "اختر المنطقة...", price: 0 };
  }, [selectedAreaIndex, deliveryAreas]);

  const discountAmount = useMemo(() => Math.round((cartTotal * appliedDiscountPercent) / 100), [cartTotal, appliedDiscountPercent]);
  const finalTotal = useMemo(() => Math.max(0, cartTotal - discountAmount) + activeDeliveryArea.price, [cartTotal, discountAmount, activeDeliveryArea]);

  const handleApplyPromo = () => {
    const codeClean = enteredPromo.trim().toUpperCase();
    if (!codeClean) return;
    const match = DEFAULT_PROMO_CODES.find(p => p.code.toUpperCase() === codeClean);
    if (match) { setAppliedDiscountPercent(match.discount); setPromoError(""); }
    else { setAppliedDiscountPercent(0); setPromoError("كود الخصم غير صحيح!"); }
  };

  const categories = useMemo(() => ["الكل", ...new Set(items.map(i => i.cat))], [items]);
  const bestSellerItems = useMemo(() => items.filter(item => item.isBestSeller).sort((a,b) => (a.rank || 99) - (b.rank || 99)), [items]);

  const visibleItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCat === "الكل" || item.cat === activeCat;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;
      return matchesCategory && (item.name.toLowerCase().includes(cleanQuery) || (item.desc && item.desc.toLowerCase().includes(cleanQuery)));
    });
  }, [items, activeCat, searchQuery]);

  const sendWhatsApp = async () => {
    if (cartList.length === 0) { setValidationError("السلة فارغة، اختر أصنافك أولاً."); return; }
    if (!customerName.trim()) { setValidationError("من فضلك اكتب اسمك."); return; }
    if (!customerPhone.trim()) { setValidationError("من فضلك اكتب رقم الموبايل."); return; }
    if (!customerAddress.trim()) { setValidationError("من فضلك اكتب العنوان بالتفصيل."); return; }
    if (selectedAreaIndex === -1) { setValidationError("من فضلك اختر منطقة التوصيل."); return; }

    setValidationError("");
    const lines = cartList.map((i) => "• " + i.label + " x" + i.qty + " — " + money(i.price * i.qty));
    const paymentText = paymentMethod === "cash" ? "💵 نقدي (كاش)" : "📱 دفع إلكتروني";
    const generatedOrderId = "SALTA3-" + new Date().toISOString().replace(/[-:T]/g, "").slice(0, 10) + "-" + Math.floor(100 + Math.random() * 900);
    setLastCreatedOrderId(generatedOrderId);

    let text = `طلب جديد من مطعم ${RESTAURANT_NAME} 🍔\n\n🆔 رقم الأوردر: ${generatedOrderId}\n👤 العميل: ${customerName}\n📱 الهاتف: ${customerPhone}\n💳 الدفع: ${paymentText}\n📍 المنطقة: ${activeDeliveryArea.name}\n🏠 العنوان: ${customerAddress}\n\nالطلبات:\n${lines.join("\n")}\n\n💵 حساب الأكل: ${money(cartTotal)}\n🛵 التوصيل: ${money(activeDeliveryArea.price)}\n💰 الإجمالي: ${money(finalTotal)}`;
    window.open("https://wa.me/" + WHATSAPP_NUMBER.replace(/[^\d+]/g, "") + "?text=" + encodeURIComponent(text), "_blank");

    setCartOpen(false); setCart({}); setOrderSuccess(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#120500] text-white font-['Tajawal'] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#240A00]/95 backdrop-blur-md border-b border-orange-500/20 px-4 py-3 flex items-center justify-between">
        <div className="cursor-pointer flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-black text-xl border-2 border-yellow-400 text-yellow-300 shadow-md">🍔</div>
          <div className="text-right">
            <span className="text-base font-black text-orange-400 tracking-wider block leading-none">{RESTAURANT_NAME}</span>
            <span className="text-[9px] text-yellow-400/80 font-bold uppercase tracking-widest">MR SALTA3 BURGER</span>
          </div>
        </div>

        <button onClick={() => setCartOpen(true)} className={`p-2 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 relative transition-transform duration-300 ${animateCart ? "scale-125 bg-orange-400 text-black" : ""}`}>
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-8 bg-gradient-to-b from-[#3B0F00] via-[#240A00] to-[#120500] text-center px-4 space-y-3 border-b border-orange-500/20">
        <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-1">
          {TAGLINE}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-yellow-400 tracking-wide drop-shadow-md">{RESTAURANT_NAME}</h1>
        <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-md mx-auto">{ADDRESS}</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-bold">
          <a href={`tel:${PHONE_1}`} className="px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-yellow-300 flex items-center gap-1"><Phone size={12}/> {PHONE_1}</a>
          <a href={`tel:${PHONE_2}`} className="px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-yellow-300 flex items-center gap-1"><Phone size={12}/> {PHONE_2}</a>
        </div>
      </section>

      {/* Categories Bar */}
      <nav className="sticky top-[61px] z-20 bg-[#120500]/95 backdrop-blur-md border-b border-orange-500/20 py-3 px-4">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCat(c)} className={`px-5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${activeCat === c ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg shadow-orange-500/20" : "bg-[#240A00] text-gray-300 border border-orange-500/10 hover:bg-white/5"}`}>
              <span>{c === "البرجر" ? "🍔" : c === "ركن البيتزا" ? "🍕" : c === "الكريبات" ? "🌮" : c === "الباستا" ? "🍝" : c === "الساندوتشات" ? "🥪" : c === "الريزو" ? "🍚" : "🍟"}</span>
              <span>{c}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن برجر، بيتزا، كريب، باستا..." className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#1D0800] border border-orange-500/20 text-xs text-white focus:outline-none focus:border-orange-400" />
          <Search size={15} className="absolute right-3.5 top-3 text-orange-400" />
        </div>
      </div>

      {/* Menu List */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {visibleItems.map((item) => (
          <div key={item.id} className="bg-[#1D0800] border border-orange-500/20 rounded-3xl p-4 flex flex-col justify-between shadow-md hover:border-orange-500/40 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-yellow-400">{item.name}</h3>
                {item.isBestSeller && <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-600 text-white font-black">🔥 الأكثر طلباً</span>}
              </div>
              {item.desc && <p className="text-[11px] text-gray-300 leading-relaxed">{item.desc}</p>}
            </div>

            <div className="mt-3 pt-2 border-t border-orange-500/10 space-y-2">
              {item.sizes ? (
                item.sizes.map((sz) => {
                  const key = item.id + "::" + sz.label;
                  const qty = cart[key] || 0;
                  return (
                    <div key={sz.label} className="flex items-center justify-between text-xs bg-[#2B0C00] p-2 px-3 rounded-xl border border-orange-500/10">
                      <span className="text-gray-200 font-bold">{sz.label}</span>
                      <span className="text-yellow-400 font-black text-xs">{money(sz.price)}</span>
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => addToCart(key, -1)} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"><Minus size={10} /></button>
                          <span className="font-black text-white text-xs">{qty}</span>
                          <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-full bg-orange-500 text-black flex items-center justify-center font-bold"><Plus size={10} /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(key, 1)} className="p-1.5 rounded-full bg-orange-500 text-black font-black active:scale-95"><Plus size={12} /></button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-yellow-400">{money(item.price)}</span>
                  {cart[item.id] > 0 ? (
                    <div className="flex items-center gap-2 bg-[#2B0C00] px-2.5 py-1 rounded-full border border-orange-500/10">
                      <button onClick={() => addToCart(item.id, -1)} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"><Minus size={10} /></button>
                      <span className="font-bold text-xs">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id, 1)} className="w-5 h-5 rounded-full bg-orange-500 text-black flex items-center justify-center font-bold"><Plus size={10} /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item.id, 1)} className="p-2 rounded-full bg-orange-500 text-black active:scale-95"><Plus size={13} /></button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-30 px-4">
          <div onClick={() => setCartOpen(true)} className="max-w-md mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black p-3.5 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black text-yellow-400 flex items-center justify-center font-black text-xs">{cartCount}</div>
              <div><p className="text-xs font-black">سلة الطلبات ({cartCount})</p><p className="text-[10px] font-bold opacity-90">{money(cartTotal)}</p></div>
            </div>
            <button className="px-4 py-1.5 rounded-xl bg-black text-yellow-400 text-xs font-black flex items-center gap-1">عرض السلة والدفع <ChevronLeft size={14} /></button>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="relative z-10 w-full max-w-lg bg-[#120500] border-t border-orange-500/30 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
              <h3 className="text-base font-black text-yellow-400 flex items-center gap-1.5"><ShoppingCart size={18} /><span>سلة الطلبات ({cartCount})</span></h3>
              <button onClick={() => setCartOpen(false)} className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold"><X size={14} /></button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {cartList.map((cartItem) => (
                <div key={cartItem.key} className="flex items-center justify-between text-xs p-2.5 bg-[#2B0C00] rounded-xl border border-orange-500/10">
                  <div><p className="font-bold text-white">{cartItem.label}</p><p className="text-yellow-400 font-bold">{money(cartItem.price)}</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addToCart(cartItem.key, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Minus size={12} /></button>
                    <span className="font-bold text-white">{cartItem.qty}</span>
                    <button onClick={() => addToCart(cartItem.key, 1)} className="w-6 h-6 rounded-full bg-orange-500 text-black flex items-center justify-center font-bold"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-orange-500/20 text-xs">
              <input type="text" placeholder="اسمك الكريم..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2.5 rounded-xl bg-[#2B0C00] border border-orange-500/20 text-white" />
              <input type="tel" placeholder="رقم تليفونك..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-[#2B0C00] border border-orange-500/20 text-white" />
              
              <select value={selectedAreaIndex} onChange={e => setSelectedAreaIndex(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-[#2B0C00] border border-orange-500/20 text-white">
                <option value={-1}>اختر منطقة التوصيل...</option>
                {deliveryAreas.map((a, i) => <option key={i} value={i}>{a.name} (+{money(a.price)})</option>)}
              </select>

              <input type="text" placeholder="العنوان بالتفصيل..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full p-2.5 rounded-xl bg-[#2B0C00] border border-orange-500/20 text-white" />
            </div>

            {validationError && <p className="text-xs text-red-400 text-center font-bold bg-red-500/10 py-1.5 rounded-lg">{validationError}</p>}

            <button onClick={sendWhatsApp} className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-black text-xs flex items-center justify-center gap-2 active:scale-98 shadow-lg">
              <MessageCircle size={18} /> تأكيد وإرسال عبر واتساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
