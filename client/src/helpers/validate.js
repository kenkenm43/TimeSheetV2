import * as yup from "yup";
const validatePassword = yup
    .string()
    .required("โปรดกรอกรหัสผ่าน")
    .min(8, "โปรดใส่รหัสผ่านให้ครบ 8 หลัก")
    .max(32, "ไม่สามารถใส่ตัวอักษรได้เกิน 32 ตัวอักษร");
const validateUsername = yup
    .string()
    .required("โปรดกรอกชื่อผู้ใช้งานหรือเลขบัตรประชาชน")
    .min(8, "โปรดใส่ชื่อผู้ใช้อย่างน้อย 8 ตัวอักษร")
    .max(32, "ไม่สามารถใส่ชื่อผู้ใช้ได้เกิน 32 ตัวอักษร");
export const validateLogin = yup.object({
    username: validateUsername,
    password: validatePassword,
});
export const validateRegister = yup.object({
    username: validateUsername,
    firstName: yup
        .string()
        .required("โปรดกรอกชื่อจริง")
        .max(32, "ไม่สามารถใส่ตัวอักษรได้เกิน 32 ตัวอักษร"),
    lastName: yup
        .string()
        .required("โปรดกรอกนามสกุล")
        .max(32, "ไม่สามารถใส่ตัวอักษรได้เกิน 32 ตัวอักษร"),
    idCard: yup
        .string()
        .required("โปรดกรอกเลขบัตรประชาชน")
        .min(13, "โปรดใส่เลขบัตรประชาชนให้ครบ 13 หลัก")
        .max(13, "ไม่สารถใส่ได้เกิน 13 หลัก"),
    password: validatePassword,
    confirmPassword: yup
        .string()
        .required("โปรดกรอกรหัสผ่าน")
        .min(8, "โปรดใส่รหัสผ่านให้ครบ 8 หลัก")
        .max(32, "ไม่สามารถใส่ตัวอักษรได้เกิน 32 ตัวอักษร")
        .oneOf([yup.ref("password")], "รหัสผ่านไม่ต้องถูกต้อง"),
});
