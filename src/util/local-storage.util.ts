const setItem = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting item in localStorage:', error)
  }
}

const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch (error) {
    console.error('Error getting item from localStorage:', error)
    return null
  }
}

export const localStorageUtil = {
  setItem,
  getItem,
}
