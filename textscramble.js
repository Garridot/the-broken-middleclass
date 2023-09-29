// Easing function for a smoother transition
function easeOut(t) {
    return 1 - Math.pow(1 - t, 2);
}

class TextScramble {
    constructor(el, animationDuration = 1000) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.animationDuration = animationDuration;
      this.update = this.update.bind(this);
    }
    
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * this.animationDuration);
        const end = start + Math.floor(Math.random() * this.animationDuration);
        this.queue.push({ from, to, start, end });
      }
      
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.startTime = performance.now();
      this.update();
      
      return promise;
    }
    
    update() {        
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;
        const progress = Math.min(1, elapsedTime / this.animationDuration); // Calculate progress as a value between 0 and 1
    
        let output = '';
        let complete = 0;
    
        for (let i = 0, n = this.queue.length; i < n; i++) {                                    
            let { from, to, start, end, char } = this.queue[i];        
            if (elapsedTime >= end) {                
                complete++;
                output += to;
            } else if (elapsedTime >= start) {                
                if (!char || Math.random() < 0.28) {                    
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                // Use the easing function to create a smooth transition between characters
                const easedProgress = easeOut((progress - (start / this.animationDuration)) * (this.animationDuration / (end - start)));
                output += `<span class="dud" style="opacity:${easedProgress}">${char}</span>`;
            } else {                
                output += from;
            }
            }
        
        this.el.innerHTML = output;
    
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
        }
    }
    
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }