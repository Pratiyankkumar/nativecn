export interface NativeCNConfig {
    styling: "nativewind" | "stylesheet";
    theme: {
        useExisting: boolean;
        existingThemePath: string | null;
        defaultTheme: "light" | "dark" | "system";
        useSystemTheme: boolean;
    };
    components: {
        outDir: string;
        defaultProps: Record<string, Record<string, any>>;
    };
}
/**
 * Create a NativeCN config file
 */
export declare function createConfig(configOptions?: Partial<NativeCNConfig>): Promise<boolean>;
/**
 * Read the NativeCN config file
 */
export declare function readConfig(): Promise<NativeCNConfig>;
