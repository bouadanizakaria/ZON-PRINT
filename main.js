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


// دالة إرسال الواتساب الجديدة (مع التحقق)
function sendToWhatsApp(e) {
    // 1. منع إعادة تحميل الصفحة
    e.preventDefault();

    // 2. جلب القيم
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    // 3. (اختياري) تحقق إضافي في الجافاسكريبت
    if (name === "" || email === "" || message === "") {
        alert("المرجو ملء جميع الحقول الضرورية");
        return;
    }

    // 4. تجهيز الرسالة والرابط
    var text = "طلب تواصل جديد من الموقع" + "%0A" +
               "---------------------------" + "%0A" +
               "الاسم: " + name + "%0A" +
               "البريد: " + email + "%0A" +
               "الهاتف: " + phone + "%0A" +
               "الرسالة: " + "%0A" + message;

    var url = "https://wa.me/212645717242?text=" + text;

    // 5. فتح الواتساب
    window.open(url, '_blank');
}

// الهيدر الشفاف
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
    }
});