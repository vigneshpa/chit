var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Group from "./Group";
import User from "./User";
import Model from "./Model";
let Chit = class Chit extends Model {
    constructor(base) {
        super();
        Object.assign(this, base);
    }
};
__decorate([
    ManyToOne(type => User, User => User.chits),
    JoinColumn(),
    __metadata("design:type", User)
], Chit.prototype, "user", void 0);
__decorate([
    ManyToOne(type => Group, Group => Group.chits),
    __metadata("design:type", Group)
], Chit.prototype, "group", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Chit.prototype, "noOfChits", void 0);
Chit = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object])
], Chit);
export default Chit;
