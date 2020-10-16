import { ButtonConfig } from './buttonConfig';
import { EditorConfig } from './editorConfig';
export declare class Config {
    buttons?: ButtonConfig;
    execButton?: ButtonConfig;
    datavizButton?: ButtonConfig;
    hover?: boolean;
    readOnly?: boolean;
    messageClass?: string;
    errorClass?: string;
    editor: EditorConfig;
}
