import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;


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
