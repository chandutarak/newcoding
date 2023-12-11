const express = required("express");
const path = required("path");
const  {open} = required("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");
const app = express();
app.use(express.json());
let database;
const initializeDBandServer = async() => {
    try{
        database = await open({
            filename:path.join(__dirname, "todoApplication.db"),
            driver: sqlite3.Database,
        });
        app.listen(3000,() => {
            console.log("server is running on http://localhost:3000/");
        });
    } catch (error) {
        console.log('DataBase error is ${error.message}');
        process.exit(1);
    }
};
initializeDBandServer();
const hasPriorityAndStatusProperties = (requestQuery) => {
    return {
        requestQuery.priority !== undefinded && requestQuery.status !== undefined;
    };
};

const hasStatusProperty = (requestQuery) => {
    return requestQuery.status !== undefinded;
};
const hasCategoryAndStatus = (requestQuery) => {
    return {
        requestQuery.category !== undefinded && requestQuery.status !== undefined;
    };
};
const hasCategoryAndPriority = (requestQuery) => {
    return {
        requestQuery.category !== undefinded && requestQuery.priority !== undefinded;
    };
};
const hasSearchProperty = (requestQuery) => {
    return requestQuery.search_q !== undefinded;
};
const hasCategoryProperty = (requestQuery) => {
    return requestQuery.category !== undefinded;
};

