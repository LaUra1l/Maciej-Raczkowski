class IconAnimate {
    #numberOfIcons;
    #icon_className;
    #iconColor_table;
    #contener;
    #animation;

    constructor(numberOfIcons, icon_className, iconColor_table, contener, animation) {
        this.#numberOfIcons = numberOfIcons;
        this.#icon_className = icon_className;
        this.#iconColor_table = iconColor_table;
        this.#contener = contener;
        this.#animation = animation;
    }

    #getElement(elementClass) {
        return document.querySelector(elementClass);
    }

    #randomNumber(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    #randomColor(colors_table) {
        const index = this.#randomNumber(colors_table.length, 0);
        return colors_table[index];
    }

    #randomTranslateY() {
        return this.#randomNumber(60, 0) + "px";
    }

    #randomSize() {
        return this.#randomNumber(50, 5); // Zwraca liczbę (nie px), by użyć jej w obliczeniach
    }

    #randomOpacity() {
        return Math.random();
    }

    #getScreenWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    #randomPositions(container, iconWidth, iconHeight) {
        const bounds = container.getBoundingClientRect();
        const maxX = bounds.width - iconWidth;
        const maxY = bounds.height - iconHeight;

        const x = this.#randomNumber(maxX, 0) + "px";
        const y = this.#randomNumber(maxY, 0) + "px";

        return [x, y];
    }

    #generateIcons(number, className) {
        const container = this.#getElement(this.#contener);
        const device_width = this.#getScreenWidth();

        if (device_width < 400) {
            number = number - 7;
        } else if (device_width < 500) {
            number = number - 3;
        }

        for (let i = 0; i < number; i++) {
            const icon = document.createElement('li');
            icon.style.opacity = "0";
            icon.className = className;
            icon.style.position = "absolute";
            icon.style.transition = "all 2s";
            icon.style.color = this.#randomColor(this.#iconColor_table);

            icon.addEventListener("mouseenter", () => {
                icon.style.animation = this.#animation;
            });

            const fontSize = this.#randomSize(); // liczba
            icon.style.fontSize = fontSize + "px";

            // Dopiero teraz pozycja - z uwzględnieniem rozmiaru
            const [x, y] = this.#randomPositions(container, fontSize, fontSize);
            icon.style.left = x;
            icon.style.top = y;

            setTimeout(() => {
                icon.style.opacity = this.#randomOpacity();
                icon.style.transform = `translateY(${this.#randomTranslateY()})`;
            }, 100);

            container.appendChild(icon);
        }
    }

    start() {
        this.#generateIcons(this.#numberOfIcons, this.#icon_className);
    }
}



class IconInteraction{
    #goPromise
    constructor(){   
        this.#goPromise=true;
    }

    getElement(element){
        return document.querySelector(element);
        
    }

    addClassName(elementClick, elemMenu, elementListener, classNameONE, classNameTWO, height, lookInside = false) {
        let roll = false;
        let menu = this.getElement(elemMenu);
        const clickElements = [...document.getElementsByClassName(elementClick)];
    
        const closeMenu = () => {
            menu.style.height = '0px';
            classNameTWO.split(' ').forEach(cls => clickElements[0].classList.remove(cls));
            classNameONE.split(' ').forEach(cls => clickElements[0].classList.add(cls));
            roll = false;
            window.removeEventListener('click', handleOutsideClick); 
        };
    
        const handleOutsideClick = (event) => {
            if (!menu.contains(event.target) && !clickElements[0].contains(event.target)) {
                closeMenu();
            }
        };
    
        clickElements.forEach(elem => {
            elem.addEventListener(elementListener, (event) => {
                roll = !roll;
    
                if (roll) {
                    menu.style.height = height;
                    classNameONE.split(' ').forEach(cls => elem.classList.remove(cls));
                    classNameTWO.split(' ').forEach(cls => elem.classList.add(cls));
    
                    setTimeout(() => {
                        window.addEventListener('click', handleOutsideClick);
                    }, 0);
                    
                } else {
                    closeMenu();
                }
    
                if (lookInside) {
                    menu = elem.parentNode.querySelector(elemMenu);
                    elem.textContent = roll ? "ZWIŃ" : "OPIS";
                }
            });
        });
    }

