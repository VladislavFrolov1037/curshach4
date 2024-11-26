export const filterChangedFields = (newData, oldData) => {
    return Object.keys(newData).reduce((changes, key) => {
        if (newData[key] !== oldData[key]) {
            changes[key] = newData[key];
        }

        return changes;
    }, {});
}