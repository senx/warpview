export declare class Timsort {
    /**
     * Default minimum size of a run.
     */
    private static DEFAULT_MIN_MERGE;
    /**
     * Minimum ordered subsequece required to do galloping.
     */
    private static DEFAULT_MIN_GALLOPING;
    /**
     * Default tmp storage length. Can increase depending on the size of the
     * smallest run to merge.
     */
    private static DEFAULT_TMP_STORAGE_LENGTH;
    /**
     * Pre-computed powers of 10 for efficient lexicographic comparison of
     * small integers.
     */
    private static POWERS_OF_TEN;
    private readonly array;
    private readonly compare;
    private minGallop;
    private readonly length;
    private readonly tmpStorageLength;
    private readonly stackLength;
    private readonly runStart;
    private readonly runLength;
    private stackSize;
    private readonly tmp;
    constructor(array: any, compare: any);
    private static log10;
    private static minRunLength;
    private static makeAscendingRun;
    private static reverseRun;
    private static binaryInsertionSort;
    private static gallopLeft;
    private static gallopRight;
    private static alphabeticalCompare;
    static sort(array: any[], compare?: (a: any, b: any) => number, lo?: number, hi?: number): void;
    pushRun(runStart: any, runLength: any): void;
    mergeRuns(): void;
    forceMergeRuns(): void;
    mergeAt(i: any): void;
    mergeLow(start1: any, length1: any, start2: any, length2: any): void;
    mergeHigh(start1: any, length1: any, start2: any, length2: any): void;
}
