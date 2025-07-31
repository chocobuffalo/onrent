export interface ProcessItemInterface {id:number, image:string,title?:string,description?:string}
export interface SliderInterface{
    id:number;
    image:string;
    title:string
    description?:string;
    textLink?:string;
    link?:string;
}
export interface SelectInterface{
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
    readonly lat?: number;
    readonly lon?: number;
}

export interface ModalStateInterface{
    isOpen: boolean;
}