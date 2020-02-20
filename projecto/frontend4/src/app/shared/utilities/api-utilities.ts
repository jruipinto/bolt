export const dbQuery = (input: string, columns: string[]) => {
    if (!input) {
        return;
    }

    return ({
        query: {

            $sort: columns.reduce((acc: any, col) => {
                if (typeof acc === 'string') {
                    return { [acc]: 1, [col]: 1 };
                }
                return { ...acc, [col]: 1 };
            }),

            $limit: 200,

            $and: input
                .split(' ')
                .map(word => ({
                    $or: columns.map(
                        col => ({ [col]: { $like: '%' + word + '%' } })
                    )
                }))
        }
    });

};
