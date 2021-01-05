"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Group_1 = require("./Group");
const User_1 = require("./User");
const Model_1 = require("./Model");
let Chit = class Chit extends Model_1.default {
    constructor(base) {
        super();
        Object.assign(this, base);
    }
};
__decorate([
    typeorm_1.ManyToOne(type => User_1.default, User => User.chits),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.default)
], Chit.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Group_1.default, Group => Group.chits),
    __metadata("design:type", Group_1.default)
], Chit.prototype, "group", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Chit.prototype, "noOfChits", void 0);
Chit = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], Chit);
exports.default = Chit;
