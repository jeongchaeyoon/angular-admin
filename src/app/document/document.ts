
export class Document {
  constructor(
    public id?: number,
    public category: string='',
    public document_name: string='',
    public summary: string='기본 페이지 입니다.',
    public is_readable: string='y',
    public document_width: string='100%',
    public template_type: string='default',
    public template_mode: string='p',
    public header_path: string='common/_header.tpl',
    public content_tpl: string='',
    public content_css: string='',
    public content_js: string='',
    public footer_path: string='common/_footer.tpl',
    public date: string='') {}
}