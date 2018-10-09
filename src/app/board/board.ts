export class Board {

  constructor(
    public id: string = '',
    public category: string = '',
    public is_notice: string = 'n',
    public user_id: string = '',    
    public user_name: string = '',
    public nick_name: string = '',
    public password: string = '',
    public title: string = '',
    public contents: string = '',
    public email_address: string = '',
    public readed_count: number = 0,
    public voted_count: number = 0,
    public blamed_count: number = 0,
    public progress_step: string = 'n',
    public igroup_count: number = 0,
    public space_count: number = 0,
    public ssunseo_count: number = 0,
    public wall: string = 'a',
    public contents_type: string = 'text',
    public filename: string = '',
    public filesize: string = '',
    public filetype: string = '',
    public date: string = 'now()',
    public ip: string='') {}
}