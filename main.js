// =================================================
// 1. المتغيرات العامة (Global Variables)
// =================================================
let activePromo = "";

// =================================================
// 2. كود تشغيل الموقع (عند تحميل الصفحة)
// =================================================
document.addEventListener('DOMContentLoaded', function () {

    // --- أ. أساسيات الموقع (التمرير والقائمة) ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // القائمة الجانبية
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');

    if (mobileMenu && navUl) {
        mobileMenu.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            navUl.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (navUl.classList.contains('show')) {
                if (!navUl.contains(e.target) && !mobileMenu.contains(e.target)) {
                    navUl.classList.remove('show');
                }
            }
        });
    }

    // --- ب. التنقل والروابط ---
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, .bottom-nav a');
    const pages = document.querySelectorAll('.page');

    // دالة إظهار الصفحة
    function showPage(pageId) {
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            if (pages.length > 0) {
                pages.forEach(p => p.classList.remove('active'));
                targetSection.classList.add('active');
            }
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // تفعيل النقر على الروابط
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            let pageId = this.getAttribute('data-page');

            // استخراج القسم من الرابط إذا كان يحتوي على #
            if (!pageId && this.getAttribute('href') && this.getAttribute('href').includes('#')) {
                try { pageId = this.getAttribute('href').split('#')[1]; } catch (err) { }
            }

            // إذا كان القسم موجوداً
            if (pageId && document.getElementById(pageId)) {
                e.preventDefault();

                // تحديث أزرار القائمة (إزالة البرتقالي من الكل وإضافته للزر المضغوط)
                document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
                // نحاول تلوين الزر الذي تم ضغطه إذا كان من القائمة العلوية
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                } else {
                    // إذا ضغطنا رابطاً من الفوتر، نبحث عن الزر المقابل في الأعلى ونلونه
                    const correspondingLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
                    if (correspondingLink) correspondingLink.classList.add('active');
                }

                const targetSection = document.getElementById(pageId);
                // إذا كنا بالفعل في القسم، لا نفعل شيئاً سوى التمرير
                if (targetSection.classList.contains('active')) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    if (navUl) navUl.classList.remove('show');
                    return;
                }

                showPage(pageId);
                if (navUl) navUl.classList.remove('show');
                // تحديث التاريخ لزر الرجوع
                history.pushState(null, null, '#' + pageId);
            }
        });
    });

    // ----------------------------------------------------
    // 👇👇👇 هنا الإصلاح: فحص الرابط عند الفتح وتلوين الزر الصحيح 👇👇👇
    // ----------------------------------------------------
    const hash = window.location.hash.substring(1);

    // 1. تنظيف كل الأزرار أولاً
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    if (hash && document.getElementById(hash)) {
        // إذا كان هناك هاش (مثل #products)، أظهر القسم ولون زر المنتجات
        showPage(hash);
        const activeBtn = document.querySelector(`.nav-link[href="#${hash}"], .nav-link[data-page="${hash}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    } else {
        // إذا لم يكن هناك هاش، أظهر الرئيسية ولون زر الرئيسية
        if (document.getElementById('home')) {
            showPage('home'); // تأكد من وجود دالة showPage
            const homeBtn = document.querySelector('.nav-link[data-page="home"]');
            if (homeBtn) homeBtn.classList.add('active');
        }
    }
    // ----------------------------------------------------

    // --- ج. ميزات إضافية (FAQ + Design + Countdown) ---

    // 1. الأسئلة الشائعة
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    faqItems.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

    // 2. أداة "صمم بنفسك" (رفع الصور)
    const uploadInput = document.getElementById('imageUpload');
    const previewImage = document.getElementById('user-design-preview');
    if (uploadInput && previewImage) {
        uploadInput.addEventListener('change', function (event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                reader.readAsDataURL(event.target.files[0]);
            }
        });
    }

    // 3. عداد الكان (المغرب 2025)
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        startCanCountdown(countdownElement);
    }
    // =========================================
    // 🧊 تشغيل تأثير 3D للبطاقات
    // =========================================

    // نختار البطاقات التي نريد تطبيق التأثير عليها
    const tiltCards = document.querySelectorAll('.product-card, .feature-card, .step-card, .review-card');

    if (typeof VanillaTilt !== 'undefined' && tiltCards.length > 0) {
        VanillaTilt.init(tiltCards, {
            max: 15,            // درجة الميلان
            speed: 400,         // سرعة الحركة
            glare: true,        // تفعيل لمعة الضوء
            "max-glare": 0.3,   // قوة اللمعة
            scale: 1.05         // تكبير بسيط
        });
    }

}); // <--- نهاية DOMContentLoaded


// =================================================
// 3. الدوال الخارجية (تعمل مع أزرار HTML)
// =================================================

// 1. دالة عداد الكان
function startCanCountdown(element) {
    const countDate = new Date('Dec 21, 2025 00:00:00').getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        const boxStyle = "background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 10px; border-radius: 8px; width: 60px; color: white; backdrop-filter: blur(5px);";
        const numStyle = "font-size: 18px; font-weight: bold; display: block;";
        const labelStyle = "font-size: 11px; opacity: 0.9;";

        element.innerHTML = `
            <div style="${boxStyle}"><span style="${numStyle}">${d}</span><span style="${labelStyle}">يوم</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${h}</span><span style="${labelStyle}">ساعة</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${m}</span><span style="${labelStyle}">دقيقة</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${s}</span><span style="${labelStyle}">ث</span></div>
        `;
    }, 1000);
}

// 2. دالة طلب أقمصة المنتخب (والباقة)
function orderJersey(productName, nameId, numId) {
    var nameInput = document.getElementById(nameId);
    var numInput = document.getElementById(numId);

    var name = nameInput ? nameInput.value : "";
    var num = numInput ? numInput.value : "";

    var details = "";
    if (name && num) details = ` (الاسم: ${name} - الرقم: ${num})`;
    else if (name) details = ` (الاسم: ${name})`;
    else details = " (بدون تخصيص)";

    var text = `سلام Zon Print، بغيت ${productName} 🇲🇦 ${details}`;
    var url = "https://wa.me/212645717242?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
}

// 3. دالة مسابقة التوقعات
function sendPrediction() {
    var scoreMa = document.getElementById('scoreMa').value;
    var scoreOther = document.getElementById('scoreOther').value;

    if (scoreMa !== "" && scoreOther !== "") {
        var text = `توقعي لمباراة المغرب: المغرب ${scoreMa} - ${scoreOther} الخصم.`;
        window.open(`https://wa.me/212645717242?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        alert("المرجو كتابة التوقع");
    }
}

