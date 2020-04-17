/* tslint:disable:no-bitwise */

/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

export class Timsort {

  /**
   * Default minimum size of a run.
   */
  private static DEFAULT_MIN_MERGE = 32;

  /**
   * Minimum ordered subsequece required to do galloping.
   */
  private static DEFAULT_MIN_GALLOPING = 7;

  /**
   * Default tmp storage length. Can increase depending on the size of the
   * smallest run to merge.
   */
  private static DEFAULT_TMP_STORAGE_LENGTH = 256;

  /**
   * Pre-computed powers of 10 for efficient lexicographic comparison of
   * small integers.
   */
  private static POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

  private readonly array = null;
  private readonly compare = null;
  private minGallop = Timsort.DEFAULT_MIN_GALLOPING;
  private readonly length = 0;
  private readonly tmpStorageLength = Timsort.DEFAULT_TMP_STORAGE_LENGTH;
  private readonly stackLength: number = 0;
  private readonly runStart = null;
  private readonly runLength = null;
  private stackSize = 0;
  private readonly tmp: any;

  constructor(array, compare) {
    this.array = array;
    this.compare = compare;
    this.length = array.length;
    if (this.length < 2 * Timsort.DEFAULT_TMP_STORAGE_LENGTH) {
      this.tmpStorageLength = this.length >>> 1;
    }
    this.tmp = new Array(this.tmpStorageLength);
    this.stackLength = (this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40);
    this.runStart = new Array(this.stackLength);
    this.runLength = new Array(this.stackLength);
  }

  private static log10(x) {
    if (x < 1e5) {
      if (x < 1e2) {
        return x < 1e1 ? 0 : 1;
      }
      if (x < 1e4) {
        return x < 1e3 ? 2 : 3;
      }
      return 4;
    }
    if (x < 1e7) {
      return x < 1e6 ? 5 : 6;
    }
    if (x < 1e9) {
      return x < 1e8 ? 7 : 8;
    }
    return 9;
  }

  private static minRunLength(n) {
    let r = 0;
    while (n >= Timsort.DEFAULT_MIN_MERGE) {
      r |= (n & 1);
      n >>= 1;
    }
    return n + r;
  }

