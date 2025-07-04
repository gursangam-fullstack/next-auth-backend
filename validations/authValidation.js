const {z} = require ("Zod");
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const userRegistration =z.object({
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
const OtpVerifyFormSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),

    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be a 6-digit number")
        .nonempty("OTP is required"),
});

module.exports = {
  userRegistrationSchema :userRegistration,
  OtpVerifyFormSchema
};



