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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = exports.LoginUser = exports.RegisterUser = void 0;
const userServices_1 = require("../services/userServices");
const userResponses_1 = require("../utils/userUtils/userResponses");
const validate_1 = require("../utils/userUtils/validate");
const hashers_1 = require("../utils/hashers");
const jwt_1 = __importDefault(require("../utils/jwt"));
//TODO: consider using middleware for error handling
//TODO: store refresh token as cookie in http response
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqData = req.body;
    const validation = (0, validate_1.validateRegistrationData)(reqData);
    if (!validation.isValid) {
        return res.status(400).json({
            error: validation.error,
        });
    }
    try {
        const { confirm_password } = reqData, UserData = __rest(reqData, ["confirm_password"]);
        UserData.password = (yield (0, hashers_1.hashPassword)(UserData.password)).toString();
        const newUser = yield (0, userServices_1.createUser)(UserData);
        const tokens = jwt_1.default.generateTokens({ userId: newUser === null || newUser === void 0 ? void 0 : newUser.id, fullName: newUser === null || newUser === void 0 ? void 0 : newUser.fullName });
        if (newUser) {
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/auth/refresh'
            });
            return res.status(200).json({
                tokens,
                user: (0, userResponses_1.minimalResponse)(newUser),
            });
        }
    }
    catch (e) {
        if (e instanceof userServices_1.UserServiceError) {
            switch (e.code) {
                case "DUPLICATE_EMAIL":
                    return res.status(409).json({ "error": e.message });
                default:
                    return res.status(500).json({ "error": "Internal Server Error" });
            }
        }
    }
});
exports.RegisterUser = RegisterUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const validation = (0, validate_1.validateLoginData)(user);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
    }
    try {
        const validatedUser = yield (0, userServices_1.FindUser)(user.email);
        const isValid = yield (0, hashers_1.comparePassword)(user.password, validatedUser.password);
        const tokens = jwt_1.default.generateTokens({ userId: validatedUser.id, fullName: validatedUser.fullName });
        if (isValid) {
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/auth/refresh'
            });
            return res.status(200).json({
                token: tokens.accessToken,
                user: (0, userResponses_1.minimalResponse)(validatedUser)
            });
        }
    }
    catch (e) {
        if (e instanceof userServices_1.UserServiceError && e.code === "NOT_FOUND") {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        else {
            console.log(e);
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
});
exports.LoginUser = LoginUser;
const RefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
    }
    try {
        const accessToken = jwt_1.default.refreshAccessToken(refreshToken);
        return res.status(200).send({ accessToken });
    }
    catch (err) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh'
        });
        console.log(err);
        return res.status(500).send({ "error": "Access token could not be generated" });
    }
});
exports.RefreshToken = RefreshToken;
