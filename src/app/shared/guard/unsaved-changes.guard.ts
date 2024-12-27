import { CanDeactivateFn } from '@angular/router';
import {canDeactivate} from './canDeactivate';
import {Observable} from 'rxjs';


export const unsavedChangesGuard: CanDeactivateFn<canDeactivate> = (component) => {
  const canDeactivateResult = component.canDeactivate()
  if(typeof canDeactivateResult==='boolean'){
    return canDeactivateResult
  }else{
    return canDeactivateResult as Observable<boolean>
  }
};
