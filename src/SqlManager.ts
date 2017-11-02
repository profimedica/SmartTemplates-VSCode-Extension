class SqlManager {

    private connection:string = "Data Source=RAVINDRA\\SQLEXPRESS\\Initial Catalog=Employee;Integrated Security=SSPI;";

    public Execute(sqlCommand:string)
    {
        var db = require("odbc")()
        , cn = "DRIVER={FreeTDS};SERVER=host;UID=user;PWD=password;DATABASE=dbname"
        ;
       
      //blocks until the connection is opened. 
      db.openSync(cn);
       
      //blocks until the query is completed and all data has been acquired 
      var rows = db.querySync("select top 10 * from customers");
       
      console.log(rows);
    }
}