export default () => {
  const createUser = async (username: string, user: any) => {
    const { data } = await useFetch('/api/createUser', {
      method: 'POST',
      body: {
        username,
        user,
      },
    })
    return data
  }

  return { createUser }
}
