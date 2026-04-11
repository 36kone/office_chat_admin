import React, {createContext, useContext, useState} from "react";

interface AppContextType {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    registerForm: (setter: React.Dispatch<React.SetStateAction<unknown>>) => void
    updateField: (field: string, value: unknown) => void
}

interface AppProviderProps {
    children: React.ReactNode
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useApp must be used within an AppProvider')
    return context
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const formSetterRef = React.useRef<React.Dispatch<React.SetStateAction<unknown>> | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const registerForm = (setter: React.Dispatch<React.SetStateAction<unknown>>) => {
        formSetterRef.current = setter
    }

    const updateField = (field: string, value: unknown) => {
        if (formSetterRef.current) {
            formSetterRef.current((prev: any) => ({...prev, [field]: value}))
        }
    }

    const value: AppContextType = {
        isLoading,
        setIsLoading,
        registerForm,
        updateField
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}