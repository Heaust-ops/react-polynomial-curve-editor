/**
 * An Interpolator that always moves towards
 * the next value at a user defined speed
 */
export class Interpolator {
  protected value: number;
  protected nextValue: number;
  protected startTime: number;
  speed: number;
  constructor(init: number) {
    this.value = init;
    this.nextValue = init;
    this.startTime = Date.now();
    this.speed = 0.0001;
  }

  public set speedFactor(factor: number) {
    this.speed = 0.0001 * factor;
  }

  public set next(nextValue: number) {
    this.value = this.current;
    this.startTime = Date.now();
    this.nextValue = nextValue;
  }

  public get current() {
    const distance = this.nextValue - this.value;
    const val =
      this.value + distance * (Date.now() - this.startTime) * this.speed;
    const valDistance = val - this.value;
    return Math.abs(distance) > Math.abs(valDistance) ? val : this.nextValue;
  }
}
