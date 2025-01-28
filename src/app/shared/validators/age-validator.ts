import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age < 15 || age > 70) {
      return { ageRange: { value: control.value } };
    }
    return null;
  };
}
