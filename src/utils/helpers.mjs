import bcrypt from "bcryptjs";

//function to hash password

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

//function to compare password

export const comparePassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed); //returns a boolean
};
