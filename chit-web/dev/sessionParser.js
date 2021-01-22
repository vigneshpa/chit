"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("express-session");
const CreateMemStore = require("memorystore");
const MemStore = CreateMemStore(session);
const sessionParser = session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: new MemStore({ checkPeriod: 86400000 }),
    cookie: {
        httpOnly: true
    }
});
exports.default = sessionParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvblBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXNzaW9uUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBRTNDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM3QyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFVekMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDO0lBQzVCLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztJQUNsQyxNQUFNLEVBQUUsS0FBSztJQUNiLEtBQUssRUFBQyxJQUFJLFFBQVEsQ0FBQyxFQUFDLFdBQVcsRUFBQyxRQUFRLEVBQUMsQ0FBQztJQUMxQyxNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsYUFBYSxDQUFDIn0=