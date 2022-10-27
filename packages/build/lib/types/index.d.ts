export interface ICopyStatic {
    from: string;
    to: string;
}
export interface IMpaConfig {
    entry?: string;
    template?: string;
    injectScript?: string;
    copyStatic?: ICopyStatic[];
}
