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
    constructor(array, compare) {
        this.array = null;
        this.compare = null;
        this.minGallop = Timsort.DEFAULT_MIN_GALLOPING;
        this.length = 0;
        this.tmpStorageLength = Timsort.DEFAULT_TMP_STORAGE_LENGTH;
        this.stackLength = 0;
        this.runStart = null;
        this.runLength = null;
        this.stackSize = 0;
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
    static log10(x) {
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
    static minRunLength(n) {
        let r = 0;
        while (n >= Timsort.DEFAULT_MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    }
    static makeAscendingRun(array, lo, hi, compare) {
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
        }
        else {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
                runHi++;
            }
        }
        return runHi - lo;
    }
    static reverseRun(array, lo, hi) {
        hi--;
        while (lo < hi) {
            const t = array[lo];
            array[lo++] = array[hi];
            array[hi--] = t;
        }
    }
    static binaryInsertionSort(array, lo, hi, start, compare) {
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
                }
                else {
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
    static gallopLeft(value, array, start, length, hint, compare) {
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
        }
        else {
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
            }
            else {
                offset = m;
            }
        }
        return offset;
    }
    static gallopRight(value, array, start, length, hint, compare) {
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
        }
        else {
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
            }
            else {
                lastOffset = m + 1;
            }
        }
        return offset;
    }
    static alphabeticalCompare(a, b) {
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
            }
            else if (al > bl) {
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
    static sort(array, compare, lo, hi) {
        if (!Array.isArray(array)) {
            throw new TypeError('Can only sort arrays');
        }
        if (!compare) {
            compare = Timsort.alphabeticalCompare;
        }
        else if (typeof compare !== 'function') {
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
            }
            else if (this.runLength[n] > this.runLength[n + 1]) {
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
        }
        else {
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
                }
                else {
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
        }
        else if (length1 === 0) {
            throw new Error('mergeLow preconditions were not respected');
        }
        else {
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
                }
                else {
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
        }
        else if (length2 === 0) {
            throw new Error('mergeHigh preconditions were not respected');
        }
        else {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
        }
    }
}
/**
 * Default minimum size of a run.
 */
Timsort.DEFAULT_MIN_MERGE = 32;
/**
 * Minimum ordered subsequece required to do galloping.
 */
