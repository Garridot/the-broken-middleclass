// Define the media query
const mediaQuery       = window.matchMedia('(min-width: 1000px)');
const mediaQueryMobile = window.matchMedia('(max-width: 600px)');

  
// Function to perform a fetch and handle caching
async function fetchDataWithCache(key, url) {    
    // Check if the data is cached
    const cachedData = localStorage.getItem(key);
  
    if (cachedData) {        
        // If cached data exists, parse and use it
        const parsedData = JSON.parse(cachedData);
        return parsedData;
    } else {        
        // If not cached, make a fetch request
        try {            
            const response = await fetch(url);
            if (response.ok) {
            const data = await response.json();
    
            // Save the response in localStorage for future use
            localStorage.setItem(key, JSON.stringify(data));
    
            return data;
            } else {
                throw new Error('Fetch request failed');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
 

// Define unique keys for each cached response
const cacheKeys = {    
    classIdentification : 'classIdentificationCache',
    homeownershipRate   : 'homeownershipRateCache',
    priceHouses         : 'priceHousesCache',
    debtBalance         : 'debtBalanceCache',
    employmentIndustry  : 'employmentIndustry',
    globalManufacturing : 'globalManufacturing',
    incomeInequality    : 'incomeInequality' 
};
  
// Fetch functions with caching
const getClassIdentification = async () => {
    return await fetchDataWithCache(cacheKeys.classIdentification, 'https://economy-data-api.onrender.com/api/class_identification_gallup');
};

const getHomeownershipRate = async () => {
    return await fetchDataWithCache(cacheKeys.homeownershipRate, 'https://economy-data-api.onrender.com/api/homeownership_rate_usa');
};

const getPriceHouses = async () => {
    return await fetchDataWithCache(cacheKeys.priceHouses, 'https://economy-data-api.onrender.com/api/median_price_houses_sold/median_household_income');
};

const debtBalance = async () => {
    return await fetchDataWithCache(cacheKeys.debtBalance, 'https://economy-data-api.onrender.com/api/debt_balance');
};
const getEmploymentIndustry = async () =>{
    return await fetchDataWithCache(cacheKeys.employmentIndustry,'https://economy-data-api.onrender.com/api/employment_industry')
}
const getGlobalManufacturing = async () => {
    return await fetchDataWithCache(cacheKeys.globalManufacturing, 'https://economy-data-api.onrender.com/api/global_manufacturing_2019');
};
const getIncomeInequality = async () => {
    return await fetchDataWithCache(cacheKeys.incomeInequality, 'https://economy-data-api.onrender.com/api/income_inequality');
};



//// Chart Class ////
class identificationClass{   

    constructor(classIdentificationData) {
        this.rangeSalaries     = classIdentificationData.map(item => item["range_salary"]);
        this.lowerClass        = classIdentificationData.map(item => item["lower"]);
        this.workingClass      = classIdentificationData.map(item => item["working"]);
        this.middleClass       = classIdentificationData.map(item => item["middle"]);
        this.upperMiddleClass  = classIdentificationData.map(item => item["upper-middle"]);
        this.upperClass        = classIdentificationData.map(item => item["upper"]);
        this.configChart       = configChart();
        this.chart  = null;       
    }    

    getData(){
        return [        
            {
                label: "Lower",
                data: this.lowerClass,  
                backgroundColor: "#bdd2cb",
            },
            {
                label: "Working",
                data: this.workingClass,  
                backgroundColor: "#83aa9d",           
            },
            {
                label: "Middle",
                data: this.middleClass,  
                backgroundColor: "#679586",               
            },
            {
                label: "Upper-middle",
                data: this.upperMiddleClass, 
                backgroundColor: "#3f5b52",                
            },
            {
                label: "Upper",
                data: this.upperClass,  
                backgroundColor: "#2b3e38",              
            },
        ] 
    }
    
    createChart(){       
        

        this.configChart.type = 'bar'; 
        this.configChart.data.datasets = null;    
        this.configChart.data.labels   = this.rangeSalaries;        
        this.configChart.options.indexAxis = "y";            
        this.configChart.options.interaction.intersect = true;
        this.configChart.options.plugins.title.text = "Social Class Identification by Household Income";        
        this.configChart.options.animation = animationDelayBar(100);

        if(mediaQueryMobile.matches){
            this.configChart.options.scales.y.ticks.font.size = 10            
        }else{ 
            this.configChart.options.scales.y.ticks.font.size = 12 
        }  

        const ctx  = document.querySelector('#socialclassChart').getContext('2d');
        this.chart  = new Chart(ctx, this.configChart)
    }  
    
    requestAnimationFrame(){
        this.configChart.data.datasets = this.getData();
        this.configChart.options.animation = animationDelayBar(100);
        this.chart.update()
    }
}
class homeownershipChart{

    constructor(homeownershipData){
        
        this.date              = homeownershipData.map(item => item.index);
        this.homeownershipRate = homeownershipData.map(item => item["Homeownership Rate in the United States"]);
        this.configChart       = configChart();
        this.chart             = null;       
    }

    getData(){
        return {
            label: "Homeownership Rate",
            data: this.homeownershipRate,             
            borderColor: "#cfded9",
            pointRadius: 0, 
            borderWidth: 2,
        }
    }

    
    createChart(){         
       

        this.configChart.type = 'line'; 
        this.configChart.data.datasets = null;      
        this.configChart.data.labels = this.date;
        this.configChart.options.indexAxis = "x";
        this.configChart.options.plugins.title.text = "Homeownership Rate for the United States.";
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.text = "Since 1965-2022.";
        this.configChart.options.scales = scalesLIneChart;
        this.configChart.options.animation = animationProgressLine(this.homeownershipRate);
    
        const ctx2 = document.querySelector('#homeownershipChart').getContext('2d');
        this.chart = new Chart(ctx2, this.configChart);
    } 

    requestAnimationFrame(){
        this.configChart.data.datasets = [this.getData()]; // Wrap the object in an array   
        this.configChart.options.animation = animationProgressLine(this.homeownershipRate);
        this.chart.update()
    }
    
}
class priceHousesClass{

    constructor(priceHousesData){
        this.date                  = priceHousesData.map(item => item.index);
        this.priceHouses           = priceHousesData.map(item => item["Median Sales Price of Houses Sold for the United States"]);
        this.householdIncome       = priceHousesData.map(item => item["Real Median Household Income in the United States"]);
        this.configChart           = configChart();
        this.chart                 = null;       
    }

    getData(){
        return  [            
            {
                label: "Median Sales Price of Houses Sold",
                data: this.priceHouses, 
                borderColor: "#bdd2cb",                
                fill: 'origin', // Fill the area under the line
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "Real Median Household Income",
                data: this.householdIncome,  
                fill: 'origin',
                borderColor: "#f27d70",  
                pointRadius: 0,
                borderWidth: 2,
            },          
        ]
    }

    createChart(){     
        
        this.configChart.type = 'line'; 
        this.configChart.data.datasets = this.getData(); // Wrap the object in an array
        this.configChart.data.labels = this.date ;
        this.configChart.options.indexAxis = "x";
        this.configChart.options.plugins.title.text = "Contrasting Trends: Housing Cost vs. Household Income for the United States.";  
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.text = "Sice 1984-2022";
        this.configChart.options.scales = scalesLIneChart;        
        this.configChart.options.animation = animationProgressLine(this.priceHouses);

        if(mediaQueryMobile.matches){
            this.configChart.options.scales.y.ticks.font.size = 10            
        }else{ 
            this.configChart.options.scales.y.ticks.font.size = 12 
        } 
    
        const ctx3 = document.querySelector("#priceHousesChart").getContext('2d'); 
        this.chart = new Chart(ctx3, this.configChart);
    } 

    requestAnimationFrame(){
        this.configChart.data.datasets = this.getData();
        this.configChart.options.animation = animationProgressLine(this.priceHouses);
        this.chart.update()
    }
    
}
class debtBalanceChartClass{

    constructor(debtData){

        this.date              = debtData.map(item => item["0"]);
        this.mortgage          = debtData.map(item => item["Mortgage"]);
        this.HE_revolving      = debtData.map(item => item["HE Revolving"]);
        this.auto_loan         = debtData.map(item => item["Auto Loan"]);
        this.credit_card       = debtData.map(item => item["Credit Card"]);
        this.student_loan      = debtData.map(item => item["Student Loan"]);
        this.other             = debtData.map(item => item["Other"]);
        
        this.configChart       = configChart();        
        this.chart             = null;              
    }

    getData(){
        
        return  [
            {
                label: "Mortgage",
                data: this.mortgage, 
                backgroundColor: "#bdd2cb",   
            },
            {
                label: "HE Revolving",
                data: this.HE_revolving,  
                backgroundColor: "#83aa9d", 
            },
            {
                label: "Auto Loan",
                data: this.auto_loan, 
                backgroundColor: "#679586", 
            },
            {
                label: "Credit Card",
                data: this.credit_card,  
                backgroundColor: "#3f5b52",  
            },
            {
                label: "Student Loan",
                data: this.student_loan, 
                backgroundColor: "#2b3e38",   
            },
            {
                label: "Other",
                data: this.other,  
                backgroundColor: "#f27d70", 
            },
        ]
    }
    createChart(){ 
        
        this.configChart.type = 'bar'; 
        this.configChart.data.datasets = this.getData(); 
        this.configChart.data.labels = this.date;        
        this.configChart.options.indexAxis = "x";        
        this.configChart.options.interaction.intersect = true;
        this.configChart.options.plugins.title.text = "Total Debt Balance and Its Composition";   
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.text = "Trillions of Dolars. The data covers quarterly frequency from 2013-2023.";
        this.configChart.options.scales.y.grid = scalesLIneChart.y.grid;
        this.configChart.options.scales.x.ticks.display = true;
        this.configChart.options.animation = animationDelayBar(10);

        if(mediaQueryMobile.matches){
            this.configChart.options.scales.y.ticks.font.size = 10            
        }else{ 
            this.configChart.options.scales.y.ticks.font.size = 12 
        } 
    
        const ctx4 = document.querySelector("#debetBalanceChart").getContext('2d'); 
        this.chart = new Chart(ctx4, this.configChart);
    }
    requestAnimationFrame(){
        this.configChart.data.datasets     = this.getData();
        this.configChart.options.animation = animationDelayBar(10);        
        this.chart.update()
    }    
}

class debtChangeClass{

    constructor(debtData){
        this.mortgage          = debtData.map(item => item["Mortgage"]);
        this.HE_revolving      = debtData.map(item => item["HE Revolving"]);
        this.auto_loan         = debtData.map(item => item["Auto Loan"]);
        this.credit_card       = debtData.map(item => item["Credit Card"]);
        this.student_loan      = debtData.map(item => item["Student Loan"]); 
        this.configChart       = configChart();        
        this.chart             = null;
    }    

    getData(){
        var mortgage          = relativeIncrease(this.mortgage[0],     Object.values(this.mortgage)[Object.keys(this.mortgage).length - 1]);
        var HE_revolving      = relativeIncrease(this.HE_revolving[0], Object.values(this.HE_revolving)[Object.keys(this.HE_revolving).length - 1]);
        var auto_loan         = relativeIncrease(this.auto_loan[0],    Object.values(this.auto_loan)[Object.keys(this.auto_loan).length - 1]);
        var credit_card       = relativeIncrease(this.credit_card[0],  Object.values(this.credit_card)[Object.keys(this.credit_card).length - 1]);
        var student_loan      = relativeIncrease(this.student_loan[0], Object.values(this.student_loan)[Object.keys(this.student_loan).length - 1]); 

        return { 
            label: 'Percentage Increase',
            data: [mortgage,HE_revolving,auto_loan,credit_card,student_loan],
            borderWidth: 1,
            borderColor: "#cedddd",
            backgroundColor: [
                '#2b3e38',
                '#83aa9d',
                '#679586',
                "#f27d70",
                '#bdd2cb'
            ],
            hoverOffset: 10
        }
        
    }
    createChart(){      
        this.configChart.type          = 'doughnut'; 
        this.configChart.data.labels   = ['Mortgage', 'HE Revolving', 'Auto Loan', 'Credit Card', 'Student Loan'];
        this.configChart.data.datasets = [this.getData()]; 
        this.configChart.options.cutout = '60%'; 
        this.configChart.options.interaction.intersect = true; 
        
        this.configChart.options.plugins.title.text       = "Change in the U.S. Household Debt";   
        this.configChart.options.plugins.title.align      = "center";   
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.align   = "center";  
        this.configChart.options.plugins.subtitle.text    = "Percentage Change Since 2003 to First Quarter of 2023"; 
        this.configChart.options.plugins.legend.align     = "center"; 

        this.configChart.options.scales.y.ticks.display = false,

        this.configChart.options.animation              = animationDonut();
        
        
        const ctx5 = document.querySelector("#debetChangeChart").getContext('2d'); 
        this.chart = new Chart(ctx5, this.configChart);
    }

    requestAnimationFrame(){
        this.configChart.data.datasets     = [this.getData()];
        this.configChart.options.animation = animationDonut();
        this.chart.update()
    }
    
}
class employmentIndustryClass{

    constructor(employmentIndustryData){
        this.date                  = employmentIndustryData.map(item => item.date);
        this.china                 = employmentIndustryData.map(item => item["China"]);
        this.france                = employmentIndustryData.map(item => item["France"]);
        this.germany               = employmentIndustryData.map(item => item["Germany"]);
        this.italy                 = employmentIndustryData.map(item => item["Italy"]);
        this.japan                 = employmentIndustryData.map(item => item["Japan"]);
        this.unitedKingdom         = employmentIndustryData.map(item => item["United Kingdom"]);
        this.unitedStates          = employmentIndustryData.map(item => item["United States"]);
        this.vietnam               = employmentIndustryData.map(item => item["Vietnam"]);
        this.configChart           = configChart();
        this.chart                 = null;       
    }

    getData(){
        return  [            
            {
                label: "China",
                data: this.china, 
                borderColor: "#BA3737", 
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "France",
                data: this.france,
                borderColor: "#decfd1",  
                pointRadius: 0,
                borderWidth: 2,
            }, 
            {
                label: "Germany",
                data: this.germany, 
                borderColor: "#146f75",  
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "Italy",
                data: this.italy, 
                borderColor: "#f27d70",  
                pointRadius: 0,
                borderWidth: 2,
            },    
            {
                label: "Japan",
                data: this.japan, 
                borderColor: "#7cc5b4",
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "United Kingdom",
                data: this.unitedKingdom, 
                borderColor: "#d5cfde",  
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "United States",
                data: this.unitedStates, 
                borderColor: "#2da3b4",  
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "Vietnam",
                data: this.vietnam,  
                fill: 'origin',
                borderColor: "#cedddd",  
                pointRadius: 0,
                borderWidth: 2,
            },          
        ]
    }

    createChart(){     
        
        this.configChart.type = 'line'; 
        this.configChart.data.datasets = this.getData(); // Wrap the object in an array
        this.configChart.data.labels = this.date ;
        this.configChart.options.indexAxis = "x";
        this.configChart.options.plugins.title.text = "Employment in Industry as a Percentage of Total Employment.";  
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.text = "Sice 1991-2021";
        this.configChart.options.scales = scalesLIneChart;        
        this.configChart.options.animation = animationProgressLine(this.date);

        if(mediaQueryMobile.matches){
            this.configChart.options.scales.y.ticks.font.size = 10            
        }else{ 
            this.configChart.options.scales.y.ticks.font.size = 12 
        } 
    
        const ctx3 = document.querySelector("#employmentIndustry").getContext('2d'); 
        this.chart = new Chart(ctx3, this.configChart);
    } 

    requestAnimationFrame(){
        this.configChart.data.datasets = this.getData();
        this.configChart.options.animation = animationProgressLine(this.date);
        this.chart.update()
    }
    
}
class globalManufacturingClass{
    constructor(data){
        this.china                 = data.map(item => item["China"]);
        this.unitedStates          = data.map(item => item[" United State"]);
        this.japan                 = data.map(item => item[" Japan"]);
        this.germany               = data.map(item => item[" Germany"]);
        this.india                 = data.map(item => item[" India"]);
        this.southKorea            = data.map(item => item["South Korea"]);
        this.italy                 = data.map(item => item["Italy"]);
        this.france                = data.map(item => item["France"]);        
        this.unitedKingdom         = data.map(item => item["United Kingdom"]);        
        this.indonesia             = data.map(item => item["Indonesia"]); 

        this.configChart       = configChart();        
        this.chart             = null;
    }
    getData(){
        
        return { 
            label: 'Global Manufacturing Output',
            data: [
                this.china,this.unitedStates,this.japan,this.germany,this.india,
                this.southKorea,this.italy,this.france,this.unitedKingdom,this.indonesia
            ],
            borderWidth: 1,
            borderColor: "#cedddd",
            backgroundColor: [
                "#cfded5","#3f5b4a","#b8cec1","#67967a","#cfd4de","#146f75","#f27d70","#ddcfde","#11444f","#decfd1"
            ],
            hoverOffset: 10
        }
    }
    createChart(){      
        this.configChart.type          = 'doughnut'; 
        this.configChart.data.labels   = ['China', 'United State', 'Japan', 'Germany', 'India','South Korea','Italy','France','United Kingdom','Indonesia'];
        this.configChart.data.datasets = [this.getData()]; 
        this.configChart.options.cutout = '60%'; 
        this.configChart.options.interaction.intersect = true; 
        
        this.configChart.options.plugins.title.text       = "Top 10 countries by share of global manufacturing output in 2019.";   
        this.configChart.options.plugins.title.align      = "center";   
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.align   = "center";  
        this.configChart.options.plugins.subtitle.text    = "*Output: measured on a value-added basis in current U.S. dollars "; 
        this.configChart.options.plugins.legend.align     = "center"; 

        this.configChart.options.scales.y.ticks.display = false,

        this.configChart.options.animation              = animationDonut();
        
        
        const ctx5 = document.querySelector("#globalManufacturing").getContext('2d'); 
        this.chart = new Chart(ctx5, this.configChart);
    }

    requestAnimationFrame(){
        this.configChart.data.datasets     = [this.getData()];
        this.configChart.options.animation = animationDonut();
        this.chart.update()
    }
}
class incomeInequalityClass{

    constructor(data){
        this.date                  = data.map(item => item["Year"]);
        this.bottom90              = data.map(item => item["Bottom 90%"]);
        this.from90                = data.map(item => item["90th 95th"]);
        this.from95                = data.map(item => item["95th 99th"]);
        this.top1                  = data.map(item => item["Top 1%"]);
        
        this.configChart           = configChart();
        this.chart                 = null;       
    }

    getData(){
        return  [            
            {
                label: "Top 1%",
                data: this.top1, 
                borderColor: "#c3d6cb", 
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "95th 99th",
                data: this.from95,
                borderColor: "#7ea68e",  
                pointRadius: 0,
                borderWidth: 2,
            }, 
            {
                label: "90th 95th",
                data: this.from90, 
                borderColor: "#acc6b6",  
                pointRadius: 0,
                borderWidth: 2,
            },  
            {
                label: "Bottom 90%",
                data: this.bottom90, 
                borderColor: "#BA3737",  
                pointRadius: 0,
                borderWidth: 2,
            },  
        ]
    }
    createChart(){     
        
        this.configChart.type = 'line'; 
        this.configChart.data.datasets = this.getData(); // Wrap the object in an array
        this.configChart.data.labels = this.date ;
        this.configChart.options.indexAxis = "x";
        this.configChart.options.plugins.title.text = "Cumulative percent change in real annual wages, by wage group.";  
        this.configChart.options.plugins.subtitle.display = true;
        this.configChart.options.plugins.subtitle.text = "Sice 1980–2019";
        this.configChart.options.scales = scalesLIneChart;        
        this.configChart.options.animation = animationProgressLine(this.date);

        if(mediaQueryMobile.matches){
            this.configChart.options.scales.y.ticks.font.size = 10            
        }else{ 
            this.configChart.options.scales.y.ticks.font.size = 12 
        } 
    
        const ctx3 = document.querySelector("#incomeInequality").getContext('2d'); 
        this.chart = new Chart(ctx3, this.configChart);
    } 

    requestAnimationFrame(){
        this.configChart.data.datasets = this.getData();
        this.configChart.options.animation = animationProgressLine(this.date);
        this.chart.update()
    }
}




//// Chart Variables ///// 
const configChart = ()=>{
    return {
        type: null,  
        data: {
            labels: null,    
            datasets: null,
        },
        options: {             
            maintainAspectRatio: false,              
            responsive: true,
            indexAxis: 'x',
            cutout: null,            
            interaction: {                
                mode: 'index',                        
                intersect: false,
                includeInvisible: true
            },                       
            plugins: {    
                title: {
                    display: true,
                    text: null,
                    align: 'start',
                    color: '#c7c7c7',                
                    font: {
                        size: 18, 
                        family: "NeueMontreal-Light",
                        weight: 100,                    
                    },
                    padding: {                   
                        bottom: 5,
                    }
                }, 
                subtitle: {
                    display: null,
                    text: null,
                    align: 'start',
                    color: '#aaa',  
                    padding: {                   
                        bottom: 10,
                    } 
                },
                legend: {
                    display: true,
                    align: 'start',                    
                    labels: {
                        color: '#c7c7c7',
                        margin:30,                 
                    },                
                }
            },

            scales: {
                x: { 
                    stacked: true,
                    ticks: {
                        display: false
                    }
                },
                
                y: { 
                    stacked: true,                        
                    ticks: {
                        color: "#c7c7c7", 
                        stepSize: 1,
                        beginAtZero: true, 
                        font: {
                            size: null,                                                
                        },                                                            
                    }

                },                         
            }, 
        },
           
    }
}
var scalesLIneChart = {
    x: { 
        stacked: true,
        ticks: {
            display:  true,
            color: "#c7c7c7", 
            stepSize: 1,
            beginAtZero: true
        },       
    },
    y: {
                                        
        ticks: {
            display:  true,
            color: "#c7c7c7", 
            stepSize: 1,
            beginAtZero:true,
            font: {
                size: null,                                                
            },  
        },
        border: {
            display: true,
        },
        grid: {
            color: '#aaaaaa30', // Set the color for x-axis gridlines
            drawOnChartArea: true,
            drawTicks: true,
        }
    }               
}

//// Chart Animations ////
const animationProgressLine = (chartData)=>{
    var delayBetweenPoints = 2000 / chartData.length;
    const previousY = (ctx) =>
        ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(100)
            : ctx.chart
                  .getDatasetMeta(ctx.datasetIndex)
                  .data[ctx.index - 1].getProps(["y"], true).y;
    return {
        x: {
            type: "number",
            easing: "linear",
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== "data" || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            },
        },
        y: {
            type: "number",
            easing: "linear",
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== "data" || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            },
        },
    };
}
const animationDelayBar = (time)=>{
    let delayed;
    return {
        onComplete: () => {                
            delayed = true;
        },
        delay: (context) => {                
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {                    
                delay = context.dataIndex * time + context.datasetIndex * time;
            }                
            return delay;
        },
    }
}
const animationDonut = ()=>{
    return {
        animationEasing: "easeOutSine",
        animateRotate: true, // Animate the rotation of the doughnut chart
        duration: 3000 // Set the animation duration to 2000 milliseconds (2 seconds)
    }
}


//// Chart Create ////
let identificationChart;
let ownershipChart;
let priceHousesChart;
let debtBalanceChart;
let debtChangeChart;
let employmentIndustryChart;
let globalManufacturingChart;
let incomeInequalityChart;

async function createIdentificationChart(){    
    const classIdentificationData = await getClassIdentification();    
    identificationChart           = new identificationClass(classIdentificationData);
    identificationChart.createChart();
}

async function createOwnershipChart() {
    const homeownershipData = await getHomeownershipRate(); 
    ownershipChart          = new homeownershipChart(homeownershipData);
    ownershipChart.createChart();   
};
async function createPriceHousesChart(){
    const priceHousesData = await getPriceHouses()
    priceHousesChart      = new priceHousesClass(priceHousesData);
    priceHousesChart.createChart();    
};
async function createDebtChart(){
    const debtData   = await debtBalance();
    debtBalanceChart = new debtBalanceChartClass(debtData);
    debtBalanceChart.createChart();

    debtChangeChart = new debtChangeClass(debtData);
    debtChangeChart.createChart();
};

async function createEmploymentIndustryChart(){
    const employmentIndustryData   = await getEmploymentIndustry();
    employmentIndustryChart = new employmentIndustryClass(employmentIndustryData); 
    employmentIndustryChart.createChart();
}

async function createGlobalManufacturingChart(){
    const data = await getGlobalManufacturing();
    globalManufacturingChart = new globalManufacturingClass(data);
    globalManufacturingChart.createChart();
}

async function createIncomeInequalityChart(){
    const data = await getIncomeInequality();
    console.log(data)
    incomeInequalityChart = new incomeInequalityClass(data);
    incomeInequalityChart.createChart();
} 


// const awaitCharts = async function(){
//     // Call the async function 
//     await createIdentificationChart();
//     await createOwnershipChart();
//     await createPriceHousesChart();
//     await createDebtChart();
//     await createEmploymentIndustryChart();
//     await createGlobalManufacturingChart();
//     await createIncomeInequalityChart();
//     }







function relativeIncrease(originalDebt,currentDebt){    
    originalDebt = originalDebt *  1000000000000
    currentDebt  = currentDebt *  1000000000000
  
    var relativeIncrease = ((currentDebt - originalDebt ) / originalDebt) * 100

   
  
    return parseFloat(relativeIncrease.toFixed(2))
  
}