// 6. دالة إرسال الواتساب العامة
function sendToWhatsApp(e) {
    if (e) e.preventDefault();
    var nameEl = document.getElementById('name');
    var emailEl = document.getElementById('email');
    var msgEl = document.getElementById('message');

    if (nameEl && msgEl && nameEl.value) {
        var text = `الاسم: ${nameEl.value}%0Aالبريد: ${emailEl.value}%0Aالرسالة: ${msgEl.value} ${activePromo}`;
        window.open(`https://wa.me/212645717242?text=${text}`, '_blank');
    } else {
        alert("المرجو ملء المعلومات");
    }
}

// 7. دالة "إرسال الطلب" (تصميم خاص)
function orderCustomDesign() {
    const img = document.getElementById('user-design-preview');
    if (!img || img.style.display === "none" || img.src === "") {
        alert("المرجو اختيار صورة أولاً");
        return;
    }
    const text = "مرحباً Zon Print، لقد قمت باختيار صورة لطباعتها، سأرسلها لكم الآن 👇" + activePromo;
    window.open(`https://wa.me/212645717242?text=${encodeURIComponent(text)}`, '_blank');
}

// 8. الهيدر الشفاف
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
    }
});

// 9. زر العودة (Browser Back Button)
window.addEventListener('popstate', function (event) {
    if (window.location.hash) {
        const pageId = window.location.hash.substring(1);

        // تنظيف الأزرار وتلوين الزر الجديد عند الرجوع للخلف
        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (document.getElementById(pageId)) {
            const pages = document.querySelectorAll('.page');
            if (pages.length > 0) {
                pages.forEach(p => p.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
            }
        }
    } else {
        // العودة للرئيسية
        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
        const homeBtn = document.querySelector('.nav-link[data-page="home"]');
        if (homeBtn) homeBtn.classList.add('active');

        if (document.getElementById('home')) {
            const pages = document.querySelectorAll('.page');
            if (pages.length > 0) {
                pages.forEach(p => p.classList.remove('active'));
                document.getElementById('home').classList.add('active');
            }
        }
    }
});

// =========================================
// ⚽ نظام تغيير الخصم تلقائياً (جدول المباريات)
// =========================================

function updateMatchInfo() {
    const flagElement = document.getElementById('opponentFlag');
    const nameElement = document.getElementById('opponentName');

    if (!flagElement || !nameElement) return;

    const matches = [
        {
            date: "2026-01-09", // تاريخ المباراة الأولى
            name: "جزر القمر",
            flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/langfr-1280px-Flag_of_Cameroon.svg.png"
        },
        
    ];

    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < matches.length; i++) {
        if (matches[i].date >= today) {
            nameElement.innerText = matches[i].name;
            flagElement.src = matches[i].flag;
            return;
        }
    }

    nameElement.innerText = "قريباً...";
    flagElement.src = "images/logo.png.png";
}

