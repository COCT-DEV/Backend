"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUser = exports.createUser = exports.UserServiceError = void 0;
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../prisma/client"));
class UserServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'UserServiceError';
    }
}
exports.UserServiceError = UserServiceError;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_2.default.user.create({
            data: data
        });
        return user;
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw new UserServiceError("User with this email already exists", "DUPLICATE_EMAIL");
            }
            else {
                throw new UserServiceError('An unexpected error occurred', "DATABASE_ERROR");
            }
        }
        else {
            console.log(`creation Error: ${e}`);
        }
    }
});
exports.createUser = createUser;
const FindUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error("a value for user email is required");
    }
    try {
        const user = yield client_2.default.user.findFirst({
            where: {
                email: email,
            }
        });
        if (!user) {
            throw new UserServiceError("User does not exist", "NOT_FOUND");
        }
        return user;
    }
    catch (err) {
        throw new UserServiceError("An unexpected error occurred", 'DATABASE_ERROR');
    }
});
exports.FindUser = FindUser;
