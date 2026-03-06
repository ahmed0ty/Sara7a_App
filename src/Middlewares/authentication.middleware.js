
import { UserModel } from "../DB/Models/user.model.js";
import { getSignature, verifyToken } from "../Utils/token.utils.js";
import * as dbService from "../DB/dbService.js";
import { TokenModel } from "../DB/Models/token.model.js";




export const tokenTypesEnum = {

  access:"access",
  refresh:"refresh"
}


const decodedToken = async ({
  authorization,
  tokenType = tokenTypesEnum.access,
  next,
}) => {

  if (!authorization) {
    return next(new Error("Authorization header is required", { cause: 400 }));
  }

  const [bearer, token] = authorization.split(" ");

  if (!bearer || !token || bearer !== "Bearer") {
    return next(new Error("Invalid Bearer Token", { cause: 400 }));
  }

  let decoded;

  try {
    const adminSignature = await getSignature({ signatureLevel: "Admin" });

    decoded = verifyToken({
      token,
      signature:
        tokenType === tokenTypesEnum.access
          ? adminSignature.accessSignature
          : adminSignature.refreshSignature,
    });

  } catch (err) {
    try {
      const userSignature = await getSignature({ signatureLevel: "User" });

      decoded = verifyToken({
        token,
        signature:
          tokenType === tokenTypesEnum.access
            ? userSignature.accessSignature
            : userSignature.refreshSignature,
      });

    } catch (error) {
      return next(new Error("Invalid Signature", { cause: 401 }));
    }
  }


  if (
    decoded?.jti &&
    await dbService.findOne({
      model: TokenModel,
      filter: { jti: decoded.jti },
    })
  ) {
    return next(new Error("Token is Revoked", { cause: 401 }));
  }

  const user = await dbService.findById({
    model: UserModel,
    id: decoded._id,
  });

  if (!user) return next(new Error("User Not Found", { cause: 404 }));


  console.log(user.changeCredentialsTime?.getTime() , decoded.iat)

  if(user.changeCredentialsTime?.getTime()>decoded.iat * 1000)
  {
    return next(new Error("Token Is Expired", { cause: 401 }));
  }


  return { user, decoded };
};



export const authentication = ({ tokenType = tokenTypesEnum.access }) => {
  return async (req, res, next) => {

    const data = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
      next,
    });

    if (!data) return;

    req.user = data.user;     
    req.decoded = data.decoded;

    return next();
  };
};




export const authorization = ({accessRoles = []}) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Unauthorized", { cause: 403 }));
    }

    return next();
  };
};