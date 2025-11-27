document.addEventListener('DOMContentLoaded', function () {

    // 1. إصلاح مشكلة التمرير (البدء من الأعلى)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 2. تعريف العناصر
    // نختار روابط الهيدر وروابط الفوتر معاً
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a');
    const pages = document.querySelectorAll('.page');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');

    // 3. تشغيل زر القائمة (الموبايل)
    if (mobileMenu && navUl) {
        mobileMenu.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            navUl.classList.toggle('show');
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function (e) {
        if (navUl && navUl.classList.contains('show')) {
            if (!navUl.contains(e.target) && !mobileMenu.contains(e.target)) {
                navUl.classList.remove('show');
            }
        }
    });

    // 4. دالة التنقل بين الصفحات (Show Page)
    function showPage(pageId) {
        const targetSection = document.getElementById(pageId);

        if (targetSection) {
            // إخفاء كل الصفحات
            pages.forEach(page => page.classList.remove('active'));
             targetSection.classList.add('active');
            window.scrollTo(0, 0);

            // 👇👇 أضف هذا السطر الجديد هنا 👇👇
            // هذا السطر يخبر المتصفح أننا انتقلنا لصفحة جديدة، لكي يعمل زر العودة
            if(window.location.hash !== '#' + pageId) {
                history.pushState({ page: pageId }, null, '#' + pageId);
            }
            // 👆👆 نهاية السطر الجديد 👆👆
navLinks.forEach(link => {
                link.classList.remove('active');
                const linkPage = link.getAttribute('data-page');
                const linkHref = link.getAttribute('href');
                if (linkPage === pageId || (linkHref && linkHref.includes(pageId))) {
                    link.classList.add('active');
                }});
            // إظهار الصفحة المطلوبة
            targetSection.classList.add('active');
            window.scrollTo(0, 0);

            // تحديث الروابط النشطة (اللون البرتقالي)
            navLinks.forEach(link => {
                link.classList.remove('active');
                // نفحص data-page أو href
                const linkPage = link.getAttribute('data-page');
                const linkHref = link.getAttribute('href');

                if (linkPage === pageId || (linkHref && linkHref.includes(pageId))) {
                    link.classList.add('active');
                }
            });
        }
    }

    // --- ج. تشغيل الأسئلة الشائعة (FAQ) ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if(question) {
                question.addEventListener('click', () => {
                    faqItems.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

    // 5. تفعيل الأزرار (الكود الذكي الجديد)
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // محاولة معرفة القسم المطلوب سواء من data-page أو href
            let pageId = this.getAttribute('data-page');

            // إذا لم يكن هناك data-page، نحاول استخراجه من الرابط (مثل #contact)
            if (!pageId && this.getAttribute('href').includes('#')) {
                pageId = this.getAttribute('href').split('#')[1];
            }

            // إذا وجدنا القسم في الصفحة الحالية، نذهب إليه
            if (pageId && document.getElementById(pageId)) {
                e.preventDefault(); // منع إعادة التحميل
                showPage(pageId);

                // إغلاق القائمة في الموبايل
                if (navUl) navUl.classList.remove('show');
            }
            // إذا كان الرابط يذهب لصفحة أخرى (مثل المنتجات)، نتركه يعمل طبيعياً
        });
    });

    // 6. فحص الرابط عند فتح الموقع (للذهاب للقسم مباشرة من صفحة خارجية)
    const hash = window.location.hash.substring(1); // نحذف رمز #
    if (hash && document.getElementById(hash)) {
        showPage(hash);
        setTimeout(() => {
            document.getElementById(hash).scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        showPage('home'); // الافتراضي
    }
// --- كود ميزة "صمم بنفسك" (معاينة الصورة) ---
    // نستخدم الشرط (if) لكي لا يحدث خطأ في الصفحات الأخرى
    const uploadInput = document.getElementById('imageUpload');
    const previewImage = document.getElementById('user-design-preview');

    if (uploadInput && previewImage) {
        uploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
// تشغيل زر "العودة" في المتصفح/الهاتف
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            showPage(event.state.page);
        } else {
            // إذا لم يكن هناك حالة مسجلة، عد للرئيسية أو القسم الافتراضي
            showPage('home');
        }
    });
}); // <--- (مهم جداً) إغلاق دالة DOMContentLoaded هنا


