export default () => {
  const createUser = async (username: string, email: string) => {
    const { data } = await useFetch('/api/createUser', {
      method: 'POST',
      body: {
        username,
        email,
      },
    })
    return data
  }

  return { createUser }
}
