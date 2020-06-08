export class Watcher {
  constructor(onDone, parent) {
    this.onDone = onDone;
    this.child = {};
    this.parent = parent;
  }
  watch(key, onDone) {
    return (this.child[key] = new Watcher(onDone, this));
  }
  done() {
    this.isDone = true;
    if (this.onDone) this.onDone();
    if (this.parent && Object.values(this.parent.child).every((v) => v.isDone)) {
      this.parent.done();
    }
  }
}
export default Watcher;
