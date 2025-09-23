const asyncHandler = (asyncFn: any) => {
    (req: any, res: any, next: any) => {
        Promise.resolve(asyncFn(req, res, next)).catch((err) => next(err))
    }
}




// const asyncHandler = (fn: any) => { async ( req: any, res: any, next: any ) => {
//     try {
//         await fn(req, res, next)
//     } catch (err: any) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }}

export default asyncHandler