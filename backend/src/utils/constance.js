export const DB_NAME = "e-commerce-app-db";

export const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const SUCCESS = {
    STATUS_CODE: 200,
    MESSAGE: "SUCCESS",
};

export const INTERNAL_SERVER_ERROR = {
    STATUS_CODE: 500,
    MESSAGE: "INTERNAL_SERVER_ERROR",
};

export const BAD_REQUEST = {
    STATUS_CODE: 400,
    MESSAGE: "BAD_REQUEST",
};

export const FORBIDDEN = {
    STATUS_CODE: 401,
    MESSAGE: "FORBIDDEN_REQUEST",
};

export const NOT_FOUND = {
    STATUS_CODE: 404,
    MESSAGE: "NOT_FOUND",
}

