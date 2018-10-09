export class Menu {

  constructor(
    public id: number = 0,
    public category: string = '',
    public menu_name: string = '',
    public module_name: string = '',
    public url: string = '',
    public url_target: string = '_self',    
    public is_active: number = 0,
    
    public top: number= 0,    
    public posy: number = 0,
    public height: number = 0,
    public depth: number = 1,
    public margin_left: number = 0,
    public padding_left:number = 5,
    public isDragging: boolean = false,
    public isChecked: boolean = false,
    public isPanelInfo: boolean = false,
    public disabled: boolean = false,
    public state: string = 'default',
    public sub: any[] = null,){}
}