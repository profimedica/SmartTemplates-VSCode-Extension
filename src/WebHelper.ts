
import request = require('request');

export class WebHelper {
    public apiCall(freeQuery:string)
    {
        const options = {
            url: 'http://localhost:86/my/api/index.php',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Characters':  'UTF-8'
            },
            form: {
                select: "plain",
                // query: "CREATE TABLE [dbo].[Test_Phonebook88882] ( [Id] [int] IDENTITY(1,1) PRIMARY KEY                    , [Name] [nvarchar](60) NULL                    , [Age] [int] NULL                    , [Phone] [nvarchar](60) NULL                    , [Description] [nvarchar](300) NULL                    , [Note] [nvarchar](300) NULL                    , [City] [nvarchar](60) NULL                    , [Street] [nvarchar](60) NULL                    , [URL] [nvarchar](50) NULL                    , [Prints] [int] NULL                    , [ActivFrom] [datetime] NULL                    , [ActivTo] [datetime] NULL                    , [IsDeliveryAddress] [bit] NULL                    , [Suspended] [bit] NULL                                        ) ON [PRIMARY];                GO",
                query: freeQuery.replace(/\n/g, ' '),
                ajp: true,
                database: "Northwind (MsSQL)",
                connection: 3,
                fetch: "objects"
                /*
                select: "plain",
                list: "connections",
                */
            }
        };
        request.post(options, function(err, res, body){
            const json = JSON.parse(body);
            console.log(json);
        });
    }
}