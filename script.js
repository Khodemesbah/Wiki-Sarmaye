// ===== ویکی‌سرمایه — انیمیشن‌های تعاملی (vanilla JS) =====

// ۱) ظاهرشدن تدریجی عناصر هنگام اسکرول (مثل سایت اپل)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // هر عنصر فقط یک بار انیمیت می‌شود
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  // تاخیر پله‌ای کوچک برای حس موجی‌شدن ورود عناصر
  el.style.transitionDelay = ((i % 4) * 90) + "ms";
  observer.observe(el);
});

// ۲) سایه نوار بالا بعد از شروع اسکرول
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  },
  { passive: true }
);

// ۳) محو و جابجایی نرم هیرو هنگام اسکرول (پارالاکس سبک)
const hero = document.querySelector(".hero");
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.opacity = String(1 - y / (window.innerHeight * 0.9));
      hero.style.transform = "translateY(" + y * 0.15 + "px)";
    }
  },
  { passive: true }
);

// ۴) دارک مود به سبک اپل
// localStorage در بعضی حالت‌های Private خطا می‌دهد؛ همه دسترسی‌ها امن شده‌اند
function storeSet(key, val) {
  try { localStorage.setItem(key, val); } catch (e) {}
}
function storeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
const root = document.documentElement;
const savedTheme = storeGet("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  // اگر کاربر انتخابی نکرده باشد، از حالت سیستم پیروی می‌کند
  root.setAttribute("data-theme", "dark");
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  storeSet("theme", next); // انتخاب کاربر ذخیره می‌شود
});

// ۵) منوی همبرگری — با قفل اسکرول مطمئن برای iOS
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
let scrollLockY = 0;
function lockScroll(lock) {
  if (lock) {
    scrollLockY = window.scrollY;
    document.body.classList.add("menu-open");
    document.body.style.top = -scrollLockY + "px";
  } else {
    document.body.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollLockY); // بازگشت به همان نقطه قبل از بازشدن منو
  }
}
burger.addEventListener("click", () => {
  const isOpen = burger.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
  menu.classList.toggle("open");
  lockScroll(isOpen);
});
// با کلیک روی هر لینک، منو بسته می‌شود
menu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
    lockScroll(false);
  });
});

// ۶) هماهنگی رنگ نوار وضعیت iOS با تم
const metaTheme = document.getElementById("metaTheme");
function syncMetaTheme() {
  metaTheme.setAttribute(
    "content",
    root.getAttribute("data-theme") === "dark" ? "#000000" : "#ffffff"
  );
}
syncMetaTheme();
document.getElementById("themeToggle").addEventListener("click", syncMetaTheme);

