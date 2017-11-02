# SECURITY  WARNING !!!

This is a powerful tool that can irreversibly destroy your projects. DO NOT install it, if you are not 100% sure that you need it and you know what you are doing!

# Smart Template Processor

Not functional extension at this time.

Smart Template Processor extension helps you code faster by using the power of Ajuro Template Processor (AJP) directly from your IDE.
While the WEB version of AJP can not apply the code into files, this extension has this advantage.
Good templates can increase your productivity, saving the time you usualy spend on writing support code.

Read more on the github AJP page:
https://github.com/profimedica/Templater/wiki/Ajuro-Template-Processor

## Features

v.0.1.X

### SQL commands
SQL commands were introduced. Now you can generate tables with dummy content in your database.

Take as example the generation of a new table in the database.

#### Phase 1) User defines the variable translations that will generate the dummy data

	"Translates":
	{
		"Generated" :
		{
			"int" : "@##RandomInteger(10)##@",
			"bigint" : "@##RandomInteger(100)##@",
			"nvarchar" : "CONCAT('@{Name}@_', CAST(@##RandomInteger(100)##@ AS INT))",
			"nchar" : " CAST(@##RandomInteger(100)##@ AS INT)",
			"decimal" : "@##RandomInteger(100)##@",
			"numeric" : "@##RandomInteger(100)/10##@",
			"reference" : "CONCAT('City_', CAST((SELECT TOP 1 Id as reference FROM @{Referencing_Table}@ WHERE @{Referencing_Table}@.@{Referencing_Column}@ IS NOT NULL ORDER BY NewID()) AS INT))",
			"datetime0" : "DATEADD(MONTH, CAST(@##RandomInteger(11)##@ AS INT), DATEADD(DAY, CAST(@##RandomInteger(29)##@ AS INT), GETDATE()))",
			"datetime" : "DATEADD(DAY, CAST(@##RandomInteger(29)##@ AS INT), GETDATE())",
			"date" : "GETDATE()",
			"bit" : "0"
		}
	},


#### Phase 2) User defines the table structure he wants to generate

	"Tables" : 
	[
		{
			
			"Name" : "Test_Phonebook",
			"Schema" : "dbo",
			"PK" : [ "ProductID", "CustomerID" ],
			"Columns":
			[
				{ "Name":"Id", "Type":"int", "Skeep": 1, "IsKey":1},
				{ "Name":"Name", "Type":"nvarchar", "Precision":"60"},
				{ "Name":"Age", "Type":"int", "Nullable" : true}
			]
		},

#### Phase 3) User define the template fragment to generate the table

    !=========== Tables ===========
    File: RUN-SQL

      *************************************************************
      # Add the canvas to the view
      AJP-SECTION Content -->
      ---------------------------     
        ---- ---- ---- ---- ---- ---- ---- ---- CREATE @{Name}@ TABLE ---- ---- ---- ---- ---- ---- ---- ----
        CREATE TABLE [@{Schema}@].[@{Name}@]
        (
          !=========== Columns ===========
          @~Printed.Columns > 0~@~,~@~~@ [@{Name}@] [@{Type}@]@~(typeof(@{Precision}@) !== 'undefined')~@~(@{Precision}@)~@~~@@~(typeof(@{IsKey}@) !== 'undefined' && @{IsKey}@ == true )~@~ IDENTITY(1,1) PRIMARY KEY~@~~@@~(typeof(@{IsKey}@) === 'undefined' || @{IsKey}@ != true )~@~ NULL~@~~@
          ===========!	
        ) ON [PRIMARY]        
      ---------------------------
    ===========!


#### Phase 4) Inside template processor the next fragment is generated

The template processor will generate the next section for the template interpreter:

    File: RUN-SQL

    *************************************************************
    # Add the canvas to the view
    AJP-SECTION Content -->
    ---------------------------
    CREATE TABLE [dbo].[Phonebook]
    ( 
          [Id] [int] IDENTITY(1,1) PRIMARY KEY
        , [Name] [nvarchar](60) NULL
        , [Age] [int] NULL            
    ) ON [PRIMARY]
    ---------------------------

#### Phase 5) Inside template interpreter a POST request is sent to an SQL client

    const options = {
            url: 'http://localhost:86/my/api/index.php',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Characters':  'UTF-8'
            },
            form: {
                select: "plain",
                query: freeQuery.replace(/\n/g, ' '),
                ajp: true,
                connection: 3,
                fetch: "objects"
            }
        };
        request.post(options, function(err, res, body){
            const json = JSON.parse(body);
            console.log(json);
        });

Generated code update was introduced. Now you can not only insert generated code sections but also update previously inserted code fragments.

You can also manually mark a code sequence to be updated.

Just use the begin and end markers both in your code and in the template:

    <!-- AJP-BEGIN: My-section name-support spaces --> 
        Your code to be updated goes here!
    <!-- AJP-END: My-section name-support spaces --> 

v.0.0.X

The code processor has 2 components:

TemplateProcessor creates an .ajpready file when a template file .ajp is saved.

TemplayeInterpreter will inject the code fragments into your code when a .ajpready file is saved. 

## Requirements

Directory C:\\AJP-Templates is used by default, but you can change the root location of the templates from configuration.

Also you can change the template files extension and the template ready files extension.

## Extension Settings

None

## Known Issues

Next step is to split the template files and the file of variables that the user provides for the TemplateProcessor.

For the moment, the template code and the vatiables that appy to the template are located in the same file.

## Release Notes

### 0.0.1
Created a templates view. 
On disk, each templates has it's own folder. Inside the folder there are multiple versions of the same template.
On the view, only the folders are displayed. Selecting a node opns the most recent template for edit.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**