document.addEventListener('DOMContentLoaded', function () {
    
    // 1. إصلاح مشكلة التمرير (البدء من الأعلى)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 2. تعريف العناصر
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // 3. تشغيل زر القائمة (الموبايل)
    if (mobileMenu && navUl) {
        console.log('تم العثور على زر القائمة');
        mobileMenu.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            navUl.classList.toggle('show');
            console.log('تم الضغط على القائمة');
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

    // 4. التنقل بين الصفحات
    function showPage(pageId) {
        // إخفاء الصفحات
        pages.forEach(page => page.classList.remove('active'));
        
        // إظهار الصفحة المطلوبة
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
        }

        // تحديث الروابط
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }

    // تفعيل الأزرار
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
                // إغلاق القائمة بعد الاختيار
                if (navUl) navUl.classList.remove('show');
            }
        });
    });

    // تشغيل الرئيسية افتراضياً
    showPage('home');
});


// دالة الواتساب (تم تبسيطها لمنع الأخطاء)
function sendToWhatsApp() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var name = form.querySelector('input[type="text"]').value;
    var email = form.querySelector('input[type="email"]').value;
    var phone = form.querySelector('input[type="tel"]').value;
    var message = form.querySelector('textarea').value;

    // استخدام طريقة الربط البسيطة لتجنب أخطاء النسخ
    var text = "الاسم: " + name + "%0A" +
               "البريد: " + email + "%0A" +
               "الهاتف: " + phone + "%0A" +
               "الرسالة: " + message;

    var url = "https://wa.me/0645717242?text=" + text;
    window.open(url, '_blank');
}

// الهيدر الشفاف
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
    }
});