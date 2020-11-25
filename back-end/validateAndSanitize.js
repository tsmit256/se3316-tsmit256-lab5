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
    if((!dirtyInput || dirtyInput.match(/@/g) || []).length != 1){
        return res.status('400').send('Email should have exactly one "@" character');
    }

    if(!/.*[@].+\..+/g.test(dirtyInput)){
        return res.status('400').send("There should be a '.' character after '@' and '.' should have characters on both sides");
    }

    if(dirtyInput.length > 320 || dirtyInput.length < 1){
        return res.status('400').send('Email should be between 1 and 320 characters');
    }

    const cleanInput = dirtyInput.replace(/[(),;:<> ]/g, "");
    return cleanInput;
}

//Remove special characters from password and make less than 100 characters
function cleanPassword(res, dirtyInput){
    if(!dirtyInput || dirtyInput.length > 100 || dirtyInput.length < 1){
        return res.status('400').send('Password should be between 1 and 100 characters');
    }

    const cleanInput = dirtyInput.replace(/<>/g, "");
    return cleanInput;
} 

function cleanName(res, dirtyInput){
    if(!dirtyInput || dirtyInput.length > 200 || dirtyInput.length < 1){
        return res.status('400').send('Name should be between 1 and 200 characters');
    }
    if(dirtyInput == "administrator"){
        return res.status('400').send('This name is reserved. Please use a different name');
    }

    const cleanInput = dirtyInput.replace(/[<>]/g, "");
    return cleanInput;
}

function cleanKeyword(res, dirtyInput){
    if(!dirtyInput || dirtyInput.length > 200 || dirtyInput.length < 4){
        return res.status('400').send('Keyword should be between 1 and 200 characters');
    }

    const cleanInput = dirtyInput.replace(/[<>]/g, "");
    return cleanInput;
}

function limitToPublicSchedules(schedules){
    var limitedSchedules = []

    //limit the info sent to client for each schedule
    for(var i = 0; i < schedules.length; i++){
        var tempSched = {
            name: schedules[i].name,
            lastModified: schedules[i].lastModified,
            creatorName: schedules[i].creatorName,
            courseCount: schedules[i].pairs.length,
            pairs: schedules[i].pairs,
            description: schedules[i].description
        }
        //add this limited info sched to schedules
        limitedSchedules.push(tempSched);
    }

    //sort schedules by lastModified, starting with most recent schedule first
    limitedSchedules.sort( (a,b) => new Date(b.lastModified) - new Date(a.lastModified));

    //max the returned schedules to 10
    limitedSchedules = limitedSchedules.splice(0,10);

    return limitedSchedules;
}

function cleanSchedDescription(res, descr){
    if(descr.length > 500){
        return res.status('400').send('Description should be <= 500 characters');
    }

    const cleanInput = descr.replace(/<>/g, "");
    return cleanInput;
}

function cleanBoolean(res, input){
    //return if it is a boolean
    if(typeof(input) === typeof(true)){
        return input;
    }

    //otherwise return error
    return res.status('400').send('The public indicator is not a boolean');
}

function cleanPairs(res, pairs){
    var pair;
    for(pair in pairs){
        cleanCode(res, pairs[pair].subjectCode);
        cleanCode(res, pairs[pair].catalog_nbr);
    }
    return pairs;
}

function cleanId(res, input){
    //ensure that schedId is a number
    if(typeof(input) === typeof(1) || input == 0){
        return input;
    }
    return res.status('400').send("The id is not a valid id");
}

function cleanReviewDescription(res, descr){
    if(!descr || descr.length > 500 || descr.length < 1){
        return res.status('400').send('Description should be <= 500 and >= 1 characters');
    }

    const cleanInput = descr.replace(/<>/g, "");
    return cleanInput;
}




exports.cleanCode = cleanCode;
exports.cleanScheduleName = cleanScheduleName;
exports.cleanEmail = cleanEmail;
exports.cleanPassword = cleanPassword;
exports.cleanName = cleanName;
exports.cleanKeyword = cleanKeyword;
exports.limitToPublicSchedules = limitToPublicSchedules;
exports.cleanSchedDescription = cleanSchedDescription;
exports.cleanBoolean = cleanBoolean;
exports.cleanPairs = cleanPairs;
exports.cleanId = cleanId;
exports.cleanReviewDescription = cleanReviewDescription;
