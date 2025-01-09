import { Observable } from 'rxjs';

export interface CanDeactivate {
  CanDeactivate: () => Observable<Boolean>;
}
