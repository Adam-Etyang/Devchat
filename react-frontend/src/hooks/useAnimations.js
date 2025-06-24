import { useEffect } from 'react';

export const useAnimations = () => {
  useEffect(() => {
    // Typewriter animation
    const initializeTypewriter = () => {
      const typewriter = document.getElementById("typewriter");
      if (!typewriter) return;

      const words = ["together", "Seamlessly", "effortlessly"];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function type() {
        const currentWord = words[wordIndex];
        const currentText = currentWord.substring(0, charIndex);

        typewriter.textContent = currentText;

        if (!isDeleting) {
          if (charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 100);
          } else {
            isDeleting = true;
            setTimeout(type, 2000);
          }
        } else {
          if (charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
          } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
          }
        }
      }

      type();
    };

    // Ticker carousel animation
    const initializeTicker = () => {
      const ticker = document.getElementById("ticker");
      if (!ticker) return;

      const tickerParent = ticker.parentElement;
      let isPaused = false;
      let speed = 1;

      const originalContent = ticker.innerHTML;
      ticker.innerHTML = originalContent + originalContent + originalContent;

      let x = 0;
      const oneSetWidth = ticker.scrollWidth / 3;

      function animate() {
        if (!isPaused) {
          x -= speed;
          if (Math.abs(x) >= oneSetWidth) {
            x = 0;
          }
          ticker.style.transform = `translateX(${x}px)`;
        }
        requestAnimationFrame(animate);
      }

      tickerParent.addEventListener('mouseenter', () => {
        isPaused = true;
      });

      tickerParent.addEventListener('mouseleave', () => {
        isPaused = false;
      });

      animate();
    };

    // Initialize animations after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeTypewriter();
      initializeTicker();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}; 