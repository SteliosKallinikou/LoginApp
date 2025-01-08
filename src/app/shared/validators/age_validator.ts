import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function age_Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;

    if (isNaN(age)) {
      return { notNumber: { value: control.value } };
    }
    if (age < 15 || age > 70) {
      return { ageRange: { value: control.value } };
    }
    return null;
  };
}