// ۷) نوار پیشرفت مطالعه + دکمه بازگشت به بالا
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (window.scrollY / max) * 100 + "%";
    toTop.classList.toggle("show", window.scrollY > window.innerHeight);
  },
  { passive: true }
);
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ۸) هایلایت بخش فعال در منو
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        menu.querySelectorAll("a").forEach((a) => {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
["methods", "compare", "tools", "advice", "scenario", "mistakes", "glossary"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ۹) ماشین‌حساب بازدهی واقعی
// نرخ‌های اسمی سالانه (درصد) — فرض‌های ساده‌شده، اینجا قابل ویرایش
const nominalRates = {
  "سپرده بانکی": 20.5,
  "درآمد ثابت": 30,
  "طلا / صندوق طلا": 40,
  "دلار": 35,
  "صندوق سهامی / شاخصی": 45,
  "مسکن": 35,
};
const faNumber = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
document.getElementById("calcRun").addEventListener("click", () => {
  const p = Number(document.getElementById("calcAmount").value) || 0;
  const n = Number(document.getElementById("calcYears").value) || 0;
  const inf = (Number(document.getElementById("calcInflation").value) || 0) / 100;
  const box = document.getElementById("calcResults");
  box.innerHTML = "";
  const rows = Object.entries(nominalRates).map(([name, r]) => ({
    name,
    real: p * Math.pow((1 + r / 100) / (1 + inf), n), // ارزش به قیمت امروز
  }));
  const maxVal = Math.max.apply(null, rows.map((x) => x.real));
  rows.sort((a, b) => b.real - a.real).forEach((x) => {
    const row = document.createElement("div");
    row.className = "calc-row";
    const cls = x.real >= p ? "good" : "bad";
    row.innerHTML =
      "<span>" + x.name + "</span>" +
      '<span class="calc-bar"><i style="width:' + (x.real / maxVal) * 100 + '%"></i></span>' +
      '<span class="calc-val ' + cls + '">' + faNumber.format(x.real) + "</span>";
    box.appendChild(row);
  });
  box.insertAdjacentHTML(
    "beforeend",
    '<p class="tool-note">اعداد به میلیون تومان و به قیمت امروز (پس از کسر تورم) هستند؛ سبز = حفظ یا رشد قدرت خرید، قرمز = عقب‌ماندن از تورم.</p>'
  );
});

// ۱۰) کوییز پروفایل ریسک
document.getElementById("quizRun").addEventListener("click", () => {
  let total = 0;
  let answered = 0;
  for (let i = 1; i <= 5; i++) {
    const sel = document.querySelector('input[name="q' + i + '"]:checked');
    if (sel) {
      total += Number(sel.value);
      answered++;
    }
  }
  const out = document.getElementById("quizResult");
  if (answered < 5) {
    out.textContent = "به هر ۵ سؤال پاسخ دهید.";
    return;
  }
  const profile = total <= 8 ? "محافظه‌کار" : total <= 12 ? "متعادل" : "تهاجمی";
  storeSet("riskProfile", profile); // برای بازدیدهای بعدی ذخیره می‌شود
  out.innerHTML =
    'پروفایل شما: <strong>' + profile + '</strong> — ترکیب پیشنهادی‌اش را در <a href="#advice">بخش پیشنهادها</a> ببینید.';
});

// ۱۱) بنر پروفایل ذخیره‌شده — در بازدید بعدی نمایش داده می‌شود
const profileBanner = document.getElementById("profileBanner");
const savedProfile = storeGet("riskProfile");
let bannerClosed = null;
try { bannerClosed = sessionStorage.getItem("bannerClosed"); } catch (e) {}
if (savedProfile && bannerClosed !== "1") {
  document.getElementById("profileBannerText").textContent =
    "پروفایل ریسک شما: " + savedProfile;
  profileBanner.hidden = false;
}
document.getElementById("profileBannerClose").addEventListener("click", () => {
  profileBanner.hidden = true;
  try { sessionStorage.setItem("bannerClosed", "1"); } catch (e) {} // تا پایان همین بازدید بسته می‌ماند
});

// ۱۲) مقایسه‌گر رو در رو — داده‌ها همان جدول مقایسه است
const duelData = {
  "سپرده بانکی": { "پوشش تورم": "ضعیف", "بازدهی ذاتی": "سود ثابت", "نوسان / ریسک": "تقریباً صفر", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "کوتاه" },
  "درآمد ثابت": { "پوشش تورم": "متوسط", "بازدهی ذاتی": "سود روزشمار", "نوسان / ریسک": "خیلی کم", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "کوتاه تا میان" },
  "طلا / صندوق طلا": { "پوشش تورم": "خوب", "بازدهی ذاتی": "ندارد", "نوسان / ریسک": "متوسط", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "میان تا بلند" },
  "دلار / ارز": { "پوشش تورم": "متوسط", "بازدهی ذاتی": "ندارد", "نوسان / ریسک": "متوسط", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "کوتاه تا میان" },
  "سهام": { "پوشش تورم": "خوب (بلندمدت)", "بازدهی ذاتی": "رشد + سود نقدی", "نوسان / ریسک": "بالا", "نقدشوندگی": "متوسط", "حداقل سرمایه": "کم", "افق مناسب": "بلند" },
  "صندوق سهامی / شاخصی": { "پوشش تورم": "خوب (بلندمدت)", "بازدهی ذاتی": "رشد + سود", "نوسان / ریسک": "بالا ولی متنوع", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "بلند" },
  "مسکن / زمین": { "پوشش تورم": "خوب", "بازدهی ذاتی": "اجاره", "نوسان / ریسک": "متوسط", "نقدشوندگی": "پایین", "حداقل سرمایه": "خیلی بالا", "افق مناسب": "بلند" },
  "رمزارز": { "پوشش تورم": "نامطمئن", "بازدهی ذاتی": "ندارد (غالباً)", "نوسان / ریسک": "خیلی بالا", "نقدشوندگی": "بالا", "حداقل سرمایه": "کم", "افق مناسب": "بلند" },
  "کسب‌وکار": { "پوشش تورم": "بالقوه عالی", "بازدهی ذاتی": "سود عملیاتی", "نوسان / ریسک": "خیلی بالا", "نقدشوندگی": "خیلی پایین", "حداقل سرمایه": "متغیر", "افق مناسب": "بلند" },
};
const duelA = document.getElementById("duelA");
const duelB = document.getElementById("duelB");
Object.keys(duelData).forEach((name) => {
  duelA.insertAdjacentHTML("beforeend", "<option>" + name + "</option>");
  duelB.insertAdjacentHTML("beforeend", "<option>" + name + "</option>");
});
duelA.value = "طلا / صندوق طلا";
duelB.value = "صندوق سهامی / شاخصی";
function renderDuel() {
  const box = document.getElementById("duelResult");
  box.innerHTML = "";
  [duelA.value, duelB.value].forEach((name) => {
    const d = duelData[name];
    let html = '<div class="duel-col"><h4>' + name + "</h4>";
    for (const k in d) {
      html += '<p><span class="lbl">' + k + ":</span> " + d[k] + "</p>";
    }
    box.insertAdjacentHTML("beforeend", html + "</div>");
  });
}
duelA.addEventListener("change", renderDuel);
duelB.addEventListener("change", renderDuel);
renderDuel();
