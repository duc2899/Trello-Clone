import { ID, account } from "@/appWrite";
import { create } from "zustand";

type Login = {
  Email: string;
  Password: string;
};
type Register = {
  Name: string;
  Email: string;
  Password: string;
};
type Notification = {
  statusCode: number;
  message: string;
};
interface User {
  isLogin: boolean;
  loginUser: (login: Login) => Promise<Notification | undefined>;
  registerUser: (register: Register) => Promise<Notification | undefined>;
  logoutUser: () => void;
}

export const userStore = create<User>()((set) => ({
  isLogin: false,
  loginUser: async (login: Login) => {
    try {
      const response = await account.createEmailSession(
        login.Email,
        login.Password
      );
      console.log(response);

      if (response) {
        set({ isLogin: true });
        const notification: Notification = {
          statusCode: 200,
          message: "Login success",
        };
        return notification;
      }
    } catch (errors: any) {
      set({ isLogin: false });
      let code;
      if (errors) {
        code = errors.code;
      }
      console.log(code);
      switch (code) {
        case 401: {
          const notification: Notification = {
            statusCode: 401,
            message: "Email or Password are invalid",
          };
          return notification;
        }
        default: {
          const notification: Notification = {
            statusCode: 500,
            message: "Something wrong in server",
          };
          return notification;
        }
      }
    }
  },
  registerUser: async (register: Register) => {
    try {
      const response = await account.create(
        ID.unique(),
        register.Email,
        register.Password,
        register.Name
      );
      if (response) {
        const notification: Notification = {
          statusCode: 200,
          message: "Register success",
        };
        return notification;
      }
    } catch (errors: any) {
      let code;
      if (errors) {
        code = errors.code;
      }
      switch (code) {
        case 409: {
          const notification: Notification = {
            statusCode: 409,
            message: "Email is exits",
          };
          return notification;
        }
        default: {
          const notification: Notification = {
            statusCode: 500,
            message: "Something wrong in server",
          };
          return notification;
        }
      }
    }
  },
  logoutUser: () => {
    set({ isLogin: false });
    typeof window !== "undefined"
      ? window.localStorage.removeItem("trello")
      : undefined;
  },
}));
