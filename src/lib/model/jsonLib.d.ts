export declare class JsonLib {
    at: any;
    ch: any;
    escapee: {
        '"': string;
        '\\': string;
        '/': string;
        b: string;
        f: string;
        n: string;
        r: string;
        t: string;
    };
    text: any;
    private error;
    private next;
    private check;
    private number;
    private testBigInt;
    private string;
    private white;
    private word;
    private array;
    private object;
    private value;
    parse(source: any, reviver: any): any;
}
