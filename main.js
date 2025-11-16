
        // JavaScript للتنقل بين الصفحات
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const pages = document.querySelectorAll('.page');
            const mobileMenu = document.querySelector('.mobile-menu');
            const navUl = document.querySelector('nav ul');
            
            // إظهار الصفحة المحددة وإخفاء الآخرين
            function showPage(pageId) {
                pages.forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById(pageId).classList.add('active');
                
                // تحديث حالة الروابط النشطة
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('data-page') === pageId) {
                        link.classList.add('active');
                    }
                });
            }
            
            // إضافة مستمعي الأحداث للروابط
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    showPage(pageId);
                    
                    // إغلاق القائمة المتنقلة على الهواتف
                    if(window.innerWidth <= 768) {
                        navUl.classList.remove('show');
                    }
                    
                    // التمرير إلى أعلى الصفحة
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            });
            
            // القائمة المتنقلة
            mobileMenu.addEventListener('click', function() {
                navUl.classList.toggle('show');
            });
            
            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', function(e) {
                if(!e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
                    navUl.classList.remove('show');
                }
            });
            
            // إظهار الصفحة الأولى افتراضيًا
            showPage('home');
        });
        
        // إرسال النموذج إلى واتساب
        function sendToWhatsApp() {
            const form = document.getElementById('contactForm');
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const message = form.querySelector('textarea').value;
            
            const text = `مرحباً، أريد التواصل معكم%0A%0Aالاسم: ${name}%0Aالبريد الإلكتروني: ${email}%0Aالهاتف: ${phone}%0Aالرسالة: ${message}`;
            
            window.open(`https://wa.me/0645717242?text=${text}`, '_blank');
        }