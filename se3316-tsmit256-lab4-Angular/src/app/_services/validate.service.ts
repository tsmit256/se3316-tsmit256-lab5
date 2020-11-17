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
}