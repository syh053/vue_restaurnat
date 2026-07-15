
export const cleanParams = (obj: Record<string, any>): Record<string, any> => {
    const newObj: Record<string, any> = {}

    Object.keys(obj).forEach(key => {
        // 過濾掉空字串、null、undefined
        if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
            newObj[key] = obj[key]
        }
    })
    return newObj
}
