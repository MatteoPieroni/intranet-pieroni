const splitEnvVars = (variable) => {
  const singleVars = variable.split(';');
  return {
    name: singleVars[0],
    surname: singleVars[1],
    email: singleVars[2],
    password: singleVars[3],
  }
};

export const users = {
  admin: {
    ...splitEnvVars(process.env.ADMIN_USER),
  },
  notAdmin: {
    ...splitEnvVars(process.env.USER),
  },
  fake: {
    email: "fake@test.com",
    password: "12345678"
  }
}