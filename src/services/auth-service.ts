import { Logger } from 'winston';
import jwt from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcrypt';

import CommonErrors from '../utils/errors/common-errors';
import { UserModel } from '../database/models/User';
import { StaticModel } from '../database/models/StaticModel';

const fileName = path.basename(__filename);

export interface AuthAttributes {
  id?: number;
  email?: string;
}

export interface RefreshToken {
  status: 'Logged in' | 'Logged out';
  token: string;
  refreshToken: string;
  email: string;
}

export interface JWTConfig {
  algorithm:
  'HS256' |
  'HS384' |
  'HS512' |
  'RS256' |
  'RS384' |
  'RS512' |
  'ES256' |
  'ES384' |
  'ES512' |
  'PS256' |
  'PS384' |
  'PS512'
  ;
  audience: string,
  tokenExpiration: number | string,
  tokenPrivateKeyEnvName: string,
  tokenPublicKeyEnvName: string,
  refreshTokenExpiration: number | string,
  refreshTokenPrivateKeyEnvName: string,
}

export default class AuthService {
  private userRepository: StaticModel<UserModel>;
  private logger: Logger;
  private jwtConfig: JWTConfig;

  tokenMap: { [key: string]: RefreshToken } = {};

  constructor(userRepository: StaticModel<UserModel>, logger: Logger, jwtConfig: JWTConfig) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.jwtConfig = jwtConfig;
  }

  login = async (email: string, password: string) => {
    this.logger.info(`${fileName} - Logging in user : Email : ${email}`);

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      attributes: ['id', 'password'],
    });

    if (!user) {
      this.logger.warn(`${fileName} - User not found : Email : ${email}`);
      throw CommonErrors.UNAUTHORIZED;
    }

    const match = await bcrypt.compare(password, user.password as string);

    if (!match) {
      this.logger.warn(`${fileName} - Credentials mismatch : Email : ${email}`);
      throw CommonErrors.UNAUTHORIZED;
    }

    return this.sign({ id: user.id, email });
  }

  sign = ({ id, email }: AuthAttributes) => {
    this.logger.info(`${fileName} - Generating JWT token : Email : ${email}`);

    const privateKey = process.env[this.jwtConfig.tokenPrivateKeyEnvName] as string;
    const refreshPrivateKey = process.env[this.jwtConfig.refreshTokenPrivateKeyEnvName] as string;

    const token = jwt.sign({ id, email }, privateKey, {
      algorithm: this.jwtConfig.algorithm,
      audience: this.jwtConfig.audience,
      expiresIn: this.jwtConfig.tokenExpiration,
    });

    const refreshToken = jwt.sign({ email }, refreshPrivateKey, {
      algorithm: this.jwtConfig.algorithm,
      audience: this.jwtConfig.audience,
      expiresIn: this.jwtConfig.refreshTokenExpiration,
    });

    this.tokenMap[refreshToken] = {
      email: email as string,
      refreshToken,
      token,
      status: 'Logged in',
    };

    return { token, refreshToken };
  }

  verify = (token: string) => {
    this.logger.info(`${fileName} - Verifying JWT token : Token : ${token}`);

    const publicKey = process.env[this.jwtConfig.tokenPublicKeyEnvName] as string;

    try {
      return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: 'https://sarsit.com.br/api',
      });
    } catch (error) {
      this.logger.warn(`${fileName} - Invalid token`);
      throw CommonErrors.UNAUTHORIZED;
    }
  }

  refresh = (refreshData: RefreshToken) => {
    const { refreshToken } = refreshData;
    if (refreshToken in this.tokenMap && this.tokenMap[refreshToken].email === refreshData.email) {
      const decodedToken = jwt.decode(refreshData.token, { complete: true });
      if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.payload || !decodedToken.payload.id) {
        this.logger.warn(`${fileName} - Failed to refresh token : Decoded Token : ${JSON.stringify(decodedToken)}`);
        throw CommonErrors.FORBIDDEN;
      }
      const { token, refreshToken: newRefreshToken } = this.sign({
        id: decodedToken.payload.id,
        email: refreshData.email,
      });
      this.tokenMap[refreshToken].token = token;
      return { token, newRefreshToken };
    }

    this.logger.warn(`${fileName} - Failed to refresh token : Refresh Data : ${JSON.stringify(refreshData)}`);
    throw CommonErrors.FORBIDDEN;
  }
}
