interface InitOptions {
    styling?: "nativewind" | "stylesheet";
    theme?: "light" | "dark" | "system";
    skipInstall?: boolean;
}
export declare function initCommand(options?: InitOptions): Promise<void>;
export {};
