// OVERLAY EFFECT //

var preloaded   = document.querySelector(".__preloaded");
var overlay     = preloaded.querySelector(".overlay");

const numberOfElements = 20; // Change this to the number of elements you want to create

for (let i = 0; i < numberOfElements; i++) {
  var newElement = document.createElement("div");
  newElement.className = "bar";
  newElement.style.left = `${5 * i}%`; 
  overlay.appendChild(newElement);
}

var bars = overlay.querySelectorAll(".bar");

const overlayAnime = ()=>{
  bars.forEach((bar,index) => {
    const delay =  index * 0.05; // Adjust the delay duration as needed
    // Create a TweenMax animation for each bar with a staggered delay
    TweenMax.to(bar, 1, {
      width: "5%",
      ease: Power1.easeIn,
      delay: delay, // Apply the calculated delay
    });
  })
}

const loadTextAnime = ()=>{
    preloaded.querySelector("p").style.transform = "translateX(10%)"; 
    preloaded.querySelector("p").style.opacity   = 0; 
}
const preLoadAnime = ()=>{
  loadTextAnime();
  setTimeout(()=>{overlayAnime();},1000);  
}


// WRAPPER

var wrapper = document.querySelector(".__wrapper");

const wrapperView = ()=>{  
 preloaded.style.display = "none";
 preloaded.style.display = "none";
 setTimeout(()=>{ wrapper.style.display   = "block";},100);
}


// MAIN

const main     = document.querySelector(".__main");
var mainTitles = main.querySelectorAll("h1"); 
var mainLine   = main.querySelector(".line");
var mainBroken = main.querySelector(".broken__ h1:nth-of-type(2)");

const mainAnime = ()=>{
  mainTitles.forEach(i=>{i.style.transform = "translateY(0%)"});
  setTimeout(()=>{mainLine.style.width = "20%";},1500);
  setTimeout(()=>{mainBroken.style.right = ".3rem";},3500);
}


const presentationAnime = ()=>{  
  setTimeout(()=>{ preLoadAnime();},1000);
  setTimeout(()=>{ wrapperView(); },4500);
  setTimeout(()=>{ mainAnime();   },5000);
}

presentationAnime(); 



// GLOBALS FUNTIONS //

const isElementVisible = (element,threshold)=>{
  const rect = element.getBoundingClientRect();
  return rect.top < threshold  
};

const isPageVisible = (page) => {  
  const shouldAnimate = isElementVisible(page, 600);
  if (shouldAnimate) {
    var paragraphs = page.querySelectorAll("p");
    paragraphs.forEach((paragraph) => { isTextVisible(paragraph); });
  } 
};

const isTextVisible = (text)=>{
  text.style.transform = "translateY(0%)";
}; 


// INTRO //

const intro = document.querySelector(".__intro");


window.addEventListener("scroll",()=>{
  if(isElementVisible(intro,700)){isPageVisible(intro)}
})