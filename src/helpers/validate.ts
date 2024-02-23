import * as yup from "yup";

export const validateLogin = yup.object({
  username: yup.string().required("โปรดกรอกชื่อผู้ใช้งานหรือเลขบัตรประชาชน"),
  password: yup.string().required("โปรดกรอกรหัสผ่าน"),
});

export const validateRegister = yup.object({
  username: yup.string().required("โปรดกรอกชื่อผู้ใช้งานหรือเลขบัตรประชาชน"),
  firstName: yup.string().required("โปรดกรอกชื่อจริง"),
  lastName: yup.string().required("โปรดกรอกนามสกุล"),
  idCard: yup.string().required("โปรดกรอกเลขบัตรประชาชน"),
  password: yup.string().required("โปรดกรอกรหัสผ่าน"),
  confirmPassword: yup.string().required("โปรดกรอกยืนยันรหัสผ่าน"),
});
