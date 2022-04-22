import { JsonItem, AllowTypeItem } from './../type/simple-json';
export declare const typeOf: (obj: any) => string;
export declare const _UUID: () => string;
export declare const deepAnalysisJson: (json: Record<string, any>) => Array<JsonItem>;
export declare const deepReductionJson: (json: Array<JsonItem>) => Record<string, any>;
export declare const deepDeleteJson: (json: JsonItem, tempId: string) => void;
export declare const updataArrIndex: (json: JsonItem) => void;
export declare const deepUpdataJson: (json: JsonItem, tempId: string, key: string, value: any) => void;
export declare const mergeArray: (target: Array<any>, scoure: Array<AllowTypeItem>) => {
    type: any;
    desc: any;
    default: any;
    slot: any;
}[];
