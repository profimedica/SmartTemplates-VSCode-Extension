export class AjuroTemplate {
    
    constructor(
        public readonly FilePath: string,
        public readonly FileName: string,
        public readonly IsDir: boolean
    ){
        this.Children = new Array();
    }
    public Children: Array<AjuroTemplate>;

}