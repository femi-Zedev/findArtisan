import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      strapiJwt: string;
      userType: "admin" | "user";
    };
  }

  interface User {
    strapiId?: string;
    strapiJwt?: string;
    userType?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiId?: string;
    strapiJwt?: string;
    userType?: "admin" | "user";
  }
}