// --- دوال خارجية (يجب أن تكون خارج القوس الكبير لتعمل مع HTML) ---

// دالة إرسال الواتساب
function sendToWhatsApp(e) {
    if (e) e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    if (name === "" || email === "" || message === "") {
        alert("المرجو ملء جميع الحقول الضرورية");
        return;
    }

    var text = "طلب تواصل جديد من الموقع" + "%0A" +
        "---------------------------" + "%0A" +
        "الاسم: " + name + "%0A" +
        "البريد: " + email + "%0A" +
        "الهاتف: " + phone + "%0A" +
        "الرسالة: " + "%0A" + message;

    var url = "https://wa.me/212645717242?text=" + text;
    window.open(url, '_blank');
}

// --- كود التحكم في ألوان الهيدر والأيقونة عند النزول ---
window.addEventListener("scroll", function () {

    // 1. تحديد العناصر
    var header = document.querySelector("header");
    var menuIcon = document.querySelector(".mobile-menu i"); // الأيقونة
    var logoText = document.querySelector(".logo-container h1"); // اسم الموقع
    var navLinks = document.querySelectorAll("header .nav-link"); // الروابط (للكمبيوتر)

    // 2. إذا نزلنا للأسفل (أكثر من 0 بكسل)
    if (window.scrollY > 0) {
        if (header) header.classList.add("sticky");

        // إجبار الألوان على أن تكون بيضاء
        if (menuIcon) menuIcon.style.color = "#ffffff";
        if (logoText) logoText.style.color = "#ffffff";

        navLinks.forEach(link => {
            link.style.color = "#ffffff";
        });

    } else {
        // 3. إذا عدنا للقمة
        if (header) header.classList.remove("sticky");

        // إجبار الألوان على أن تكون داكنة (لأن الخلفية بيضاء)
        if (menuIcon) menuIcon.style.color = "#333333";
        if (logoText) logoText.style.color = "#333333";

        navLinks.forEach(link => {
            link.style.color = "#333333";
        });
    }
    
});
// --- دالة زر "إرسال الطلب" (للتصميم الخاص) ---
function orderCustomDesign() {
    const previewImage = document.getElementById('user-design-preview');
    
    // التحقق من وجود صورة مرفوعة
    if (!previewImage || previewImage.src === "" || previewImage.style.display === "none") {
        alert("المرجو اختيار صورة أولاً قبل الطلب");
        return;
    }

    const text = "مرحباً Zon Print، لقد قمت باختيار صورة لطباعتها، سأقوم بإرسال الصورة لكم الآن هنا 👇";
    const url = "https://wa.me/212645717242?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
}
// =========================================
// ⏳ عداد تنازلي لكأس أفريقيا 2025
// =========================================
function startCanCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // تاريخ الافتتاح التقريبي (21 ديسمبر 2025)
    const countDate = new Date('Dec 21, 2025 00:00:00').getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const gap = countDate - now;

        // حساب الوقت
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        // تصميم المربعات
        const boxStyle = "background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); padding: 10px; border-radius: 8px; width: 70px; color: white;";
        const numStyle = "font-size: 24px; font-weight: bold; display: block;";
        const labelStyle = "font-size: 12px; opacity: 0.8;";

        countdownElement.innerHTML = `
            <div style="${boxStyle}"><span style="${numStyle}">${d}</span><span style="${labelStyle}">يوم</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${h}</span><span style="${labelStyle}">ساعة</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${m}</span><span style="${labelStyle}">دقيقة</span></div>
            <div style="${boxStyle}"><span style="${numStyle}">${s}</span><span style="${labelStyle}">ثانية</span></div>
        `;
    }, 1000);
}

// تشغيل العداد عند التحميل
document.addEventListener('DOMContentLoaded', startCanCountdown);

// تأثير الآلة الكاتبة
const words = ["التيشرتات 👕", "الأكواب ☕",  "القبعات 🧢"];
let i = 0;
let timer;

function typingEffect() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    let word = words[i].split("");
    let loopTyping = function() {
        if (word.length > 0) {
            element.innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000); // انتظر ثانيتين قبل المسح
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    const element = document.getElementById('typewriter');
    let word = words[i].split("");
    let loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            element.innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            typingEffect();
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}

document.addEventListener('DOMContentLoaded', typingEffect);


