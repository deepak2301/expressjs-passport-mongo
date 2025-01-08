export const createUserValidationSchema = {
  username: {
    isLength: {
      errorMessage: "Username should be min of 4 and max of 28 characters",
      options: { min: 4, max: 28 },
    },
    notEmpty: true,
    isString: {
      errorMessage: "uername should be a string",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};
