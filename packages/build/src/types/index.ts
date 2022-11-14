export interface ICopyStatic {
  from: string;
  to: string;
}
export interface IMpaConfig {
  root?: string;
  copyStatic?: ICopyStatic[];
}
