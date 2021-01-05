var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";
let Group = class Group extends Model {
    constructor(base) {
        super();
        Object.assign(this, base);
    }
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Group.prototype, "batch", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Group.prototype, "month", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Group.prototype, "year", void 0);
__decorate([
    OneToMany(type => Chit, Chit => Chit.group, { cascade: true }),
    __metadata("design:type", Array)
], Group.prototype, "chits", void 0);
Group = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object])
], Group);
export default Group;
