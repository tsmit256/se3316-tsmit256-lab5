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

//Ensures email has 1 '@' and not longer than 320 char and strips all special characters
function cleanEmail(res, dirtyInput){
    if((dirtyInput.match(/@/g) || []).length != 1){
        return res.status('400').send('Email should have exactly one "@" character');
    }

    if(dirtyInput.length > 320 || dirtyInput.length < 1){
        return res.status('400').send('Email should be between 1 and 320 characters');
    }

    const cleanInput = dirtyInput.replace(/[(),;:<> ]/g, "");
    return cleanInput;
}

//Remove special characters from password and make less than 100 characters
function cleanPassword(res, dirtyInput){
    if(dirtyInput.length > 100 || dirtyInput.length < 1){
        return res.status('400').send('Password should be between 1 and 100 characters');
    }

    const cleanInput = dirtyInput.replace(/[<>]/g, "");
    return cleanInput;
} 


exports.cleanCode = cleanCode;
exports.cleanScheduleName = cleanScheduleName;
exports.cleanEmail = cleanEmail;
exports.cleanPassword = cleanPassword;

