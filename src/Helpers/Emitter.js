import { Subject } from 'rxjs';

// ref: https://xgrommx.github.io/rx-book/content/how_do_i/simple_event_emitter.html
const hasOwnProp = {}.hasOwnProperty;

function createName(name) {
  return `$ ${name}`;
}

class Emitter {
  constructor() {
    this.subjects = {};
  }

  emit(name, data) {
    const fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    this.subjects[fnName].next(data);
  }

  subscribe(name, handler) {
    const fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    return this.subjects[fnName].subscribe(handler);
  }

  unsubscribe() {
    const subjects = this.subjects;
    for (const prop in subjects) {
      if (hasOwnProp.call(subjects, prop)) {
        subjects[prop].unsubscribe();
      }
    }

    this.subjects = {};
  }
}

export default Emitter;
