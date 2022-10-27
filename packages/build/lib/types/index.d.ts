export interface ICopyStatic {
    from: string;
    to: string;
}
export interface IMpaConfig {
    root?: string;
    entry?: string;
    template?: string;
    injectScript?: string;
    copyStatic?: ICopyStatic[];
}
