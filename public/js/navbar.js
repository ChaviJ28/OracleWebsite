// <!--Javascript Sticky Nav Bar-->
         
            window.addEventListener("scroll", function(){
                var header = document.querySelector("header");
                header.classList.toggle("sticky", window.scrollY > 0);
            });
 
     
            const navSlide = () => {
                const burger = document.querySelector(".hamburger");
                const nav = document.querySelector(".inner-main-menu ul");
                const navLinks = document.querySelectorAll(".inner-main-menu ul li");

                burger.addEventListener("click", () => {
                    nav.classList.toggle("nav-active");

                    navLinks.forEach((link, index) => {
                        if (link.style.animation) {
                            link.style.animation = '';
                        } else {
                            link.style.animation = `navLinkFadeIn 0.5s ease forwards ${index / 7 + 0.5}s`;
                        }
                    });

                    burger.classList.toggle("toggle");
                });
            }
            navSlide();
 