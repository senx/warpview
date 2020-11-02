export declare class ColorLib {
    static color: {
        COHESIVE: string[];
        COHESIVE_2: string[];
        BELIZE: string[];
        VIRIDIS: string[];
        MAGMA: string[];
        INFERNO: string[];
        PLASMA: string[];
        YL_OR_RD: string[];
        YL_GN_BU: string[];
        BU_GN: string[];
        WARP10: string[];
        NINETEEN_EIGHTY_FOUR: string[];
        ATLANTIS: string[];
        DO_ANDROIDS_DREAM: string[];
        DELOREAN: string[];
        CTHULHU: string[];
        ECTOPLASM: string[];
        T_MAX_400_FILM: string[];
    };
    static getColor(i: number, scheme: string): any;
    static getColorGradient(id: number, scheme: string): (string | number)[][];
    static getBlendedColorGradient(id: number, scheme: string, bg?: string): (string | number)[][];
    static getColorScale(scheme: string): any;
    static hexToRgb(hex: any): number[];
    static transparentize(color: any, alpha?: number): string;
    static generateColors(num: any, scheme: any): any[];
    static generateTransparentColors(num: any, scheme: any): any[];
    static hsvGradientFromRgbColors(c1: any, c2: any, steps: any): any[];
    private static rgb2hsv;
    private static hsvGradient;
    private static hsv2rgb;
    static rgb2hex(r: any, g: any, b: any): string;
    static blend_colors(color1: any, color2: any, percentage: any): string;
    static int_to_hex(num: number): string;
}
