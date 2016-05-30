export const Config = {
    MAP_SIZE: 10,
    
    BLOCKS: [
        {
            //--. 00.
            //00. [X]
            color: [179, 157, 219],
            points: [
                [0, 0]
            ]
        },
        {
            //--. 00.01.
            //00. [X][X]
            //01. [X][ ]
            color: [144, 202, 249],
            points: [
                [0, 0], [1, 0], [0, 1]
            ]
        }
    ]
};
