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
            if(pages.length > 0) {
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
                try { pageId = this.getAttribute('href').split('#')[1]; } catch(err) {}
            }

            // إذا كان القسم موجوداً
            if (pageId && document.getElementById(pageId)) {
                e.preventDefault();
                // إذا كنا بالفعل في القسم، لا نفعل شيئاً سوى التمرير
                const targetSection = document.getElementById(pageId);
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

    // فحص الرابط عند الفتح
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
    } else {
        if(document.getElementById('home')) {
            // تفعيل الصفحة الرئيسية افتراضياً
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById('home').classList.add('active');
        }
    }

    // --- ج. ميزات إضافية (FAQ + Design + Countdown) ---
    
    // 1. الأسئلة الشائعة
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

    // 2. أداة "صمم بنفسك" (رفع الصور)
    const uploadInput = document.getElementById('imageUpload');
    const previewImage = document.getElementById('user-design-preview');
    if (uploadInput && previewImage) {
        uploadInput.addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
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

}); // <--- نهاية DOMContentLoaded (لا تحذف هذا القوس!)


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
    
    if(scoreMa !== "" && scoreOther !== "") {
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
window.addEventListener('popstate', function(event) {
    if(window.location.hash) {
        // العودة للقسم الموجود في الهاش
        const pageId = window.location.hash.substring(1);
        if(document.getElementById(pageId)) {
            const pages = document.querySelectorAll('.page');
            if(pages.length > 0) {
                pages.forEach(p => p.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
            }
        }
    } else {
        // العودة للرئيسية
        if(document.getElementById('home')) {
            const pages = document.querySelectorAll('.page');
            if(pages.length > 0) {
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

    // قائمة المباريات (يمكنك إضافة المزيد هنا)
    // التاريخ: متى تنتهي المباراة ويظهر الخصم التالي؟
    const matches = [
        {
            date: "2025-12-21", // تاريخ المباراة الأولى
            name: "جزر القمر",
            flag: "https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_the_Comoros.svg"
        },
        {
            date: "2025-12-26", // تاريخ المباراة الثانية
            name: "مالي ",
            flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Mali.svg"
        },
        {
            date: "2025-12-29", // تاريخ المباراة الثالثة
            name: " زامبيا ",
            flag: "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Zambia.svg"
        }
    ];

    const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم (YYYY-MM-DD)

    // البحث عن المباراة القادمة
    for (let i = 0; i < matches.length; i++) {
        // إذا كان تاريخ المباراة في المستقبل أو هو اليوم
        if (matches[i].date >= today) {
            nameElement.innerText = matches[i].name;
            flagElement.src = matches[i].flag;
            return; // وجدنا المباراة، نتوقف هنا
        }
    }

    // إذا انتهت كل المباريات في الجدول، نظهر رسالة افتراضية
    nameElement.innerText = "قريباً...";
    flagElement.src = "images/logo.png.png"; // أو أي صورة
}

// تشغيل الدالة عند تحميل الموقع
document.addEventListener('DOMContentLoaded', updateMatchInfo);
// رقم عشوائي للمخزون
document.querySelectorAll('.stock-count').forEach(el => {
    // رقم عشوائي بين 2 و 8
    el.innerText = Math.floor(Math.random() * (8 - 2 + 1) + 2);
});
// =========================================
// 📢 دالة مشاركة المنتج
// =========================================
function shareProduct(platform) {
    // 1. جلب رابط الصفحة الحالية تلقائياً
    const currentUrl = window.location.href;
    const text = "شوف هذا المنتج الرائع من Zon Print! 😍👇";

    if (platform === 'whatsapp') {
        // مشاركة عبر واتساب
        const url = `https://wa.me/?text=${encodeURIComponent(text)} ${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank');
        
    } else if (platform === 'facebook') {
        // مشاركة عبر فيسبوك
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank');
        
    } else if (platform === 'copy') {
        // نسخ الرابط
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
document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const words = ["التيشرتات 👕", "الأكواب ☕", "الهواتف 📱", "القبعات 🧢", "الهدايا 🎁"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100; // سرعة الكتابة

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // مسح الحروف
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // سرعة المسح أسرع
        } else {
            // كتابة الحروف
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // سرعة الكتابة عادية
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // انتهت الكلمة، انتظر قليلاً ثم ابدأ المسح
            isDeleting = true;
            typeSpeed = 1000; // انتظر ثانيتين قبل المسح
        } else if (isDeleting && charIndex === 0) {
            // انتهى المسح، انتقل للكلمة التالية
            isDeleting = false;
            wordIndex++;
            if (wordIndex === words.length) {
                wordIndex = 0; // العودة للكلمة الأولى
            }
            typeSpeed = 500; // انتظر نصف ثانية قبل البدء
        }

        setTimeout(type, typeSpeed);
    }

    // تشغيل الدالة
    type();
});