    addAnimation(
        // PODSTAWOWE
        element, animation, eventListener,
       
        //ROZSZEZONE O ZMIANE IKONY
        returnToPrev,oldIcon,newIcon,
    ) {
        const getElement = this.getElement(element);
        if(eventListener){
            getElement.addEventListener(eventListener, () => {
            getElement.style.animation = animation;

            //ROZSZEZONE O ZMIANE IKONY

           if(oldIcon && newIcon!=undefined){
            getElement.className=newIcon;
           }
          
            
            if(returnToPrev){
                getElement.addEventListener("animationend",()=>{
                    getElement.style.animation="none";        
    
                    if(oldIcon && newIcon!=undefined){
                        getElement.className=oldIcon;
                       }
                })
            }
            //---  
             
        });
        }else{
            getElement.style.animation = animation;
        }
    }
    #applyMode(isDarkMode, lightmode_colors, darkmode_colors, root,
        backgroundImage,darkPhoto,lightPhoto
    ){
        let colors=isDarkMode ? darkmode_colors: lightmode_colors;

        for(let i=0;i<colors.length;i++){
            root.style.setProperty(`--color${i+1}`,colors[i])
        }

        if(isDarkMode){
            backgroundImage.style.backgroundImage=lightPhoto;
            
        }
        else{
            backgroundImage.style.backgroundImage=darkPhoto;
        }


    }
    changemode(lightmode_colors,darkmode_colors,element,
        contener,darkPhoto,lightPhoto){
        const root=document.documentElement;
        const item=this.getElement(element);
        const elemToChangeImg=this.getElement(contener);

        let change=localStorage.getItem("MODE")==="dark" ? true: false;
        this.#applyMode(change,lightmode_colors,darkmode_colors,root,
            elemToChangeImg,darkPhoto,lightPhoto
        );


        item.addEventListener("click",()=>{
            console.log('zmaina')
            item.style.pointerEvents="none";
            change=!change;

             //ZAPIS DO LOCAL STORAGE
             localStorage.setItem("MODE",change ? "dark": "light");
            //--
          

            item.addEventListener("animationend",()=>{
                console.log('koniec')
                item.style.pointerEvents="all";
            });

            this.#applyMode(change,lightmode_colors,darkmode_colors,root,
                elemToChangeImg,darkPhoto,lightPhoto
            );
        });   
    }

    addClass(icon, icon_style_after, icon_style_before, eventListener,
        changetxt=false, spanElems,checkActiveFunction
    ) {
        const get_icon = document.querySelector(icon);
        get_icon.style.cursor="pointer";

        const spans=document.querySelectorAll(spanElems);
        if(changetxt){
            spans[0].style.color='red';
            spans[1].style.color='var(--color1)';
        }

        get_icon.addEventListener(eventListener, () => {
        
            console.log('click')
            
            console.log(this.#goPromise)

            if (this.#goPromise) {
                get_icon.className = icon_style_after;

                if(changetxt){
                    spans[1].style.color='red';
                    spans[0].style.color='var(--color1)';
                }
            } else {
                get_icon.className = icon_style_before;
                if(changetxt){
                    spans[0].style.color='red';
                    spans[1].style.color='var(--color1)';
                }
            }
            this.#goPromise=!this.#goPromise;
            if(changetxt)checkActiveFunction();
        });

        
        
    }
   
}

class VideoSlider {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      this.slider = this.container.querySelector('.video-slider');
      this.videos = this.slider.querySelectorAll('video');
      this.prevBtn = this.container.querySelector('.prev');
      this.nextBtn = this.container.querySelector('.next');
  
