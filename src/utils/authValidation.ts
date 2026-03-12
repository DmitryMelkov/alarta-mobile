export interface AuthErrors {
  username: string;
  password: string;
  form: string;
}

export const validateAuthForm = (
  username: string,
  password: string,
): { valid: boolean; errors: AuthErrors } => {
  let valid = true;
  const errors: AuthErrors = {
    username: '',
    password: '',
    form: '',
  };

  if (!username.trim()) {
    errors.username = 'Логин обязателен';
    valid = false;
  } else if (username.length < 3) {
    errors.username = 'Логин слишком короткий';
    valid = false;
  }

  if (!password) {
    errors.password = 'Пароль обязателен';
    valid = false;
  } else if (password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
    valid = false;
  }

  return { valid, errors };
};
