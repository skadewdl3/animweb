export default async () => {
  const saveAnimation = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        console.log('saving Animation')
        resolve()
      }, 2000)
    })
  }

  return { saveAnimation }
}
