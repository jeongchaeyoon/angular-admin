export class Popup {

  constructor(
    public id: number = 0,
    public popup_name: string = '',
    public popup_title: string = '',
    public is_usable: string = 'n',
    public time_year: number = 0,
    public time_month: number = 0,
    public time_day: number = 0,
    public time_hours: number = 0,
    public time_minutes: number = 0,
    public time_seconds: number = 0,
    public skin: string = 'default',
    public popup_width: string = '',
    public popup_height: string = '',
    public popup_top: string = '',
    public popup_left: string = '',
    public skin_top: string = '',
    public skin_left: string = '',
    public skin_right: string = '',
    public contents: string = '',
    public date: string = 'now()'
    ) {}
}