document.addEventListener('DOMContentLoaded', updateMatchInfo);

// رقم عشوائي للمخزون
document.querySelectorAll('.stock-count').forEach(el => {
    el.innerText = Math.floor(Math.random() * (8 - 2 + 1) + 2);
});

// =========================================
// 📢 دالة مشاركة المنتج
// =========================================
function shareProduct(platform) {
    const currentUrl = window.location.href;
    const text = "شوف هذا المنتج الرائع من Zon Print! 😍👇";

    if (platform === 'whatsapp') {
        const url = `https://wa.me/?text=${encodeURIComponent(text)} ${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank');

    } else if (platform === 'facebook') {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank');

    } else if (platform === 'copy') {
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert("تم نسخ الرابط بنجاح! ✅");
        }).catch(err => {
            console.error('فشل النسخ', err);
        });
    }
}

// =========================================
// ⌨️ تأثير الآلة الكاتبة (Typewriter Effect)
// =========================================
document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const words = ["التيشرتات 👕", "الأكواب ☕", "الهواتف 📱", "القبعات 🧢", "الهدايا 🎁"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
            if (wordIndex === words.length) {
                wordIndex = 0;
            }
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
});

// --- إخفاء شاشة التحميل ---
const preloader = document.getElementById('preloader');
if (preloader) {
    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }, 1000);
    });
}

// =========================================
// 🎁 مستشار الهدايا الذكي
// =========================================
const giftSuggestions = {
    man: [
        { img: 'images/maroc-red.jpg', title: 'قميص المنتخب الرسمي 🇲🇦', link: 'index.html#products' },
        { img: 'images/mugwhite.jpg', title: 'كوب قهوة بتصميم خاص ☕', link: 'product-mugs.html' },
        { img: 'images/capusho2.jpg', title: 'هودي مريح وعصري 🧥', link: 'product-tshirts.html' },
        { img: 'images/hats3.jpg', title: 'قبعة رياضية مميزة 🧢', link: 'product-hats.html' }
    ],
    woman: [
        { img: 'images/mugmagic.jpg', title: 'كوب سحري يظهر الصورة بالحرارة ✨', link: 'product-mugs.html' },
        { img: 'images/totbag.jpg', title: 'حقيبة قماشية أنيقة (Tote Bag) 👜', link: 'product-accessories.html' },
        { img: 'images/Coussin.jpg', title: 'وسادة مطبوعة بصورة شخصية 🧸', link: 'product-accessories.html' }
    ],
    kid: [
        { img: 'images/coton.jpg', title: 'تيشرت قطني بصورة كرتونية 👶', link: 'product-tshirts.html' },
        { img: 'images/hats2.jpg', title: 'قبعة أطفال ملونة 🧢', link: 'product-hats.html' },
        { img: 'images/mug.jpg', title: 'كوب خاص للمدرسة 🥛', link: 'product-mugs.html' },
        { img: 'images/clé2.jpg', title: 'ميدالية باسم الطفل او صورته 🔑', link: 'product-accessories.html' }
    ]
};

function openGiftQuiz() {
    const modal = document.getElementById('giftModal');
    if (modal) modal.style.display = 'flex';
}

function closeGiftQuiz() {
    const modal = document.getElementById('giftModal');
    if (modal) {
        modal.style.display = 'none';
        resetQuiz();
    }
}

function nextStep(choice) {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';

    const img = document.getElementById('resultImg');
    const title = document.getElementById('resultTitle');
    const link = document.getElementById('resultLink');

    const products = giftSuggestions[choice];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    if (img) img.src = randomProduct.img;
    if (title) title.innerText = randomProduct.title;
    if (link) link.href = randomProduct.link;
}

function resetQuiz() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
}

// --- تشغيل مكتبة الحركات AOS ---
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// =========================================
// 🚚 حاسبة رسوم التوصيل (الرئيسية)
// =========================================
function calculateGlobalShipping() {
    const citySelect = document.getElementById('globalCitySelect');
    const result = document.getElementById('globalShippingResult');

    if (!citySelect || !result) return;

    const city = citySelect.value;

    if (!city) {
        result.style.display = "none";
        return;
    }

    let price = "";
    let time = "";
    let color = "#2c3e50";

    if (city === "casa") {
        price = "10 درهم";
        time = "يصلك خلال ساعات";
        color = "#27ae60";
    } else if (city === "rabat") {
        price = "30 درهم";
        time = "يصلك خلال 24 ساعة";
        color = "#2980b9";
    } else if (city === "major") {
        price = "40 درهم";
        time = "يصلك خلال 2-3 أيام";
        color = "#e67e22";
    } else if (city === "far") {
        price = "50 درهم";
        time = "يصلك خلال 3-5 أيام";
        color = "#c0392b";
    }

    result.style.display = "block";
    result.style.border = "1px solid " + color;
    result.style.color = color;

    result.innerHTML = `
        <div style="font-size: 20px; margin-bottom: 5px;">
            <i class="fas fa-truck"></i> التوصيل: <strong>${price}</strong>
        </div>
        <div style="font-size: 14px; color: #555;">
            <i class="fas fa-clock"></i> التوقيت: ${time}
        </div>
    `;
}

// =========================================
// 🛍️ إشعارات المبيعات الوهمية (Social Proof)
// =========================================
const names2 = ["محمد", "ياسين", "فاطمة", "سارة", "كريم", "عمر", "سلمى", "هدى", "احمد", "طه", "سمير"];
const cities2 = ["الدار البيضاء", "الرباط", "طنجة", "مراكش", "أكادير", "فاس", "مكناس", "سلا", "المحمدية", "سطات"];
const products2 = [
    { name: "قميص المنتخب 🇲🇦", img: "images/maroc-red.jpg" },
    { name: "كوب سحري ☕", img: "images/mugwhite1.png" },
    { name: "تيشرت ديما مغرب", img: "images/maroc-fan.jpg" },
    { name: " كوب ذهبي", img: "images/mugdoré.jpg" },
    { name: " طقم أكواب", img: "images/mugcoupel.jpg" },
];

const notification = document.createElement('div');
notification.classList.add('sales-notification');
document.body.appendChild(notification);

function showNotification() {
    const randomName = names2[Math.floor(Math.random() * names2.length)];
    const randomCity = cities2[Math.floor(Math.random() * cities2.length)];
    const randomProduct = products2[Math.floor(Math.random() * products2.length)];
    const timeAgo = Math.floor(Math.random() * 50) + 2;

    notification.innerHTML = `
        <img src="${randomProduct.img}" alt="product">
        <div>
            <h4>قام(ة) ${randomName} بطلب طلبية</h4>
            <p>من ${randomCity} - شراء <strong>${randomProduct.name}</strong></p>
            <small style="color: #888; font-size: 10px;">منذ ${timeAgo} دقيقة</small>
        </div>
    `;

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 8000);
}

setTimeout(showNotification, 5000);
setInterval(showNotification, 15000);

// زر الصعود للأعلى
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =========================================
// 🥺 تغيير العنوان عند مغادرة التبويب
// =========================================
let docTitle2 = document.title;
window.addEventListener("blur", () => {
    document.title = "عد إلينا! 💔 لا تنسَ طلبك";
});
window.addEventListener("focus", () => {
    document.title = docTitle2;
});