export function getLoggedUser(req) {
    return req.user?.email || null;
}
