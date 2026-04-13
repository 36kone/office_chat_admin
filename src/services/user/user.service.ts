import {Config} from "@config"
import apiService from "@/services/api.service"
import type {PaginatedResponse} from "@/services/pagination.types"
import type {CreateUserDTO, UpdateUserDTO, UserTypes} from "@/types/user/user.types"

class UserService {

    getById(id: string): Promise<UserTypes> {
        return apiService.get<UserTypes>(`/v1/users/${id}`, {baseURL: Config.API_BASE_URL})
    }

    getUserByRole(role: string): Promise<UserTypes[]> {
        return apiService.get<UserTypes[]>(`/v1/users/${role}/role`, {baseURL: Config.API_BASE_URL})
    }

    search(params: {
        page: number
        size: number
        keyword?: string
        roles?: string[]
        status?: string
    }): Promise<PaginatedResponse<UserTypes>> {
        return apiService.post<PaginatedResponse<UserTypes>>("/v1/users/search", params, {
            baseURL: Config.API_BASE_URL,
        })
    }

    createUser(data: CreateUserDTO): Promise<UserTypes> {
        return apiService.post<UserTypes>("/v1/users/", data, {baseURL: Config.API_BASE_URL})
    }

    update(data: UpdateUserDTO): Promise<UserTypes> {
        return apiService.put<UserTypes>(`/v1/users/${data.id}`, data, {baseURL: Config.API_BASE_URL})
    }

    delete(id: string): Promise<void> {
        return apiService.delete<void>(`/v1/users/${id}`, {baseURL: Config.API_BASE_URL})
    }
}

export default new UserService()
