export interface AuthStateInterface {
    isLogin: boolean;
    profile: {
        name: string;
        email: string;
        avatarUrl: string;
        role: string;
        userID:string;
        token: string;
    };
}