  private static makeAscendingRun(array, lo, hi, compare) {
    let runHi = lo + 1;
    if (runHi === hi) {
      return 1;
    }
    // Descending
    if (compare(array[runHi++], array[lo]) < 0) {
      while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
        runHi++;
      }
      Timsort.reverseRun(array, lo, runHi);
      // Ascending
    } else {
      while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
        runHi++;
      }
    }
    return runHi - lo;
  }

  private static reverseRun(array, lo, hi) {
    hi--;
    while (lo < hi) {
      const t = array[lo];
      array[lo++] = array[hi];
      array[hi--] = t;
    }
  }

  private static binaryInsertionSort(array, lo, hi, start, compare) {
    if (start === lo) {
      start++;
    }
    for (; start < hi; start++) {
      const pivot = array[start];
      // Ranges of the array where pivot belongs
      let left = lo;
      let right = start;
      while (left < right) {
        const mid = (left + right) >>> 1;
        if (compare(pivot, array[mid]) < 0) {
          right = mid;
        } else {
          left = mid + 1;
        }
      }
      let n = start - left;
      // Switch is just an optimization for small arrays
      switch (n) {
        case 3:
          array[left + 3] = array[left + 2];
        /* falls through */
        case 2:
          array[left + 2] = array[left + 1];
        /* falls through */
        case 1:
          array[left + 1] = array[left];
          break;
        default:
          while (n > 0) {
            array[left + n] = array[left + n - 1];
            n--;
          }
      }
      array[left] = pivot;
    }
  }

  private static gallopLeft(value, array, start, length, hint, compare) {
    let lastOffset = 0;
    let maxOffset;
    let offset = 1;
    if (compare(value, array[start + hint]) > 0) {
      maxOffset = length - hint;
      while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
      if (offset > maxOffset) {
        offset = maxOffset;
      }
      // Make offsets relative to start
      lastOffset += hint;
      offset += hint;
      // value <= array[start + hint]
    } else {
      maxOffset = hint + 1;
      while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
      if (offset > maxOffset) {
        offset = maxOffset;
      }
      // Make offsets relative to start
      const tmp = lastOffset;
      lastOffset = hint - offset;
      offset = hint - tmp;
    }
    lastOffset++;
    while (lastOffset < offset) {
      const m = lastOffset + ((offset - lastOffset) >>> 1);
      if (compare(value, array[start + m]) > 0) {
        lastOffset = m + 1;
      } else {
        offset = m;
      }
    }
    return offset;
  }

  private static gallopRight(value, array, start, length, hint, compare) {
    let lastOffset = 0;
    let maxOffset;
    let offset = 1;
    if (compare(value, array[start + hint]) < 0) {
      maxOffset = hint + 1;
      while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
      if (offset > maxOffset) {
        offset = maxOffset;
      }
      // Make offsets relative to start
      const tmp = lastOffset;
      lastOffset = hint - offset;
      offset = hint - tmp;
      // value >= array[start + hint]
    } else {
      maxOffset = length - hint;
      while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
      if (offset > maxOffset) {
        offset = maxOffset;
      }
      // Make offsets relative to start
      lastOffset += hint;
      offset += hint;
    }
    lastOffset++;
    while (lastOffset < offset) {
      const m = lastOffset + ((offset - lastOffset) >>> 1);
      if (compare(value, array[start + m]) < 0) {
        offset = m;
      } else {
        lastOffset = m + 1;
      }
    }
    return offset;
  }

  private static alphabeticalCompare(a, b) {
    if (a === b) {
      return 0;
    }
    if (~~a === a && ~~b === b) {
      if (a === 0 || b === 0) {
        return a < b ? -1 : 1;
      }
      if (a < 0 || b < 0) {
        if (b >= 0) {
          return -1;
        }
        if (a >= 0) {
          return 1;
        }
        a = -a;
        b = -b;
      }
      const al = Timsort.log10(a);
      const bl = Timsort.log10(b);
      let t = 0;
      if (al < bl) {
        a *= Timsort.POWERS_OF_TEN[bl - al - 1];
        b /= 10;
        t = -1;
      } else if (al > bl) {
        b *= Timsort.POWERS_OF_TEN[al - bl - 1];
        a /= 10;
        t = 1;
      }
      if (a === b) {
        return t;
      }
      return a < b ? -1 : 1;
    }
    const aStr = String(a);
    const bStr = String(b);
    if (aStr === bStr) {
      return 0;
    }
    return aStr < bStr ? -1 : 1;
  }

  public static sort(array: any[], compare?: (a: any, b: any) => number, lo?: number, hi?: number) {
    if (!Array.isArray(array)) {
      throw new TypeError('Can only sort arrays');
    }
    if (!compare) {
      compare = Timsort.alphabeticalCompare;
    } else if (typeof compare !== 'function') {
      hi = lo;
      lo = compare;
      compare = Timsort.alphabeticalCompare;
    }
    if (!lo) {
      lo = 0;
    }
    if (!hi) {
      hi = array.length;
    }
    let remaining = hi - lo;
    // The array is already sorted
    if (remaining < 2) {
      return;
    }
    let runLength = 0;
    // On small arrays binary sort can be used directly
    if (remaining < Timsort.DEFAULT_MIN_MERGE) {
      runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
      Timsort.binaryInsertionSort(array, lo, hi, lo + runLength, compare);
      return;
    }
    const ts = new Timsort(array, compare);
    const minRun = Timsort.minRunLength(remaining);
    do {
      runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
      if (runLength < minRun) {
        let force = remaining;
        if (force > minRun) {
          force = minRun;
        }
        Timsort.binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
        runLength = force;
      }
      // Push new run and merge if necessary
      ts.pushRun(lo, runLength);
      ts.mergeRuns();
      // Go find next run
      remaining -= runLength;
      lo += runLength;
    } while (remaining !== 0);
    // Force merging of remaining runs
    ts.forceMergeRuns();
  }

  pushRun(runStart, runLength) {
    this.runStart[this.stackSize] = runStart;
    this.runLength[this.stackSize] = runLength;
    this.stackSize += 1;
  }

  mergeRuns() {
    while (this.stackSize > 1) {
      let n = this.stackSize - 2;
      if ((n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1])
        || (n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
        if (this.runLength[n - 1] < this.runLength[n + 1]) {
          n--;
        }
      } else if (this.runLength[n] > this.runLength[n + 1]) {
        break;
      }
      this.mergeAt(n);
    }
  }

  forceMergeRuns() {
    while (this.stackSize > 1) {
      let n = this.stackSize - 2;
      if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
        n--;
      }
      this.mergeAt(n);
    }
  }

  mergeAt(i) {
    const compare = this.compare;
    const array = this.array;
    let start1 = this.runStart[i];
    let length1 = this.runLength[i];
    const start2 = this.runStart[i + 1];
    let length2 = this.runLength[i + 1];
    this.runLength[i] = length1 + length2;
    if (i === this.stackSize - 3) {
      this.runStart[i + 1] = this.runStart[i + 2];
      this.runLength[i + 1] = this.runLength[i + 2];
    }
    this.stackSize--;
    const k = Timsort.gallopRight(array[start2], array, start1, length1, 0, compare);
    start1 += k;
    length1 -= k;
    if (length1 === 0) {
      return;
    }
    length2 = Timsort.gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
    if (length2 === 0) {
      return;
    }
    if (length1 <= length2) {
      this.mergeLow(start1, length1, start2, length2);

    } else {
      this.mergeHigh(start1, length1, start2, length2);
    }
  }

  mergeLow(start1, length1, start2, length2) {
    const compare = this.compare;
    const array = this.array;
    const tmp = this.tmp;
    let i;
    for (i = 0; i < length1; i++) {
      tmp[i] = array[start1 + i];
    }
    let cursor1 = 0;
    let cursor2 = start2;
    let dest = start1;
    array[dest++] = array[cursor2++];
    if (--length2 === 0) {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
      return;
    }
    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }
      array[dest + length2] = tmp[cursor1];
      return;
    }
    let minGallop = this.minGallop;
    while (true) {
      let count1 = 0;
      let count2 = 0;
      let exit = false;
      do {
        if (compare(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;
          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;
          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);
      if (exit) {
        break;
      }
      do {
        count1 = Timsort.gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
        if (count1 !== 0) {
          for (i = 0; i < count1; i++) {
            array[dest + i] = tmp[cursor1 + i];
          }
          dest += count1;
          cursor1 += count1;
          length1 -= count1;
          if (length1 <= 1) {
            exit = true;
            break;
          }
        }
        array[dest++] = array[cursor2++];
        if (--length2 === 0) {
          exit = true;
          break;
        }
        count2 = Timsort.gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
        if (count2 !== 0) {
          for (i = 0; i < count2; i++) {
            array[dest + i] = array[cursor2 + i];
          }
          dest += count2;
          cursor2 += count2;
          length2 -= count2;
          if (length2 === 0) {
            exit = true;
            break;
          }
        }
        array[dest++] = tmp[cursor1++];
        if (--length1 === 1) {
          exit = true;
          break;
        }
        minGallop--;
      } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
      if (exit) {
        break;
      }
      if (minGallop < 0) {
        minGallop = 0;
      }
      minGallop += 2;
    }
    this.minGallop = minGallop;
    if (minGallop < 1) {
      this.minGallop = 1;
    }
    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }
      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error('mergeLow preconditions were not respected');
    } else {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
    }
  }

  mergeHigh(start1, length1, start2, length2) {
    const compare = this.compare;
    const array = this.array;
    const tmp = this.tmp;
    let i;
    for (i = 0; i < length2; i++) {
      tmp[i] = array[start2 + i];
    }
    let cursor1 = start1 + length1 - 1;
    let cursor2 = length2 - 1;
    let dest = start2 + length2 - 1;
    let customCursor = 0;
    let customDest = 0;
    array[dest--] = array[cursor1--];
    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);
      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
      return;
    }
    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;
      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }
      array[dest] = tmp[cursor2];
      return;
    }
    let minGallop = this.minGallop;
    while (true) {
      let count1 = 0;
      let count2 = 0;
      let exit = false;
      do {
        if (compare(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;
          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;
          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);
      if (exit) {
        break;
      }
      do {
        count1 = length1 - Timsort.gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;
          for (i = count1 - 1; i >= 0; i--) {
            array[customDest + i] = array[customCursor + i];
          }
          if (length1 === 0) {
            exit = true;
            break;
          }
        }
        array[dest--] = tmp[cursor2--];
        if (--length2 === 1) {
          exit = true;
          break;
        }
        count2 = length2 - Timsort.gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;
          for (i = 0; i < count2; i++) {
            array[customDest + i] = tmp[customCursor + i];
          }
          if (length2 <= 1) {
            exit = true;
            break;
          }
        }
        array[dest--] = array[cursor1--];
        if (--length1 === 0) {
          exit = true;
          break;
        }
        minGallop--;
      } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
      if (exit) {
        break;
      }
      if (minGallop < 0) {
        minGallop = 0;
      }
      minGallop += 2;
    }
    this.minGallop = minGallop;
    if (minGallop < 1) {
      this.minGallop = 1;
    }
    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;
      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }
      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error('mergeHigh preconditions were not respected');
    } else {
      customCursor = dest - (length2 - 1);
      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
    }
  }
}
