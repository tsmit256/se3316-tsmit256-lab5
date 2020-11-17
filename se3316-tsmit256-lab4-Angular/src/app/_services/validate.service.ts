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
    if(/[<>]/.test(pass)){
        alert('Please remove <> characters from password');
        return false;
    }
    
    return true;
  } 

}
