import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  isValidScheduleName(schedNameInput: string){
    if (schedNameInput.length > 50 || schedNameInput.length < 1) { //only valid if length is less than or equal to 50 characters
      alert("Schedule name should be >=1 and <=50 characters.");
      return false;
      }
      else if(/[`#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(schedNameInput)){ //check if there is a special character
          alert("Please remove any special character from schedule name.");
          return false;
      }
    return true;
  }

  isValidCode(code: string){
    if (code.length > 10 || code.length < 1) { //only valid if length is <=10 characters and at least one
      alert("Please enter code between 1-10 characters.");
      return false;
      }
      else if(/[ `#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(code)){ //check if there is a special character
          alert("Please remove special characters from code.");
          return false;
      }
    return true;
  }

  //Ensures email has 1 '@' and not longer than 320 char and checks for certain special chars
  isValidEmail(email: string){
    if((email.match(/@/g) || []).length != 1){
      alert("Please only use one '@' charcter in email")  
      return false;
    }

    if(!/.*[@].+\..+/g.test(email)){
      alert("There should be a '.' character after '@' and '.' should have characters on both sides");
      return false;
    }

    if(email.length > 320 || email.length < 1){
        alert('Email should be between 1 and 320 characters');
        return false;
    }

    if(/[(),;:<> ]/.test(email)){
      alert("Please remove (),;:<> characters from email");
      return false;
    }
  
    return true;
  }

  //Remove special characters from password and make less than 100 characters
  isValidPassword(pass: string){
    if(pass.length > 100 || pass.length < 1){
        alert('Password should be between 1 and 100 characters');
        return false;
    }
    if(/<>/.test(pass)){
        alert('Please remove <> characters from password');
        return false;
    }
    
    return true;
  } 

  //Remove special characters from name and make less than 100 characters
  isValidName(name: string){
    if(name.length > 200 || name.length < 1){
        alert('Name should be between 1 and 200 characters');
        return false;
    }
    if(/[<>]/.test(name)){
        alert('Please remove <> and [] characters from name');
        return false;
    }
    
    return true;
  } 

  //Remove special characters from keyword and make <= 200 characters
  isValidKeyword(keyword: string){
    if(keyword.length > 200 || keyword.length < 4){
        alert('Name should be between 4 and 200 characters');
        return false;
    }
    if(/[<>]/.test(name)){
        alert('Please remove <> and [] characters from keyword');
        return false;
    }
    
    return true;
  }
  
  isValidSchedDescription(descr: string){
    if(descr.length > 500){
      alert('Description should be <= 500 characters')  
      return false;
    }

    if(/<>/.test(descr)){
      alert('Please remove <> characters from description');
      return false;
    }
    return true;
  }

  isValidBoolean(input){
    //return if it is a boolean
    if(typeof(input) === typeof(true)){
        return true;
    }

    //otherwise return error
    alert('The public flag should be a boolean');
    return false;
  }

  isValidReviewDescription(descr: string){
    if(descr.length > 500 || descr.length < 1){
      alert('Description should be <= 500 and >= 1 characters')  
      return false;
    }

    if(/<>/.test(descr)){
      alert('Please remove <> characters from review message');
      return false;
    }
    return true;
  }

}
