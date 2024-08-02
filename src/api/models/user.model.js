import { db } from "../database/connection.database";

const create = async ({ username, email, password }) => {
  const query = {
    text: `
      INSERT INTO USERS (USERNAME,EMAIL,PASSWORD)
      VALUES ($1,$2,$3)
      RETURNING USERNAME,EMAIL,PASSWORD,ROLE;
    `,
    values: [username, email, password],
  };

  const { rows } = await db.query(query);
  return rows;
};

const findOneByEmail = async (email) => {
  const query = {
    text: `
      SELECT * FROM USERS
      WHERE EMAIL = $1
    `,

    values: [email],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

const changeName = async ({ email, newUsername }) => {
  query = {
    text: `
      UPDATE USERS 
      SET USERNAME = $1
      WHERE EMAIL = $2
      RETURNIN USERNAME, EMAIL, UID;
    `,

    values: [newUsername, email],
  };

  const { rows } = await db.query(query);
  return rows;
};

const changePassword = async ({ email, newPassword }) => {
  const query = {
    text: `
      UPDATE USERS
      SET PASSWORD = $1
      WHERE EMAIL = $2
      RETURNING USERNAME,EMAIL,UID;
    `,
    values: [newPassword, email],
  };

  const { rows } = await db.query(query);
  return rows;
};

const deleteUser = async (email) => {
  const query = {
    text: `
      DELETE FROM USERS
      WHERE EMAIL = $1
      RETURNING EMAIL,USERNAME,UID;
    `,
    values: [email],
  };

  const { rows } = db.query(query);
  return rows;
};

export const UserModel = {
  create,
  findOneByEmail,
  changeName,
  changeEmail,
  changePassword,
  deleteUser,
};
