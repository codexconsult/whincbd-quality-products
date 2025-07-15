// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do menu mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Função para toggle do menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Fechar menu mobile ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar transparente/opaca baseada no scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona/remove classe baseada na posição do scroll
        if (scrollTop > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // Smooth scroll para links âncora (fallback para navegadores que não suportam CSS scroll-behavior)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para altura do navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de entrada para elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animateElements = document.querySelectorAll('.produto-card, .beneficio-card, .depoimento-card, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Contador animado para estatísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Observer para estatísticas
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('h3');
                const targetValue = parseInt(statNumber.textContent);
                
                if (!statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber, targetValue);
                }
            }
        });
    }, { threshold: 0.5 });

    // Observar elementos de estatística
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = function() {
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Slider simples para depoimentos (opcional - ativado apenas em telas pequenas)
    function initTestimonialSlider() {
        const depoimentosGrid = document.querySelector('.depoimentos-grid');
        const depoimentoCards = document.querySelectorAll('.depoimento-card');
        
        if (window.innerWidth <= 768 && depoimentoCards.length > 1) {
            let currentSlide = 0;
            
            // Criar indicadores
            const indicators = document.createElement('div');
            indicators.className = 'slider-indicators';
            indicators.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 2rem;
            `;
            
            depoimentoCards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background-color: ${index === 0 ? '#27ae60' : '#ddd'};
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                `;
                
                dot.addEventListener('click', () => {
                    showSlide(index);
                });
                
                indicators.appendChild(dot);
            });
            
            depoimentosGrid.parentNode.appendChild(indicators);
            
            function showSlide(index) {
                depoimentoCards.forEach((card, i) => {
                    card.style.display = i === index ? 'block' : 'none';
                });
                
                // Atualizar indicadores
                const dots = indicators.querySelectorAll('.slider-dot');
                dots.forEach((dot, i) => {
                    dot.style.backgroundColor = i === index ? '#27ae60' : '#ddd';
                });
                
                currentSlide = index;
            }
            
            // Mostrar apenas o primeiro slide inicialmente
            showSlide(0);
            
            // Auto-slide (opcional)
            setInterval(() => {
                currentSlide = (currentSlide + 1) % depoimentoCards.length;
                showSlide(currentSlide);
            }, 5000);
        }
    }

    // Inicializar slider em telas pequenas
    if (window.innerWidth <= 768) {
        initTestimonialSlider();
    }

    // Reinicializar slider ao redimensionar a tela
    window.addEventListener('resize', function() {
        // Remover slider existente se a tela ficar grande
        const existingIndicators = document.querySelector('.slider-indicators');
        if (existingIndicators && window.innerWidth > 768) {
            existingIndicators.remove();
            // Mostrar todos os cards novamente
            document.querySelectorAll('.depoimento-card').forEach(card => {
                card.style.display = 'block';
            });
        }
        // Adicionar slider se a tela ficar pequena
        else if (!existingIndicators && window.innerWidth <= 768) {
            initTestimonialSlider();
        }
    });

    // Botão "Voltar ao topo" (aparece após scroll)
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #27ae60;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    // Mostrar/esconder botão baseado no scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Funcionalidade do botão voltar ao topo
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Prevenção de comportamento padrão para links vazios
    const emptyLinks = document.querySelectorAll('a[href="#"]');
    emptyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    // Log de inicialização (pode ser removido em produção)
    console.log('WhinCBD - Site carregado com sucesso!');
});

// Função para detectar se o usuário está em um dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustes específicos para dispositivos móveis
if (isMobileDevice()) {
    document.addEventListener('DOMContentLoaded', function() {
        // Desabilitar parallax em dispositivos móveis para melhor performance
        const banner = document.querySelector('.banner');
        if (banner) {
            banner.style.backgroundAttachment = 'scroll';
        }
    });
}