Timsort.DEFAULT_MIN_GALLOPING = 7;
/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
Timsort.DEFAULT_TMP_STORAGE_LENGTH = 256;
/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */
Timsort.POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltc29ydC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvdXRpbHMvdGltc29ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0I7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsTUFBTSxPQUFPLE9BQU87SUFtQ2xCLFlBQVksS0FBSyxFQUFFLE9BQU87UUFYVCxVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsWUFBTyxHQUFHLElBQUksQ0FBQztRQUN4QixjQUFTLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO1FBQ2pDLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxxQkFBZ0IsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUM7UUFDdEQsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQzFCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFJcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixFQUFFO1lBQ3hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUMzQztRQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMs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Qzs7R0FFRztBQUNZLDZCQUFxQixHQUFHLENBQUMsQ0FBQztBQUV6Qzs7O0dBR0c7QUFDWSxrQ0FBMEIsR0FBRyxHQUFHLENBQUM7QUFFaEQ7OztHQUdHO0FBQ1kscUJBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuXG4vKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmV4cG9ydCBjbGFzcyBUaW1zb3J0IHtcblxuICAvKipcbiAgICogRGVmYXVsdCBtaW5pbXVtIHNpemUgb2YgYSBydW4uXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBERUZBVUxUX01JTl9NRVJHRSA9IDMyO1xuXG4gIC8qKlxuICAgKiBNaW5pbXVtIG9yZGVyZWQgc3Vic2VxdWVjZSByZXF1aXJlZCB0byBkbyBnYWxsb3BpbmcuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBERUZBVUxUX01JTl9HQUxMT1BJTkcgPSA3O1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRtcCBzdG9yYWdlIGxlbmd0aC4gQ2FuIGluY3JlYXNlIGRlcGVuZGluZyBvbiB0aGUgc2l6ZSBvZiB0aGVcbiAgICogc21hbGxlc3QgcnVuIHRvIG1lcmdlLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9UTVBfU1RPUkFHRV9MRU5HVEggPSAyNTY7XG5cbiAgLyoqXG4gICAqIFByZS1jb21wdXRlZCBwb3dlcnMgb2YgMTAgZm9yIGVmZmljaWVudCBsZXhpY29ncmFwaGljIGNvbXBhcmlzb24gb2ZcbiAgICogc21hbGwgaW50ZWdlcnMuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBQT1dFUlNfT0ZfVEVOID0gWzFlMCwgMWUxLCAxZTIsIDFlMywgMWU0LCAxZTUsIDFlNiwgMWU3LCAxZTgsIDFlOV07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhcnJheSA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29tcGFyZSA9IG51bGw7XG4gIHByaXZhdGUgbWluR2FsbG9wID0gVGltc29ydC5ERUZBVUxUX01JTl9HQUxMT1BJTkc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGVuZ3RoID0gMDtcbiAgcHJpdmF0ZSByZWFkb25seSB0bXBTdG9yYWdlTGVuZ3RoID0gVGltc29ydC5ERUZBVUxUX1RNUF9TVE9SQUdFX0xFTkdUSDtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGFja0xlbmd0aDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSByZWFkb25seSBydW5TdGFydCA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgcnVuTGVuZ3RoID0gbnVsbDtcbiAgcHJpdmF0ZSBzdGFja1NpemUgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IHRtcDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGFycmF5LCBjb21wYXJlKSB7XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xuICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmU7XG4gICAgdGhpcy5sZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKHRoaXMubGVuZ3RoIDwgMiAqIFRpbXNvcnQuREVGQVVMVF9UTVBfU1RPUkFHRV9MRU5HVEgpIHtcbiAgICAgIHRoaXMudG1wU3RvcmFnZUxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAxO1xuICAgIH1cbiAgICB0aGlzLnRtcCA9IG5ldyBBcnJheSh0aGlzLnRtcFN0b3JhZ2VMZW5ndGgpO1xuICAgIHRoaXMuc3RhY2tMZW5ndGggPSAodGhpcy5sZW5ndGggPCAxMjAgPyA1IDogdGhpcy5sZW5ndGggPCAxNTQyID8gMTAgOiB0aGlzLmxlbmd0aCA8IDExOTE1MSA/IDE5IDogNDApO1xuICAgIHRoaXMucnVuU3RhcnQgPSBuZXcgQXJyYXkodGhpcy5zdGFja0xlbmd0aCk7XG4gICAgdGhpcy5ydW5MZW5ndGggPSBuZXcgQXJyYXkodGhpcy5zdGFja0xlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBsb2cxMCh4KSB7XG4gICAgaWYgKHggPCAxZTUpIHtcbiAgICAgIGlmICh4IDwgMWUyKSB7XG4gICAgICAgIHJldHVybiB4IDwgMWUxID8gMCA6IDE7XG4gICAgICB9XG4gICAgICBpZiAoeCA8IDFlNCkge1xuICAgICAgICByZXR1cm4geCA8IDFlMyA/IDIgOiAzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDQ7XG4gICAgfVxuICAgIGlmICh4IDwgMWU3KSB7XG4gICAgICByZXR1cm4geCA8IDFlNiA/IDUgOiA2O1xuICAgIH1cbiAgICBpZiAoeCA8IDFlOSkge1xuICAgICAgcmV0dXJuIHggPCAxZTggPyA3IDogODtcbiAgICB9XG4gICAgcmV0dXJuIDk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBtaW5SdW5MZW5ndGgobikge1xuICAgIGxldCByID0gMDtcbiAgICB3aGlsZSAobiA+PSBUaW1zb3J0LkRFRkFVTFRfTUlOX01FUkdFKSB7XG4gICAgICByIHw9IChuICYgMSk7XG4gICAgICBuID4+PSAxO1xuICAgIH1cbiAgICByZXR1cm4gbiArIHI7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBtYWtlQXNjZW5kaW5nUnVuKGFycmF5LCBsbywgaGksIGNvbXBhcmUpIHtcbiAgICBsZXQgcnVuSGkgPSBsbyArIDE7XG4gICAgaWYgKHJ1bkhpID09PSBoaSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8vIERlc2NlbmRpbmdcbiAgICBpZiAoY29tcGFyZShhcnJheVtydW5IaSsrXSwgYXJyYXlbbG9dKSA8IDApIHtcbiAgICAgIHdoaWxlIChydW5IaSA8IGhpICYmIGNvbXBhcmUoYXJyYXlbcnVuSGldLCBhcnJheVtydW5IaSAtIDFdKSA8IDApIHtcbiAgICAgICAgcnVuSGkrKztcbiAgICAgIH1cbiAgICAgIFRpbXNvcnQucmV2ZXJzZVJ1bihhcnJheSwgbG8sIHJ1bkhpKTtcbiAgICAgIC8vIEFzY2VuZGluZ1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocnVuSGkgPCBoaSAmJiBjb21wYXJlKGFycmF5W3J1bkhpXSwgYXJyYXlbcnVuSGkgLSAxXSkgPj0gMCkge1xuICAgICAgICBydW5IaSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnVuSGkgLSBsbztcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHJldmVyc2VSdW4oYXJyYXksIGxvLCBoaSkge1xuICAgIGhpLS07XG4gICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgIGNvbnN0IHQgPSBhcnJheVtsb107XG4gICAgICBhcnJheVtsbysrXSA9IGFycmF5W2hpXTtcbiAgICAgIGFycmF5W2hpLS1dID0gdDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBiaW5hcnlJbnNlcnRpb25Tb3J0KGFycmF5LCBsbywgaGksIHN0YXJ0LCBjb21wYXJlKSB7XG4gICAgaWYgKHN0YXJ0ID09PSBsbykge1xuICAgICAgc3RhcnQrKztcbiAgICB9XG4gICAgZm9yICg7IHN0YXJ0IDwgaGk7IHN0YXJ0KyspIHtcbiAgICAgIGNvbnN0IHBpdm90ID0gYXJyYXlbc3RhcnRdO1xuICAgICAgLy8gUmFuZ2VzIG9mIHRoZSBhcnJheSB3aGVyZSBwaXZvdCBiZWxvbmdzXG4gICAgICBsZXQgbGVmdCA9IGxvO1xuICAgICAgbGV0IHJpZ2h0ID0gc3RhcnQ7XG4gICAgICB3aGlsZSAobGVmdCA8IHJpZ2h0KSB7XG4gICAgICAgIGNvbnN0IG1pZCA9IChsZWZ0ICsgcmlnaHQpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZShwaXZvdCwgYXJyYXlbbWlkXSkgPCAwKSB7XG4gICAgICAgICAgcmlnaHQgPSBtaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVmdCA9IG1pZCArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBuID0gc3RhcnQgLSBsZWZ0O1xuICAgICAgLy8gU3dpdGNoIGlzIGp1c3QgYW4gb3B0aW1pemF0aW9uIGZvciBzbWFsbCBhcnJheXNcbiAgICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgYXJyYXlbbGVmdCArIDNdID0gYXJyYXlbbGVmdCArIDJdO1xuICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBhcnJheVtsZWZ0ICsgMl0gPSBhcnJheVtsZWZ0ICsgMV07XG4gICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGFycmF5W2xlZnQgKyAxXSA9IGFycmF5W2xlZnRdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHdoaWxlIChuID4gMCkge1xuICAgICAgICAgICAgYXJyYXlbbGVmdCArIG5dID0gYXJyYXlbbGVmdCArIG4gLSAxXTtcbiAgICAgICAgICAgIG4tLTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcnJheVtsZWZ0XSA9IHBpdm90O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdhbGxvcExlZnQodmFsdWUsIGFycmF5LCBzdGFydCwgbGVuZ3RoLCBoaW50LCBjb21wYXJlKSB7XG4gICAgbGV0IGxhc3RPZmZzZXQgPSAwO1xuICAgIGxldCBtYXhPZmZzZXQ7XG4gICAgbGV0IG9mZnNldCA9IDE7XG4gICAgaWYgKGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludF0pID4gMCkge1xuICAgICAgbWF4T2Zmc2V0ID0gbGVuZ3RoIC0gaGludDtcbiAgICAgIHdoaWxlIChvZmZzZXQgPCBtYXhPZmZzZXQgJiYgY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBoaW50ICsgb2Zmc2V0XSkgPiAwKSB7XG4gICAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuICAgICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXQgPiBtYXhPZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgICBsYXN0T2Zmc2V0ICs9IGhpbnQ7XG4gICAgICBvZmZzZXQgKz0gaGludDtcbiAgICAgIC8vIHZhbHVlIDw9IGFycmF5W3N0YXJ0ICsgaGludF1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4T2Zmc2V0ID0gaGludCArIDE7XG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbWF4T2Zmc2V0ICYmIGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludCAtIG9mZnNldF0pIDw9IDApIHtcbiAgICAgICAgbGFzdE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgb2Zmc2V0ID0gKG9mZnNldCA8PCAxKSArIDE7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMCkge1xuICAgICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9mZnNldCA+IG1heE9mZnNldCkge1xuICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICB9XG4gICAgICAvLyBNYWtlIG9mZnNldHMgcmVsYXRpdmUgdG8gc3RhcnRcbiAgICAgIGNvbnN0IHRtcCA9IGxhc3RPZmZzZXQ7XG4gICAgICBsYXN0T2Zmc2V0ID0gaGludCAtIG9mZnNldDtcbiAgICAgIG9mZnNldCA9IGhpbnQgLSB0bXA7XG4gICAgfVxuICAgIGxhc3RPZmZzZXQrKztcbiAgICB3aGlsZSAobGFzdE9mZnNldCA8IG9mZnNldCkge1xuICAgICAgY29uc3QgbSA9IGxhc3RPZmZzZXQgKyAoKG9mZnNldCAtIGxhc3RPZmZzZXQpID4+PiAxKTtcbiAgICAgIGlmIChjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIG1dKSA+IDApIHtcbiAgICAgICAgbGFzdE9mZnNldCA9IG0gKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0ID0gbTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdhbGxvcFJpZ2h0KHZhbHVlLCBhcnJheSwgc3RhcnQsIGxlbmd0aCwgaGludCwgY29tcGFyZSkge1xuICAgIGxldCBsYXN0T2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0O1xuICAgIGxldCBvZmZzZXQgPSAxO1xuICAgIGlmIChjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnRdKSA8IDApIHtcbiAgICAgIG1heE9mZnNldCA9IGhpbnQgKyAxO1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG1heE9mZnNldCAmJiBjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnQgLSBvZmZzZXRdKSA8IDApIHtcbiAgICAgICAgbGFzdE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgb2Zmc2V0ID0gKG9mZnNldCA8PCAxKSArIDE7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMCkge1xuICAgICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9mZnNldCA+IG1heE9mZnNldCkge1xuICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICB9XG4gICAgICAvLyBNYWtlIG9mZnNldHMgcmVsYXRpdmUgdG8gc3RhcnRcbiAgICAgIGNvbnN0IHRtcCA9IGxhc3RPZmZzZXQ7XG4gICAgICBsYXN0T2Zmc2V0ID0gaGludCAtIG9mZnNldDtcbiAgICAgIG9mZnNldCA9IGhpbnQgLSB0bXA7XG4gICAgICAvLyB2YWx1ZSA+PSBhcnJheVtzdGFydCArIGhpbnRdXG4gICAgfSBlbHNlIHtcbiAgICAgIG1heE9mZnNldCA9IGxlbmd0aCAtIGhpbnQ7XG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbWF4T2Zmc2V0ICYmIGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludCArIG9mZnNldF0pID49IDApIHtcbiAgICAgICAgbGFzdE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgb2Zmc2V0ID0gKG9mZnNldCA8PCAxKSArIDE7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMCkge1xuICAgICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9mZnNldCA+IG1heE9mZnNldCkge1xuICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICB9XG4gICAgICAvLyBNYWtlIG9mZnNldHMgcmVsYXRpdmUgdG8gc3RhcnRcbiAgICAgIGxhc3RPZmZzZXQgKz0gaGludDtcbiAgICAgIG9mZnNldCArPSBoaW50O1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0Kys7XG4gICAgd2hpbGUgKGxhc3RPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICAgIGNvbnN0IG0gPSBsYXN0T2Zmc2V0ICsgKChvZmZzZXQgLSBsYXN0T2Zmc2V0KSA+Pj4gMSk7XG4gICAgICBpZiAoY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBtXSkgPCAwKSB7XG4gICAgICAgIG9mZnNldCA9IG07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0T2Zmc2V0ID0gbSArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBhbHBoYWJldGljYWxDb21wYXJlKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmICh+fmEgPT09IGEgJiYgfn5iID09PSBiKSB7XG4gICAgICBpZiAoYSA9PT0gMCB8fCBiID09PSAwKSB7XG4gICAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbiAgICAgIH1cbiAgICAgIGlmIChhIDwgMCB8fCBiIDwgMCkge1xuICAgICAgICBpZiAoYiA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhID49IDApIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBhID0gLWE7XG4gICAgICAgIGIgPSAtYjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsID0gVGltc29ydC5sb2cxMChhKTtcbiAgICAgIGNvbnN0IGJsID0gVGltc29ydC5sb2cxMChiKTtcbiAgICAgIGxldCB0ID0gMDtcbiAgICAgIGlmIChhbCA8IGJsKSB7XG4gICAgICAgIGEgKj0gVGltc29ydC5QT1dFUlNfT0ZfVEVOW2JsIC0gYWwgLSAxXTtcbiAgICAgICAgYiAvPSAxMDtcbiAgICAgICAgdCA9IC0xO1xuICAgICAgfSBlbHNlIGlmIChhbCA+IGJsKSB7XG4gICAgICAgIGIgKj0gVGltc29ydC5QT1dFUlNfT0ZfVEVOW2FsIC0gYmwgLSAxXTtcbiAgICAgICAgYSAvPSAxMDtcbiAgICAgICAgdCA9IDE7XG4gICAgICB9XG4gICAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbiAgICB9XG4gICAgY29uc3QgYVN0ciA9IFN0cmluZyhhKTtcbiAgICBjb25zdCBiU3RyID0gU3RyaW5nKGIpO1xuICAgIGlmIChhU3RyID09PSBiU3RyKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIGFTdHIgPCBiU3RyID8gLTEgOiAxO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzb3J0KGFycmF5OiBhbnlbXSwgY29tcGFyZT86IChhOiBhbnksIGI6IGFueSkgPT4gbnVtYmVyLCBsbz86IG51bWJlciwgaGk/OiBudW1iZXIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW4gb25seSBzb3J0IGFycmF5cycpO1xuICAgIH1cbiAgICBpZiAoIWNvbXBhcmUpIHtcbiAgICAgIGNvbXBhcmUgPSBUaW1zb3J0LmFscGhhYmV0aWNhbENvbXBhcmU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaGkgPSBsbztcbiAgICAgIGxvID0gY29tcGFyZTtcbiAgICAgIGNvbXBhcmUgPSBUaW1zb3J0LmFscGhhYmV0aWNhbENvbXBhcmU7XG4gICAgfVxuICAgIGlmICghbG8pIHtcbiAgICAgIGxvID0gMDtcbiAgICB9XG4gICAgaWYgKCFoaSkge1xuICAgICAgaGkgPSBhcnJheS5sZW5ndGg7XG4gICAgfVxuICAgIGxldCByZW1haW5pbmcgPSBoaSAtIGxvO1xuICAgIC8vIFRoZSBhcnJheSBpcyBhbHJlYWR5IHNvcnRlZFxuICAgIGlmIChyZW1haW5pbmcgPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBydW5MZW5ndGggPSAwO1xuICAgIC8vIE9uIHNtYWxsIGFycmF5cyBiaW5hcnkgc29ydCBjYW4gYmUgdXNlZCBkaXJlY3RseVxuICAgIGlmIChyZW1haW5pbmcgPCBUaW1zb3J0LkRFRkFVTFRfTUlOX01FUkdFKSB7XG4gICAgICBydW5MZW5ndGggPSBUaW1zb3J0Lm1ha2VBc2NlbmRpbmdSdW4oYXJyYXksIGxvLCBoaSwgY29tcGFyZSk7XG4gICAgICBUaW1zb3J0LmJpbmFyeUluc2VydGlvblNvcnQoYXJyYXksIGxvLCBoaSwgbG8gKyBydW5MZW5ndGgsIGNvbXBhcmUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0cyA9IG5ldyBUaW1zb3J0KGFycmF5LCBjb21wYXJlKTtcbiAgICBjb25zdCBtaW5SdW4gPSBUaW1zb3J0Lm1pblJ1bkxlbmd0aChyZW1haW5pbmcpO1xuICAgIGRvIHtcbiAgICAgIHJ1bkxlbmd0aCA9IFRpbXNvcnQubWFrZUFzY2VuZGluZ1J1bihhcnJheSwgbG8sIGhpLCBjb21wYXJlKTtcbiAgICAgIGlmIChydW5MZW5ndGggPCBtaW5SdW4pIHtcbiAgICAgICAgbGV0IGZvcmNlID0gcmVtYWluaW5nO1xuICAgICAgICBpZiAoZm9yY2UgPiBtaW5SdW4pIHtcbiAgICAgICAgICBmb3JjZSA9IG1pblJ1bjtcbiAgICAgICAgfVxuICAgICAgICBUaW1zb3J0LmJpbmFyeUluc2VydGlvblNvcnQoYXJyYXksIGxvLCBsbyArIGZvcmNlLCBsbyArIHJ1bkxlbmd0aCwgY29tcGFyZSk7XG4gICAgICAgIHJ1bkxlbmd0aCA9IGZvcmNlO1xuICAgICAgfVxuICAgICAgLy8gUHVzaCBuZXcgcnVuIGFuZCBtZXJnZSBpZiBuZWNlc3NhcnlcbiAgICAgIHRzLnB1c2hSdW4obG8sIHJ1bkxlbmd0aCk7XG4gICAgICB0cy5tZXJnZVJ1bnMoKTtcbiAgICAgIC8vIEdvIGZpbmQgbmV4dCBydW5cbiAgICAgIHJlbWFpbmluZyAtPSBydW5MZW5ndGg7XG4gICAgICBsbyArPSBydW5MZW5ndGg7XG4gICAgfSB3aGlsZSAocmVtYWluaW5nICE9PSAwKTtcbiAgICAvLyBGb3JjZSBtZXJnaW5nIG9mIHJlbWFpbmluZyBydW5zXG4gICAgdHMuZm9yY2VNZXJnZVJ1bnMoKTtcbiAgfVxuXG4gIHB1c2hSdW4ocnVuU3RhcnQsIHJ1bkxlbmd0aCkge1xuICAgIHRoaXMucnVuU3RhcnRbdGhpcy5zdGFja1NpemVdID0gcnVuU3RhcnQ7XG4gICAgdGhpcy5ydW5MZW5ndGhbdGhpcy5zdGFja1NpemVdID0gcnVuTGVuZ3RoO1xuICAgIHRoaXMuc3RhY2tTaXplICs9IDE7XG4gIH1cblxuICBtZXJnZVJ1bnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuc3RhY2tTaXplID4gMSkge1xuICAgICAgbGV0IG4gPSB0aGlzLnN0YWNrU2l6ZSAtIDI7XG4gICAgICBpZiAoKG4gPj0gMSAmJiB0aGlzLnJ1bkxlbmd0aFtuIC0gMV0gPD0gdGhpcy5ydW5MZW5ndGhbbl0gKyB0aGlzLnJ1bkxlbmd0aFtuICsgMV0pXG4gICAgICAgIHx8IChuID49IDIgJiYgdGhpcy5ydW5MZW5ndGhbbiAtIDJdIDw9IHRoaXMucnVuTGVuZ3RoW25dICsgdGhpcy5ydW5MZW5ndGhbbiAtIDFdKSkge1xuICAgICAgICBpZiAodGhpcy5ydW5MZW5ndGhbbiAtIDFdIDwgdGhpcy5ydW5MZW5ndGhbbiArIDFdKSB7XG4gICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucnVuTGVuZ3RoW25dID4gdGhpcy5ydW5MZW5ndGhbbiArIDFdKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5tZXJnZUF0KG4pO1xuICAgIH1cbiAgfVxuXG4gIGZvcmNlTWVyZ2VSdW5zKCkge1xuICAgIHdoaWxlICh0aGlzLnN0YWNrU2l6ZSA+IDEpIHtcbiAgICAgIGxldCBuID0gdGhpcy5zdGFja1NpemUgLSAyO1xuICAgICAgaWYgKG4gPiAwICYmIHRoaXMucnVuTGVuZ3RoW24gLSAxXSA8IHRoaXMucnVuTGVuZ3RoW24gKyAxXSkge1xuICAgICAgICBuLS07XG4gICAgICB9XG4gICAgICB0aGlzLm1lcmdlQXQobik7XG4gICAgfVxuICB9XG5cbiAgbWVyZ2VBdChpKSB7XG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuY29tcGFyZTtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgbGV0IHN0YXJ0MSA9IHRoaXMucnVuU3RhcnRbaV07XG4gICAgbGV0IGxlbmd0aDEgPSB0aGlzLnJ1bkxlbmd0aFtpXTtcbiAgICBjb25zdCBzdGFydDIgPSB0aGlzLnJ1blN0YXJ0W2kgKyAxXTtcbiAgICBsZXQgbGVuZ3RoMiA9IHRoaXMucnVuTGVuZ3RoW2kgKyAxXTtcbiAgICB0aGlzLnJ1bkxlbmd0aFtpXSA9IGxlbmd0aDEgKyBsZW5ndGgyO1xuICAgIGlmIChpID09PSB0aGlzLnN0YWNrU2l6ZSAtIDMpIHtcbiAgICAgIHRoaXMucnVuU3RhcnRbaSArIDFdID0gdGhpcy5ydW5TdGFydFtpICsgMl07XG4gICAgICB0aGlzLnJ1bkxlbmd0aFtpICsgMV0gPSB0aGlzLnJ1bkxlbmd0aFtpICsgMl07XG4gICAgfVxuICAgIHRoaXMuc3RhY2tTaXplLS07XG4gICAgY29uc3QgayA9IFRpbXNvcnQuZ2FsbG9wUmlnaHQoYXJyYXlbc3RhcnQyXSwgYXJyYXksIHN0YXJ0MSwgbGVuZ3RoMSwgMCwgY29tcGFyZSk7XG4gICAgc3RhcnQxICs9IGs7XG4gICAgbGVuZ3RoMSAtPSBrO1xuICAgIGlmIChsZW5ndGgxID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxlbmd0aDIgPSBUaW1zb3J0LmdhbGxvcExlZnQoYXJyYXlbc3RhcnQxICsgbGVuZ3RoMSAtIDFdLCBhcnJheSwgc3RhcnQyLCBsZW5ndGgyLCBsZW5ndGgyIC0gMSwgY29tcGFyZSk7XG4gICAgaWYgKGxlbmd0aDIgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxlbmd0aDEgPD0gbGVuZ3RoMikge1xuICAgICAgdGhpcy5tZXJnZUxvdyhzdGFydDEsIGxlbmd0aDEsIHN0YXJ0MiwgbGVuZ3RoMik7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXJnZUhpZ2goc3RhcnQxLCBsZW5ndGgxLCBzdGFydDIsIGxlbmd0aDIpO1xuICAgIH1cbiAgfVxuXG4gIG1lcmdlTG93KHN0YXJ0MSwgbGVuZ3RoMSwgc3RhcnQyLCBsZW5ndGgyKSB7XG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuY29tcGFyZTtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgY29uc3QgdG1wID0gdGhpcy50bXA7XG4gICAgbGV0IGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDE7IGkrKykge1xuICAgICAgdG1wW2ldID0gYXJyYXlbc3RhcnQxICsgaV07XG4gICAgfVxuICAgIGxldCBjdXJzb3IxID0gMDtcbiAgICBsZXQgY3Vyc29yMiA9IHN0YXJ0MjtcbiAgICBsZXQgZGVzdCA9IHN0YXJ0MTtcbiAgICBhcnJheVtkZXN0KytdID0gYXJyYXlbY3Vyc29yMisrXTtcbiAgICBpZiAoLS1sZW5ndGgyID09PSAwKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMTsgaSsrKSB7XG4gICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IHRtcFtjdXJzb3IxICsgaV07XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsZW5ndGgxID09PSAxKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IGFycmF5W2N1cnNvcjIgKyBpXTtcbiAgICAgIH1cbiAgICAgIGFycmF5W2Rlc3QgKyBsZW5ndGgyXSA9IHRtcFtjdXJzb3IxXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG1pbkdhbGxvcCA9IHRoaXMubWluR2FsbG9wO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgY291bnQxID0gMDtcbiAgICAgIGxldCBjb3VudDIgPSAwO1xuICAgICAgbGV0IGV4aXQgPSBmYWxzZTtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGNvbXBhcmUoYXJyYXlbY3Vyc29yMl0sIHRtcFtjdXJzb3IxXSkgPCAwKSB7XG4gICAgICAgICAgYXJyYXlbZGVzdCsrXSA9IGFycmF5W2N1cnNvcjIrK107XG4gICAgICAgICAgY291bnQyKys7XG4gICAgICAgICAgY291bnQxID0gMDtcbiAgICAgICAgICBpZiAoLS1sZW5ndGgyID09PSAwKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcnJheVtkZXN0KytdID0gdG1wW2N1cnNvcjErK107XG4gICAgICAgICAgY291bnQxKys7XG4gICAgICAgICAgY291bnQyID0gMDtcbiAgICAgICAgICBpZiAoLS1sZW5ndGgxID09PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoKGNvdW50MSB8IGNvdW50MikgPCBtaW5HYWxsb3ApO1xuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkbyB7XG4gICAgICAgIGNvdW50MSA9IFRpbXNvcnQuZ2FsbG9wUmlnaHQoYXJyYXlbY3Vyc29yMl0sIHRtcCwgY3Vyc29yMSwgbGVuZ3RoMSwgMCwgY29tcGFyZSk7XG4gICAgICAgIGlmIChjb3VudDEgIT09IDApIHtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQxOyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IHRtcFtjdXJzb3IxICsgaV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlc3QgKz0gY291bnQxO1xuICAgICAgICAgIGN1cnNvcjEgKz0gY291bnQxO1xuICAgICAgICAgIGxlbmd0aDEgLT0gY291bnQxO1xuICAgICAgICAgIGlmIChsZW5ndGgxIDw9IDEpIHtcbiAgICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFycmF5W2Rlc3QrK10gPSBhcnJheVtjdXJzb3IyKytdO1xuICAgICAgICBpZiAoLS1sZW5ndGgyID09PSAwKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY291bnQyID0gVGltc29ydC5nYWxsb3BMZWZ0KHRtcFtjdXJzb3IxXSwgYXJyYXksIGN1cnNvcjIsIGxlbmd0aDIsIDAsIGNvbXBhcmUpO1xuICAgICAgICBpZiAoY291bnQyICE9PSAwKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50MjsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSBhcnJheVtjdXJzb3IyICsgaV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlc3QgKz0gY291bnQyO1xuICAgICAgICAgIGN1cnNvcjIgKz0gY291bnQyO1xuICAgICAgICAgIGxlbmd0aDIgLT0gY291bnQyO1xuICAgICAgICAgIGlmIChsZW5ndGgyID09PSAwKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcnJheVtkZXN0KytdID0gdG1wW2N1cnNvcjErK107XG4gICAgICAgIGlmICgtLWxlbmd0aDEgPT09IDEpIHtcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtaW5HYWxsb3AtLTtcbiAgICAgIH0gd2hpbGUgKGNvdW50MSA+PSBUaW1zb3J0LkRFRkFVTFRfTUlOX0dBTExPUElORyB8fCBjb3VudDIgPj0gVGltc29ydC5ERUZBVUxUX01JTl9HQUxMT1BJTkcpO1xuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobWluR2FsbG9wIDwgMCkge1xuICAgICAgICBtaW5HYWxsb3AgPSAwO1xuICAgICAgfVxuICAgICAgbWluR2FsbG9wICs9IDI7XG4gICAgfVxuICAgIHRoaXMubWluR2FsbG9wID0gbWluR2FsbG9wO1xuICAgIGlmIChtaW5HYWxsb3AgPCAxKSB7XG4gICAgICB0aGlzLm1pbkdhbGxvcCA9IDE7XG4gICAgfVxuICAgIGlmIChsZW5ndGgxID09PSAxKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IGFycmF5W2N1cnNvcjIgKyBpXTtcbiAgICAgIH1cbiAgICAgIGFycmF5W2Rlc3QgKyBsZW5ndGgyXSA9IHRtcFtjdXJzb3IxXTtcbiAgICB9IGVsc2UgaWYgKGxlbmd0aDEgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWVyZ2VMb3cgcHJlY29uZGl0aW9ucyB3ZXJlIG5vdCByZXNwZWN0ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDE7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSB0bXBbY3Vyc29yMSArIGldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1lcmdlSGlnaChzdGFydDEsIGxlbmd0aDEsIHN0YXJ0MiwgbGVuZ3RoMikge1xuICAgIGNvbnN0IGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIGNvbnN0IHRtcCA9IHRoaXMudG1wO1xuICAgIGxldCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgyOyBpKyspIHtcbiAgICAgIHRtcFtpXSA9IGFycmF5W3N0YXJ0MiArIGldO1xuICAgIH1cbiAgICBsZXQgY3Vyc29yMSA9IHN0YXJ0MSArIGxlbmd0aDEgLSAxO1xuICAgIGxldCBjdXJzb3IyID0gbGVuZ3RoMiAtIDE7XG4gICAgbGV0IGRlc3QgPSBzdGFydDIgKyBsZW5ndGgyIC0gMTtcbiAgICBsZXQgY3VzdG9tQ3Vyc29yID0gMDtcbiAgICBsZXQgY3VzdG9tRGVzdCA9IDA7XG4gICAgYXJyYXlbZGVzdC0tXSA9IGFycmF5W2N1cnNvcjEtLV07XG4gICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgY3VzdG9tQ3Vyc29yID0gZGVzdCAtIChsZW5ndGgyIC0gMSk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICAgIGFycmF5W2N1c3RvbUN1cnNvciArIGldID0gdG1wW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoMiA9PT0gMSkge1xuICAgICAgZGVzdCAtPSBsZW5ndGgxO1xuICAgICAgY3Vyc29yMSAtPSBsZW5ndGgxO1xuICAgICAgY3VzdG9tRGVzdCA9IGRlc3QgKyAxO1xuICAgICAgY3VzdG9tQ3Vyc29yID0gY3Vyc29yMSArIDE7XG4gICAgICBmb3IgKGkgPSBsZW5ndGgxIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJyYXlbY3VzdG9tRGVzdCArIGldID0gYXJyYXlbY3VzdG9tQ3Vyc29yICsgaV07XG4gICAgICB9XG4gICAgICBhcnJheVtkZXN0XSA9IHRtcFtjdXJzb3IyXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG1pbkdhbGxvcCA9IHRoaXMubWluR2FsbG9wO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgY291bnQxID0gMDtcbiAgICAgIGxldCBjb3VudDIgPSAwO1xuICAgICAgbGV0IGV4aXQgPSBmYWxzZTtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGNvbXBhcmUodG1wW2N1cnNvcjJdLCBhcnJheVtjdXJzb3IxXSkgPCAwKSB7XG4gICAgICAgICAgYXJyYXlbZGVzdC0tXSA9IGFycmF5W2N1cnNvcjEtLV07XG4gICAgICAgICAgY291bnQxKys7XG4gICAgICAgICAgY291bnQyID0gMDtcbiAgICAgICAgICBpZiAoLS1sZW5ndGgxID09PSAwKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcnJheVtkZXN0LS1dID0gdG1wW2N1cnNvcjItLV07XG4gICAgICAgICAgY291bnQyKys7XG4gICAgICAgICAgY291bnQxID0gMDtcbiAgICAgICAgICBpZiAoLS1sZW5ndGgyID09PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoKGNvdW50MSB8IGNvdW50MikgPCBtaW5HYWxsb3ApO1xuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkbyB7XG4gICAgICAgIGNvdW50MSA9IGxlbmd0aDEgLSBUaW1zb3J0LmdhbGxvcFJpZ2h0KHRtcFtjdXJzb3IyXSwgYXJyYXksIHN0YXJ0MSwgbGVuZ3RoMSwgbGVuZ3RoMSAtIDEsIGNvbXBhcmUpO1xuICAgICAgICBpZiAoY291bnQxICE9PSAwKSB7XG4gICAgICAgICAgZGVzdCAtPSBjb3VudDE7XG4gICAgICAgICAgY3Vyc29yMSAtPSBjb3VudDE7XG4gICAgICAgICAgbGVuZ3RoMSAtPSBjb3VudDE7XG4gICAgICAgICAgY3VzdG9tRGVzdCA9IGRlc3QgKyAxO1xuICAgICAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjEgKyAxO1xuICAgICAgICAgIGZvciAoaSA9IGNvdW50MSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBhcnJheVtjdXN0b21EZXN0ICsgaV0gPSBhcnJheVtjdXN0b21DdXJzb3IgKyBpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxlbmd0aDEgPT09IDApIHtcbiAgICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFycmF5W2Rlc3QtLV0gPSB0bXBbY3Vyc29yMi0tXTtcbiAgICAgICAgaWYgKC0tbGVuZ3RoMiA9PT0gMSkge1xuICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50MiA9IGxlbmd0aDIgLSBUaW1zb3J0LmdhbGxvcExlZnQoYXJyYXlbY3Vyc29yMV0sIHRtcCwgMCwgbGVuZ3RoMiwgbGVuZ3RoMiAtIDEsIGNvbXBhcmUpO1xuICAgICAgICBpZiAoY291bnQyICE9PSAwKSB7XG4gICAgICAgICAgZGVzdCAtPSBjb3VudDI7XG4gICAgICAgICAgY3Vyc29yMiAtPSBjb3VudDI7XG4gICAgICAgICAgbGVuZ3RoMiAtPSBjb3VudDI7XG4gICAgICAgICAgY3VzdG9tRGVzdCA9IGRlc3QgKyAxO1xuICAgICAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjIgKyAxO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDI7IGkrKykge1xuICAgICAgICAgICAgYXJyYXlbY3VzdG9tRGVzdCArIGldID0gdG1wW2N1c3RvbUN1cnNvciArIGldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobGVuZ3RoMiA8PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcnJheVtkZXN0LS1dID0gYXJyYXlbY3Vyc29yMS0tXTtcbiAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG1pbkdhbGxvcC0tO1xuICAgICAgfSB3aGlsZSAoY291bnQxID49IFRpbXNvcnQuREVGQVVMVF9NSU5fR0FMTE9QSU5HIHx8IGNvdW50MiA+PSBUaW1zb3J0LkRFRkFVTFRfTUlOX0dBTExPUElORyk7XG4gICAgICBpZiAoZXhpdCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtaW5HYWxsb3AgPCAwKSB7XG4gICAgICAgIG1pbkdhbGxvcCA9IDA7XG4gICAgICB9XG4gICAgICBtaW5HYWxsb3AgKz0gMjtcbiAgICB9XG4gICAgdGhpcy5taW5HYWxsb3AgPSBtaW5HYWxsb3A7XG4gICAgaWYgKG1pbkdhbGxvcCA8IDEpIHtcbiAgICAgIHRoaXMubWluR2FsbG9wID0gMTtcbiAgICB9XG4gICAgaWYgKGxlbmd0aDIgPT09IDEpIHtcbiAgICAgIGRlc3QgLT0gbGVuZ3RoMTtcbiAgICAgIGN1cnNvcjEgLT0gbGVuZ3RoMTtcbiAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjEgKyAxO1xuICAgICAgZm9yIChpID0gbGVuZ3RoMSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFycmF5W2N1c3RvbURlc3QgKyBpXSA9IGFycmF5W2N1c3RvbUN1cnNvciArIGldO1xuICAgICAgfVxuICAgICAgYXJyYXlbZGVzdF0gPSB0bXBbY3Vyc29yMl07XG4gICAgfSBlbHNlIGlmIChsZW5ndGgyID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lcmdlSGlnaCBwcmVjb25kaXRpb25zIHdlcmUgbm90IHJlc3BlY3RlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21DdXJzb3IgPSBkZXN0IC0gKGxlbmd0aDIgLSAxKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgyOyBpKyspIHtcbiAgICAgICAgYXJyYXlbY3VzdG9tQ3Vyc29yICsgaV0gPSB0bXBbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=