const { z } = require("zod");
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const userRegistrationSchema =z.object({
    name : z
    .string()
    .min(3, " Name must be atleast 3 characters long")
    .max(20,"name must be less than 20 characters")
    .regex(nameRegex, "Name must contain only alphabets and single spaces, no special characters or numbers"),
   email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),

  mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number")
        .nonempty("Mobile number is required"),

        
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .nonempty("Password is required"),

        
});




const LoginFormSchema = z.object({
email: z
    .string({
      required_error: "Email is required"
    })
    .email("Invalid email address"),

  password: z
    .string({
      required_error: "Password is required"
    })
    // .min(8, "Password must be at least 8 characters long")
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
    //   "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    // )

})

const changePasswordSchema = z.object({
  password: z
    .string({
      required_error: "New password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),

  password_confirmation: z
    .string({
      required_error: "Confirm password is required",
    }),
}).refine((data) => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: "New password and confirm password do not match",
});

const forgotPasswordOtpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
});

const verifyForgotPasswordOtpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be 6 digits"),

  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),

  confirmPassword: z
    .string({ required_error: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "New password and confirm password do not match",
});

module.exports = {
 // userRegistrationSchema :userRegistration,

userRegistrationSchema,
  LoginFormSchema,
  changePasswordSchema,
  forgotPasswordOtpSchema,
  verifyForgotPasswordOtpSchema

};



