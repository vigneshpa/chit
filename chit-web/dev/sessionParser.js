"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("express-session");
const sessionParser = session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        httpOnly: true
    }
});
exports.default = sessionParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvblBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXNzaW9uUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkNBQTJDO0FBVzNDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztJQUM1QixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7SUFDbEMsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsYUFBYSxDQUFDIn0=