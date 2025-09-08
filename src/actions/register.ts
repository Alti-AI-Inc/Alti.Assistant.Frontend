'use server';

export async function RegisterUser({
  email,
  password,
  confirmPassword,
}: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      confirmPassword,
    }),
  });
  console.log('register response', { response });
  return response.json();
}
