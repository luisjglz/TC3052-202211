
function greeting(){    
    const d = new Date();
    let hour = d.getHours(); 
    let greet = ""
    if(hour < 12){
        greet = "buenos días"
    }
    else if(hour < 19){
        greet = "buenos días"
    }
    else{
        greet = "buenas noches"
    }  
    return greet
}

module.exports.greeting = greeting


















