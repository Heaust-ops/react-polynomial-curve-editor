/**
 * Rounds off a number to a certain precision
 * @param num The number to round off
 * @param precision The decimal place to round off till
 * @returns rounded off number
 */
const roundToFixed = (num: number, precision: number) => {
  const prec = Math.pow(10, precision);
  return Math.round(num * prec) / prec;
};

/**
 * Uses Gaussian Elimination to figure out the
 * co-efficients of the polynomial corresponding
 * to the given Augmented matrix
 * @param aug Augmented Matrix
 * @returns The Co-eeficients of the polynomial, rounded
 * off tp 5 decimal places
 */
const gaussElim = (aug: number[][]) => {
  const n = aug.length;
  const k = aug.map((el) => [0, ...el]);
  const a = [[], ...k];
  let x = new Array(n).fill(0) as number[];
  for (let i = 1; i <= n - 1; i++) {
    if (a[i][i] === 0.0) {
      return;
    }
    for (let j = i + 1; j <= n; j++) {
      const ratio = a[j][i] / a[i][i];

      for (let k = 1; k <= n + 1; k++) {
        a[j][k] = a[j][k] - ratio * a[i][k];
      }
    }
  }
  x[n] = a[n][n + 1] / a[n][n];

  for (let i = n - 1; i >= 1; i--) {
    x[i] = a[i][n + 1];
    for (let j = i + 1; j <= n; j++) {
      x[i] = x[i] - a[i][j] * x[j];
    }
    x[i] = x[i] / a[i][i];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, ...res] = x;
  return res.map((el) => roundToFixed(el, 5));
};

/**
 * Formats a given string of points into
 * a proper array and number structure
 *
 * Example:
 * "1 2, 4 5, 78 12" -> [ [1, 2], [4, 5], [78, 12] ]
 *
 * @param ptString The points in string format
 * @returns An array of points
 */
export const parsePoints = (ptString: string): number[][] => {
  return ptString.split(",").map((el) =>
    el
      .split(" ")
      .filter((i) => i)
      .map((k) => +k)
  );
};

/**
 * Given some points that the polynomial passes through,
 * this return the co-efficients of the equation of the curve
 *
 * @param points The points that the polynomial passes through
 * @param scale Value to scale up the points by
 * @returns Co-efficients of the polynomial that describes
 * the curve passing through those points
 */
export const polyEq = (points: number[][], scale = 1) => {
  const pts = points.map((el) => el.map((k) => k * scale));
  let degree = pts.length;
  const A = [] as number[][];
  let begin = null as null | number[];
  for (const point of pts) {
    const tmp = [] as number[];
    while (degree) {
      tmp.push(Math.pow(point[0], degree - 1));
      degree--;
    }
    degree = pts.length;
    tmp.push(point[1]);
    if (point[0] === 0) {
      begin = tmp;
      continue;
    }
    A.push(tmp);
  }

  if (begin) A.push(begin);

  let res = gaussElim(A);
  if (!res) return res;
  res = res.reverse();
  while (res.length > 0 && res[res.length - 1] === 0) res.pop();
  return res.reverse();
};

/**
 * Given the co-effients of a polynomial,
 * this returns the function itself,
 *
 * Example:
 * given [2, 0, 0]
 * this will return the function (x) => (2\*x\*x)
 *
 * @param coEffs The co-efficients of the polynomial
 * @returns The Polynomial function
 */
export const getPolyFunction = (coEffs: number[]) => (x: number) => {
  let degree = coEffs.length;
  let sum = 0;
  while (degree > 0) {
    sum += Math.pow(x, degree - 1) * coEffs[coEffs.length - degree];
    degree--;
  }
  return sum;
};
