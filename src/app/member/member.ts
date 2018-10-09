export class Member {

  constructor(
    public id: string = '',
    public category: string='',
    public user_id: string='',
    public password: string='',
    public user_name: string='',
    public nick_name: string='',
    public email_address: string='',
    public forget_asking: string='',
    public forget_answer: string='',
    public hp1: string='',
    public hp2: string='',
    public hp3: string='',
    public recommend_id: string='',
    public job: string='',
    public hobby: string='',
    public join_path: string='',
    public access_count: number=0,
    public point: number=0,
    public grade: number=0,
    public is_writable: string='y',
    public is_kickout: string='n',
    public date: string='',
    public ip: string=''
    ) {}  
}