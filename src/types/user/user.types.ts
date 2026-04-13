export interface UserTypes {
    id: string
    name: string
    email: string
    mfaEnabled?: boolean
    singleSession?: boolean
    isAdmin?: boolean
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
    deletedAt?: string
}

export interface CreateUserDTO {
    name: string
    email: string
    mfaEnabled?: boolean
    singleSession?: boolean
    isAdmin?: boolean
}

export interface UpdateUserDTO {
    id: string
    name?: string
    email?: string
    isActive: boolean
    mfaEnabled?: boolean
    mfaSecret?: string | null
    isAdmin?: boolean
    singleSession?: boolean
}