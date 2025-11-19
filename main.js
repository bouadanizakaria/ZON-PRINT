document.addEventListener('DOMContentLoaded', function () {

    // 1. تعريف المتغيرات (يجب أن تكون في البداية)
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');

    // 2. كود تشغيل زر القائمة في الموبايل (الذي أضفناه)
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            navUl.classList.toggle('show');
        });
    }

    // 3. دالة إظهار الصفحة المحددة
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
        }
    }

    // 4. تحديث حالة الروابط النشطة
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === 'home') { // افتراضياً الصفحة الرئيسية
             link.classList.add('active');
        }
    });

    // 5. إضافة مستمعي الأحداث للروابط
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            
            // إزالة النشاط من جميع الروابط وإضافته للرابط المضغوط
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const pageId = this.getAttribute('data-page');
            showPage(pageId);

            // إغلاق القائمة المتنقلة تلقائياً عند اختيار صفحة (في الموبايل)
            if (window.innerWidth <= 768 && navUl.classList.contains('show')) {
                navUl.classList.remove('show');
            }
        });
    });

    // تشغيل الصفحة الافتراضية عند الفتح (اختياري)
    showPage('product-tshirts.html'); // أو اسم الصفحة الرئيسية لديك
});