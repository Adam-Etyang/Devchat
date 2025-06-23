// ===== ANIMATION FUNCTIONS =====

// Ticker carousel animation
function initializeTicker() {
  const ticker = document.getElementById("ticker");
  if (!ticker) return; // Exit if ticker doesn't exist on current page

  const tickerParent = ticker.parentElement;
  let isPaused = false;
  let speed = 1; // pixels per frame

  const originalContent = ticker.innerHTML; // store original content
  // duplicate ticker content to make infinite loop
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

  // pause on hover
  tickerParent.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  tickerParent.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  animate(); // start the animation
}




// Typewriter animation
function initializeTypewriter() {
  const typewriter = document.getElementById("typewriter");
  if (!typewriter) return; // Exit if typewriter doesn't exist on current page

  const words = ["together", "Seemlessly", "effortlessly"];
  let wordIndex = 0; // tracks which word we're on
  let charIndex = 0; // tracking how many characters are shown
  let isDeleting = false; // tracking if typing or deleting the letter

  function type() {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);

    typewriter.textContent = currentText;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        charIndex++; // type out the next letter
        setTimeout(type, 100);
      } else {
        isDeleting = true;
        setTimeout(type, 2000); // wait before deleting
      }
    } else {
      if (charIndex > 0) {
        charIndex--; // delete the last letter
        setTimeout(type, 50); // delete faster than typing
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500); // wait before typing the next word
      }
    }
  }

  type(); // start the typewriter effect
}

//fires when the HTML is fully parsed and the DOM is ready
document.addEventListener('DOMContentLoaded', function () {

  initializeTicker();
  initializeTypewriter();
});