      this.isDragging = false;
      this.startX = 0;
      this.scrollLeft = 0;
  
      this.initEvents();
      this.setupVideos();
      this.observeVisibility();
    }
  
    initEvents() {
      this.prevBtn.addEventListener('click', () => this.scrollBy(-1));
      this.nextBtn.addEventListener('click', () => this.scrollBy(1));
  
      this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
      this.slider.addEventListener('mousemove', (e) => this.onDrag(e));
      this.slider.addEventListener('mouseup', () => this.endDrag());
      this.slider.addEventListener('mouseleave', () => this.endDrag());
  
      this.slider.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]), { passive: false });
      this.slider.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Zapobiega przewijaniu strony
        this.onDrag(e.touches[0]);
      }, { passive: false });
      this.slider.addEventListener('touchend', () => this.endDrag());
      
    }
  
    setupVideos() {
      this.videos.forEach((video, index) => {
        video.muted = true;
        video.autoplay = false;
        video.pause();
        video.addEventListener('ended', () => this.playNextVideo(index));
      });
    }
  
    scrollBy(direction) {
      const videoWidth = this.videos[0].offsetWidth + 16;
      this.slider.scrollBy({ left: videoWidth * direction, behavior: 'smooth' });
    }
  
    startDrag(e) {
      this.isDragging = true;
      this.startX = e.pageX || e.clientX;
      this.scrollLeft = this.slider.scrollLeft;
    }
  
    onDrag(e) {
      if (!this.isDragging) return;
      const x = e.pageX || e.clientX;
      const walk = this.startX - x;
      this.slider.scrollLeft = this.scrollLeft + walk;
    }
  
    endDrag() {
      this.isDragging = false;
    }
  
    playNextVideo(currentIndex) {
      const nextIndex = (currentIndex + 1) % this.videos.length; // pętla
      const nextVideo = this.videos[nextIndex];
      const videoWidth = nextVideo.offsetWidth + 16;
      this.slider.scrollTo({ left: videoWidth * nextIndex, behavior: 'smooth' });
    }
  
    observeVisibility() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const video = entry.target;
              if (entry.isIntersecting) {
                this.pauseAllExcept(video);
                video.muted = false; // <-- WŁĄCZAMY DŹWIĘK
                video.currentTime = 0;
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            });
          },
          {
            root: this.slider,
            threshold: 0.8
          }
        );
      
        this.videos.forEach((video) => observer.observe(video));
      }
      
      pauseAllExcept(activeVideo) {
        this.videos.forEach((video) => {
          if (video !== activeVideo) {
            video.pause();
            video.currentTime = 0;
            video.muted = true; // <-- WYŁĄCZAMY DŹWIĘK
          }
        });
      }
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint && elementBottom > 0) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}
const shadesOfBlack=[
    '#000000', // pure black
    '#0A0A0A', // very dark gray
    '#141414', // very dark gray
    '#1E1E1E', // very dark gray
    '#282828', // very dark gray
    '#323232', // very dark gray
    '#3C3C3C', // very dark gray
    '#464646'  // very dark gray
];

document.addEventListener('DOMContentLoaded',()=>{


    new VideoSlider('.video-slider-container');
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);

    
    const navBar=new IconInteraction();
    navBar.addClassName('navBar','.navList','click','fa-solid fa-bars navBar','fa-solid fa-xmark navBar','210px');

    window.onload = () => {
        const notes1 = new IconAnimate(15, "fa-solid fa-music note", shadesOfBlack, "#main", "noteFall 2s both");
        notes1.start();
    
        const notes2 = new IconAnimate(10, "fa-solid fa-music note", shadesOfBlack, "#about", "noteFall 2s both");
        notes2.start();
    };
    



    const logo = document.querySelector('.logo');

    ['click', 'touchstart'].forEach(event => {
        logo.addEventListener(event, () => {
            location.reload();
            
        });
        location.href="#main"
    });

    
});
