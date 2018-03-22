import { combineEpics } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export default new BehaviorSubject(combineEpics());
