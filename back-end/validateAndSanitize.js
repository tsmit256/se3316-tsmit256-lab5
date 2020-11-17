//Ensures code is <=10 characters and then strips all special characters that might do harm!
function cleanCode(res, dirtyInput){
    //Input validation
    if(dirtyInput.length > 10 || dirtyInput.length < 1){ //less than or equal to 10 characters but at least 1.
        return res.status('400').send('Code should be >0 and <=10 characters.');
    }

    //Input filtering for potential malicious attacks
    const cleanInput = dirtyInput.replace(/[ `#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, ""); //remove special characters from input

    return cleanInput;
}

//Ensures schedule name is <=25 characters and strips all special characters that might do harm 
function cleanScheduleName(res, dirtyInput){
    if(dirtyInput.length > 50 || dirtyInput.length < 1){ //less than or equal to 25 characters.
        return res.status('400').send('Schedule Name should be >0 and <=50 characters.');
    }

    //Input filtering for potential malicious injection attacks
    const cleanInput = dirtyInput.replace(/[`#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, ""); //remove special characters from input

    return cleanInput;
}


exports.cleanCode = cleanCode;
exports.cleanScheduleName = cleanScheduleName;

