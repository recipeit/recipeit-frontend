let uid = 0

export default function uniqueID() {
  const getID = () => {
    return ++uid
  }

  return {
    getID
  }
}
