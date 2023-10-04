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


// HEADER //
const barMenu = document.querySelector(".bar-menu");
barMenu.addEventListener("click",()=>{
  barMenu.querySelector(".icon-menu").classList.toggle("cancel");
  document.querySelector("nav").classList.toggle("showed");
})


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

const isGraphVisible = (graph)=>{
  graph.style.clipPath= "polygon(0 0, 100% 0, 100% 200%, 0 100%)";
}

const isTextVisible = (text)=>{
  text.style.transform = "translateY(0%)";
}; 


// WALL //

const wall = document.querySelector(".wall__");
var wallText = wall.querySelectorAll("p");
var wallDivider = wall.querySelector(".divider span");


const wallAnime = ()=>{
  var isvisible = isElementVisible(wall,600);

  if(isvisible){
    wallText.forEach(i=>{
      i.style.clipPath= "polygon(0 0, 100% 0%, 100% 100%, 0 100%)";
      i.style.transitionDelay  = (i/10)  + "s";  
    });
    wallDivider.style.width = "100%";
  }   
} 


// GRAPHS //
var graphs = document.querySelectorAll(".graph__");

// HEADLING //
var headlings = document.querySelectorAll(".headling__");

const headlingAnime = ()=>{
  
  headlings.forEach(headling=>{  
    isPageVisible(headling);  
    if(isElementVisible(headling,200)){ headling.querySelector("span").style.width = "2%"; }; 
  })  
}

// INTRO //
const intro = document.querySelector(".__intro");


// CHAPTER 1 //
const chapter1    = document.querySelector(".__chapter__1");
var chapter1Title = chapter1.querySelector(".title__"); 
var chapter1Pages = chapter1.querySelectorAll(".page__");

const chapter1Anime = ()=>{  
  if(isElementVisible(chapter1Title,600)){
    var paragraphs = chapter1Title.querySelectorAll("h1");
    paragraphs.forEach((paragraph) => { isTextVisible(paragraph); });
  };
  chapter1Pages.forEach(page=>{ isPageVisible(page); })  
}


// CHAPTER 2 //
const chapter2    = document.querySelector(".__chapter__2");
var chapter2Title = chapter2.querySelector(".title__"); 
var chapter2Pages = chapter2.querySelectorAll(".page__");
var chapter2Scramble = chapter2.querySelector(".text_scramble__");

var chapter2Text = [`"Unlike religions or meta-narratives, technology manages to 
bring about a civilizational change, regardless of whether one 
believes in it or not."`];


const chapter2Anime = ()=>{  
  if(isElementVisible(chapter2Title,600)){
    var paragraphs = chapter2Title.querySelectorAll("h1");
    paragraphs.forEach((paragraph) => { isTextVisible(paragraph); });
  };
  chapter2Pages.forEach(page=>{ isPageVisible(page); })  
  textScramble(chapter2Scramble.querySelector("h2"),chapter2Text);    
}


// CHAPTER 4 //
const chapter4    = document.querySelector(".__chapter__4");
var chapter4Title = chapter4.querySelector(".title__"); 
var chapter4Pages = chapter4.querySelectorAll(".page__");
// var chapter4Banner = document.querySelector(".banner__");
var chapter4Transition = chapter4.querySelector(".transition__");


const chapter4Anime = ()=>{  
  var titleVisible  = isElementVisible(chapter4Title,600);
  // var bannerVisible = isElementVisible(chapter4Banner,400);
  var transiVisible = isElementVisible(chapter4Transition,500);

  chapter4Pages.forEach(page=>{isPageVisible(page);})  

  if(titleVisible){
    var paragraphs = chapter4Title.querySelectorAll("h1");
    paragraphs.forEach((paragraph) => { isTextVisible(paragraph); });
  };  
  // if(bannerVisible){
  //   var imagenes = chapter4Banner.querySelectorAll(".img__");
  //   imagenes[0].style.clipPath = "polygon(0 0, 48% 0, 48% 100%, 0% 100%)"; 
  //   imagenes[1].style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";        
  // };
  if(transiVisible){
    var img  = chapter4Transition.querySelector(".img__");   
    img.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";    
  } 
  
}



var animationTriggered = false
let counter = 0;
const textScramble  = (element,phrases) => {  
  const shouldAnimate =  !animationTriggered && isElementVisible(element,800); 
  if(shouldAnimate){     
    new TextScramble(element,1500).setText(phrases[counter]).then();
    animationTriggered = true;
  }
};



window.onload = async function() {
  // Call the async function  
  await createIdentificationChart();
  await createOwnershipChart();
  await createPriceHousesChart();
  await createDebtChart();
  await createEmploymentIndustryChart();
  await createGlobalManufacturingChart();
  await createIncomeInequalityChart();

  var graphList = [identificationChart,ownershipChart,priceHousesChart,debtBalanceChart,debtChangeChart,employmentIndustryChart,globalManufacturingChart,incomeInequalityChart]; 
  var animationTriggered = Array(graphs.length).fill(false);



  const chartVisible = () => {    
    graphs.forEach((graph, index) => {   
      const shouldAnimate = !animationTriggered[index] && isElementVisible(graph, 600); 
      if (shouldAnimate) {
        isGraphVisible(graph.querySelector(".chart__"));
        graphList[index].requestAnimationFrame();
        animationTriggered[index] = true;
      }
    });
  };

  window.addEventListener("scroll",()=>{
    if( isElementVisible(intro,700) ){ isPageVisible(intro); }
    wallAnime();
    headlingAnime();    
    chartVisible();
    chapter1Anime();
    chapter2Anime();
    chapter4Anime();    
  })
  
}  