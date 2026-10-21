export enum Role {
    admin = "admin",
    guest = "guest"
}

/** Roles that existed before (director, manager); users still holding one are converted to guest on startup. */
export const RETIRED_ROLES = ['director', 'manager'];
