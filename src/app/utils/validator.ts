import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";

export function noWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    const isWhitespace = value.length === 0;
    return !isWhitespace ? null : { whitespace: true };
  };
}

export function isEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valid = emailRegex.test(control.value);
        return of(valid ? null : { invalidEmail: true });
    };
}

export function isValidPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = (control.value || '').trim();
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        const isValid = passwordRegex.test(value);
        return isValid ? null : { invalidPassword: true };
    };
}

export function passwordNotMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const passwordControl = formGroup.get(password);
        const confirmPasswordControl = formGroup.get(confirmPassword);
        if (!passwordControl || !confirmPasswordControl) {
            return null;
        }
        const isMatch = passwordControl.value === confirmPasswordControl.value;
        return isMatch ? null : { passwordNotMatch: true };
    };
}
export function isPhoneNumber(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const phoneRegex = /^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])\d{7}$/;
        const valid = phoneRegex.test(control.value);
        return of(valid ? null : { invalidPhoneNumber: true });
    };
}
export function youtubeLinkValidator(): ValidatorFn {
  const YOUTUBE_REGEX = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})(.*)?$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; 
    }
    return YOUTUBE_REGEX.test(value)
      ? null
      : { invalidYoutubeLink: true };
  };
}