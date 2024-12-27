import {Observable} from 'rxjs';

export interface canDeactivate{
  canDeactivate:()=> boolean | Observable<Boolean>
}