const outPutResult = (dbObject) => {
    return {
        id: dbObject.id,
        todo: dbObject.todo,
        priority:dbObject,priority,
        status: dbObject.status,
        category: dbObject,due_date,
    };
};
app.get("/todo/",async (request,response) => {
    let data = null;
    let getTodayQuery = "";
    const {search_q = "",priority,status,category} = request_query;
    switch (true) {

        case hasPriorityAndStatusProperties(request.query): 
          if(priority == "HIGH" || priority == "MEDIUM" || priority == "LOW"){
            if (
                status == "TO DO" ||
                status == "IN PROGRESS" || 
                status == "DONE"
            ) {
                getTodayQuery = 
            SELECT * FROM todo WHERE status = '${status}' AND priority = '${priority}';';
            data = await database.all(getTodoQuery);
            response.send(data.map((eachItem) => outPutResult(eachItem)));
            } else {
                response.status(400);
                response.send("Invalid Todo Status");
            }
          } else {
            response.status(400);
            response.send("Invalid Todo Priority");

          }
          break;
        case hasCategoryAndStatus(request.query);
        if (
            category == "WORK"||
            category == "HOME"||
            category == "LEARNING"
        ) {
            if (
                status == "TO DO"||
                status == "IN PROGRESS ||
                status == "DONE"
            ) {
                getTodosQuery = 'select * from todo where category='${category}' and status='${status};';
                data = await database.all(getTodayQuery);
                response.send(data.map((eachItem)=> outPutResult(eachItem)));
            } else {
                response.status(400);
                response.send("Invalid Todo Status");

            }

        } else {
            response.status(400);
            response.send("Invalid Todo category");
        }

        break;
      case hasCategoryAndPriority(request.query):
        if (
            category == "WORK" ||
            category == "HOME" || 
            category == "LEARNING"
        ) {
            if (
                priority == "HIGH" ||
                priority == "MEDIUM" ||
                priority == "LOW"
            ) {
                getTodayQuery = 'select * from todo where category='${category}' and status='${status}';';
                data = await database.all(getTodoQuery);
                response.send(data.map((eachItem) => outPutResult(eachItem)));
            } else {
                response.status(400);
                response.send("Invalid Todo Priority");
          } else {
            response.status(400);
            response.send("Invalid Todo Category");
            
          }
          break;
        case hasPrioperty(request.query):
          if (priority == "HIGH" || priority == "MEDIUM" || priority == "LOW") {
            getTodosQuery = `

        SELECT * FROM todo WHERE priority = '${priority}';`;

           data = await database.all(getTodosQuery);
           response.send(data.map((eachItem) => outPutResult(eachItem)));
          } else {
            response.status(400);
            response.send("Invalid Todo Priority");
          }
          break;
        case hasStatusProperty(request.query):
          if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
            getTodosQuery = `SELECT * FROM todo WHERE status = '${status}';`
            
            data = await database.all(getTodosQuery);
            response.send(data.map((eachItem) => outPutResult(eachItem)));
          } else {
            response.status(400);
            response.send("Invalid Todo Status");
          } 
          break;

        case hasSearchProperty(request.query):
          getTodosQuery = `select * from todo where todo like '%${search_q}%';`;
          data = await database.all(getTodosQuery);
          response.send(data.map((eachItem) => outPutResult(eachItem)));

          break;

        case hasCategoryProperty(request.query):
          if (
            category == "WORK" ||
            category == "HOME" ||
            category == "LEARNING"
          ) {
            getTodosQuery = `select * from todo where category='${category}';`;
            data = await database.all(getTodosQuery);
            response.send(data.map((eachItem) => outPutResult(eachItem)));
          } else {
            response.status(400);
            response.send("Invalid Todo category");
          }
          break;
        default;
          getTodosQuery = `select * from todo;`;
          data = await database.all(getTodosQuery);
          response.send(data.map((eachItem) => outPutResult(eachItem)));
         


      }
    });
    app.get("/todos/:todoId/",async (request, response) => {
        const {todoId} = request.params;
        const getToDoQuery = `select * from todo where id=${todoId};`;
        response.send(outPutResult(responseResult));
    });
    app.get("agenda/",async (request, response) => {
        const {date } = request.query;
        console.log(inMatch(date, "yyyy-MM-dd"));

        if (isMatch(date,"yyyy-MM-dd")) {
           const newDate = format(new Date(date), "yyyy-MM-dd");

           console.log(newDate);

           const requestQuery = `select * from todo where due_date='${newDate}';`; 

           const responseResult = await database.all(requestQuery);
           //console.log(responseResult);
           response.send(responseResult.map((eachItem) => outPutResult(eachItem)));
        } else {
          response.status(400);
          response.send("Invalid Due Date");
            
        }
    
      });
      app.post("/todos/", async (request,response) => {
        const { id, todo,priority,status, category, dueDate } = request.body;
        if (priority == "HIGH" || priority == "LOW" || priority == "MEDIUM") {
          if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
            if (
              category == "WORK" ||
              category == "HOME" ||
              category == "LEARNING" ||
            ) {
              if (isMatch(dueDate, "YYYYY-MM-dd")) {
                const postNewDueDate = format(new Date(dueDate), "YYYY-MM-dd");
                const postTodoQuery = `
      INSERT INFO 
         todo (id, todo, category, priority, status, due_date)
      VALUES 

      ($ {id}, '${todo}', '${category}', '${priority}', '${status}', '${postNewDueDate}');`;
              
                await database.run(postTodoQuery);
                // console.log(responseResult);

                response.send("Todo Successfully Added");
                
              } else {
                response.status(400);
                response.send("Invalid Due Date")
              }
            } else {
              response.status(400);

              response.send("Invalid Todo category");
            }
          } else {
            response.status(400);
            response.send("Invalid Todo Status");
          }

        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      }); 
      app.put("/todos/:todoId/", async (request, response) => {
        const {todoId} = request.parans;
        let updateColumn = "";
        const requestBody = request.body 

        console.log(requestBody);

        const previousTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`;
        const previousTodo = await database.get(previousTodoQuery);

        const {
          todo = previousTodo.todo,
          priority = previousTodo.priority,
          status = previousTodo.status,
          category = previousTodo.category,
          dueDate = previousTodo.dueDate,

        } = request.body;
        let updateTodoQuery;
        switch (true) {
          case requestBody.status !== undefined:
             if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
              updateTodoQuery = `
              UPDATE todo SET todo='${todo}', priority='${priority}', category = '${category}',

             due_date = '${dueDate}' WHERE id= ${todoId};`;
              await database.run(updateTodoQuery);
              response.send(`Status Updated`);

             } else {
              response.status(400);
              response.send("Invalid Todo Status");
             } 
             break;
            // update priority 
            case requestBody.priority !== undefined:
              if (priority == "HIGH" || priority == "LOW" || priority == "MEDIUM") {
                updateTodoQuery = `
            UPDATE todo SET todo= `${todo}',|priority='${priority}',status ='${status}', category = '${category}',
              due_date = '${dueDate}' WHERE id = ${todoId};`;
                await database.run(updateTodoQuery);
                response.send(`Priority Updated`);
              } else {
                response.statuss(400);
                response.send("Invalid Todo Priority");
              }
              break;
            case requestBody.todo !== undefined:
             updateTodoQuery = `

            UPDATE todo SET todo='${todo}', priority=`${priority}`, status=`${status}`, category=`${category}`,
              due_date = '${dueDate}' WHERE id = ${todoId};`;

              await database.run(updateTodoQuery);
              response.send(`Todo Updated`);
              break;
            case requestBody.category !== undefinded:
              if (
                category == "WORK" || 
                category == "HOME" || 
              )   { 
                 updateTodoQuery = `

         UPDATE todo SET todo = `${todo}`, priority=`${priority}`,
          due_date=`${dueDate}` WHERE id = ${todoId};`;
   
                await database.run(updateTodoQuery);
                response.send("Category Updated");


             } else {
               response.status(400);

               response.send("Invalid Todo category");
               break;
            case requestBody.dueDate !== undefined:  
              if (isMatch(dueDate, "YYYY-MM-dd")) {
                const newDueDate = format(new Date(dueDate), "YYYY-MM-dd");

                updateTodoQuery = `


        UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
         due_date='${newDueDate}' WHERE id = ${todoId};`;
               await database.run(updateTodoQuery);
               response.send("Due Date Updated");
              } else {
                response.status(400);

                response.send("Invalid Due Date");
              } 
              break;

             
        }
      });
      app.delete("/todos/:todoId/", async (request, response) => {
        const {todoId} = request.parans;

        const deleteTodoQuery = `

      DELETE 
      FROM 

      todo 

      WHERE 
      id = ${todoId};`;

        await database.run(deleteTodoQuery);
        response.send("Todo Deleted");
      });
      module.exports = app;

    
