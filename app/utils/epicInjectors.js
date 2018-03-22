import epic$ from '../epics';

export function injectEpicFactory(store) {
  return function injectEpic(key, epic) {
    if (Reflect.has(store.injectedEpics, key) && store.injectedEpics[key] === epic) return;

    store.injectedEpics[key] = epic; // eslint-disable-line no-param-reassign
    epic$.next(epic);
  };
}

export default function getInjectors(store) {
  return {
    injectEpic: injectEpicFactory(store),
  };
}
