document.addEventListener("DOMContentLoaded", function () {
    const desktopNav = document.querySelector(".desktop-nav");
    const links = desktopNav.querySelectorAll("a");
    const underline = desktopNav.querySelector("span");
    const cityNameElement = document.querySelector('.city-name');
    const timeElement = document.querySelector('.time');
    const dateElement = document.querySelector('.date');
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = mobileNav.querySelectorAll('a');

    const cityTimeZones = {
        'cupertino': 'America/Los_Angeles',
        'new-york-city': 'America/New_York',
        'london': 'Europe/London',
        'amsterdam': 'Europe/Amsterdam',
        'tokyo': 'Asia/Tokyo',
        'hong-kong': 'Asia/Hong_Kong',
        'sydney': 'Australia/Sydney'
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const updateCityTime = (cityId) => {
        if (!cityId) return;
        
        const timeZone = cityTimeZones[cityId];
        if (!timeZone) return;
        
        const now = new Date();
        
        const timeString = now.toLocaleTimeString('en-US', {
            ...timeOptions,
            timeZone: timeZone
        });
        
        const dateString = now.toLocaleDateString('en-US', {
            ...dateOptions,
            timeZone: timeZone
        });
        
        timeElement.textContent = timeString;
        dateElement.textContent = dateString;
    };

    const getActiveLink = () =>{
        if (window.innerWidth > 768) {
            return desktopNav.querySelector('a.active');
        }

        return mobileNav.querySelector('a.active');
    }

    const updateCityInfo = () => {
        let activeLink = getActiveLink()
        const cityId = activeLink.getAttribute('href').substring(1);

        cityNameElement.textContent = activeLink.textContent;

        updateCityTime(cityId);
    };

    const removeActiveClass = () => {
        if (window.innerWidth > 768) {
            links.forEach(link => {
                link.classList.remove('active');
            });

            return
        }
        
        mobileLinks.forEach(link => {
            link.classList.remove('active');
        });
    };

    const updateUnderlinePosition = () => {
        const activeLink = desktopNav.querySelector('a.active');
        const navPosition = desktopNav.getBoundingClientRect();
        const linkPosition = activeLink.getBoundingClientRect();
        
        const underlinePositionLeft = linkPosition.left - navPosition.left;
        const underlineWidth = linkPosition.width;
        
        underline.style.setProperty('--underline-position-left', `${underlinePositionLeft}px`);
        underline.style.setProperty('--underline-width', `${underlineWidth}px`);
    };

    const initializeNavigation = () => {
        const hash = window.location.hash;

        if (hash) {
            const hashLink = desktopNav.querySelector(`a[href="${hash}"]`);
            const mobileHashLink = mobileNav.querySelector(`a[href="${hash}"]`);

            if (hashLink) {
                hashLink.classList.add('active');
                if (mobileHashLink) {
                    mobileHashLink.classList.add('active');
                }
                updateUnderlinePosition();
                updateCityInfo();
                return;
            }
        }

        links[0].classList.add('active');
        mobileLinks[0].classList.add('active');
        updateUnderlinePosition();
        updateCityInfo();
    };

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        const isExpanded = mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(isExpanded));
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            removeActiveClass();
            link.classList.add('active');
            updateCityInfo();
            toggleMobileMenu();
        });
    });

    initializeNavigation();

    setInterval(() => {
        const activeLink = getActiveLink();
        const cityId = activeLink.getAttribute('href').substring(1);
        updateCityTime(cityId);
    }, 1000);

    links.forEach(link => {
        link.addEventListener("click", () => {
            removeActiveClass();
            link.classList.add('active');
            updateUnderlinePosition();
            updateCityInfo();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            updateUnderlinePosition();
        }
    });
})