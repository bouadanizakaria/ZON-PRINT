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
    // --- كود تشغيل الأسئلة الشائعة ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // 1. إغلاق جميع الأسئلة الأخرى (اختياري - ليبقى واحد مفتوح فقط)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // 2. فتح أو إغلاق السؤال الحالي
            item.classList.toggle('active');
        });
    });
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