// JavaScript للتنقل بين الصفحات وتشغيل الموقع
document.addEventListener('DOMContentLoaded', function () {

    // 1. حل مشكلة ظهور الموقع من الأسفل (يجبره يصعد للأعلى فوراً)
    window.scrollTo(0, 0);

    // 2. تعريف المتغيرات
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');

    // 3. كود القائمة المتنقلة (تم التصحيح)
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            navUl.classList.toggle('show');
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function (e) {
        if (mobileMenu && !e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
            navUl.classList.remove('show');
        }
    });

    // 4. دالة إظهار الصفحة المحددة وإخفاء الآخرين
    function showPage(pageId) {
        // إخفاء كل الصفحات
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // إظهار الصفحة المطلوبة فقط إذا كانت موجودة
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            // عند تغيير الصفحة، نصعد للأعلى أيضاً
            window.scrollTo(0, 0);
        }

        // تحديث حالة الروابط (اللون البرتقالي للرابط النشط)
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }

    // 5. إضافة مستمعي الأحداث للروابط (عند الضغط على رابط)
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            showPage(pageId);

            // إغلاق القائمة المتنقلة تلقائياً بعد اختيار صفحة (للهواتف)
            if (window.innerWidth <= 768) {
                navUl.classList.remove('show');
            }
        });
    });

    // 6. إظهار الصفحة الرئيسية افتراضياً عند فتح الموقع
    showPage('home');
});


// --- دوال إضافية (خارج الـ EventListener) ---

// إرسال النموذج إلى واتساب
function sendToWhatsApp() {
    const form = document.getElementById('contactForm');
    if (!form) return; // حماية من الخطأ إذا لم يجد الفورم

    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const message = form.querySelector('textarea').value;

    const text = مرحباً، أريد التواصل معكم%0A%0Aالاسم: ${name}%0Aالبريد الإلكتروني: ${email}%0Aالهاتف: ${phone}%0Aالرسالة: ${message};

    window.open(https://wa.me/0645717242?text=${text}, '_blank');
}

// تأثير الهيدر الشفاف عند النزول (Sticky Header)
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    if (header) {
        header.classList.toggle("sticky", window.scrollY>0);
}
});