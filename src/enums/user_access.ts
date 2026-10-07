/* 與後端 UserRole 對應的角色值 */
export const Role = Object.freeze({
    USER: "user",
    OWNER: "owner",
    SUPER_ADMIN: "super_admin",
})

export type RoleValue = typeof Role[keyof typeof Role]

/* 角色顯示文字 */
export const UserRole = Object.freeze({
    [Role.USER]: "一般使用者",
    [Role.OWNER]: "業者",
    [Role.SUPER_ADMIN]: "超級管理員",
}) as Record<string, string>
