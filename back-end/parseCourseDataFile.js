const timetableData = require('./Lab3-timetable-data.json'); //path to the timetable data json

function extractAllSubjects(){
    const subjects = [];
    for (var i in timetableData){ //iterate through each item in json array file
        var tempSubjectCode = timetableData[i].subject;
        var tempCatalog_nbr = timetableData[i].catalog_nbr;

        var isDuplicate = false;
        for(var j in subjects){ 
            if(subjects[j].subjectCode == tempSubjectCode){ //If the subjectCode is already in the array, then flag it (avoid duplicates!)
                isDuplicate = true;
            }
        }

        if(!isDuplicate){ //only add new item for subjectCodes that do not yet exist in the array.
            subjects.push({"subjectCode":tempSubjectCode});
        }
    }
    return subjects;
}

function extractAllClassNames(){
    const classNames = [];
    for (var i in timetableData){ //iterate through each item in json array file
        var tempClassNames = timetableData[i].className;

        var isDuplicate = false;
        for(var j in classNames){ 
            if(classNames[j].className == tempClassNames){ //If the subjectCode is already in the array, then flag it (avoid duplicates!)
                isDuplicate = true;
            }
        }

        if(!isDuplicate){ //only add new item for subjectCodes that do not yet exist in the array.
            classNames.push({"className":tempClassNames});
        }
    }
    return classNames;
}


//This function assumes a valid subjectCode input (verification is in server's index.js)
function extractCoursesBySubject(subjectCode){
    const courses = [];
    for(i in timetableData){ 
        if(subjectCode == timetableData[i].subject){
            courses.push(timetableData[i]); //only extract objects that have the correct subjectCode
        }
    }
    if(courses.length > 0){ //If there are courses with matching subjectCode
        return courses;
    }
    else{ //If no result was found
        return false; //bad request
    }
}

//Extract all the subject information for the matching catalog_nbr - then send to client so client can display results
function extractCoursesByCatalogNbr(inputtedSubjectCode, inputtedCatalog_nbr){ 
    const courses = extractCoursesBySubject(inputtedSubjectCode);
    var course = [];

    for (var i in courses){ //iterate through each item in json array of courses matching the subjectCode above
        var tempCatalog_nbr = courses[i].catalog_nbr;

        //If the catalog_nbr matches, then this is the right object!
        if(tempCatalog_nbr == inputtedCatalog_nbr){
            course.push(courses[i]);
        }
    }

    if(course.length > 0){
        return course;
    }
    else{
        return false;
    }
    
}


function extractCoursesByComponent(inputtedSubjectCode, inputtedCatalog_nbr, inputtedComponent){
    const course = extractCoursesByCatalogNbr(inputtedSubjectCode, inputtedCatalog_nbr);
    var tempCourse = JSON.parse(JSON.stringify(course)); //make a copy of course object
    tempCourse[0].course_info = []; //set the course_info of the new object to empty

    for(var i= course[0].course_info.length-1; i >= 0; i--){ //for each element in the course_info array
        var tempComponent = course[0].course_info[i].ssr_component;
        
        //If the component does match, then add this component to the course object!
        if(tempComponent == inputtedComponent){
            tempCourse[0].course_info.push(course[0].course_info[i]);
        }
    }

    if(tempCourse[0].course_info.length == 0){
        return false;
    }
    return tempCourse;
}

exports.extractAllSubjects = extractAllSubjects;
exports.extractAllClassNames = extractAllClassNames;
exports.extractCoursesBySubject = extractCoursesBySubject;
exports.extractCoursesByCatalogNbr = extractCoursesByCatalogNbr;
exports.extractCoursesByComponent = extractCoursesByComponent;