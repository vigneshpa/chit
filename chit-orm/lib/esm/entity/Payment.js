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
import Chit from "./Chit";
import Model from "./Model";
let Payment = class Payment extends Model {
    constructor(base) {
        super();
        Object.assign(this, base);
    }
    get toBePaid() {
        return this.chit.noOfChits * 5000;
    }
    get user() {
        return this.chit.user;
    }
};
__decorate([
    ManyToOne(type => Chit, Chit => Chit.payments),
    JoinColumn(),
    __metadata("design:type", Chit)
], Payment.prototype, "chit", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Payment.prototype, "imonth", void 0);
__decorate([
    Column(),
    __metadata("design:type", Boolean)
], Payment.prototype, "ispaid", void 0);
Payment = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object])
], Payment);
export default Payment;
