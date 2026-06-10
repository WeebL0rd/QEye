import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getAuth } from '../config/firebase.js';
import UserDAO from '../dao/usersDAO';
import config from '../config/environment';
import type { AuthResponse } from '../types/index.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, email } = req.user!;
    let user = await UserDAO.findById(uid);

    if (!user) {
      const firebaseUser = await getAuth().getUser(uid);
      user = await UserDAO.create({
        uid,
        email,
        displayName: firebaseUser.displayName ?? email.split('@')[0],
        photoURL: firebaseUser.photoURL ?? undefined,
      });
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] },
    );

    const response: AuthResponse = {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('[auth/login]', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body as {
      email: string;
      password: string;
      displayName: string;
    };

    if (!email || !password || !displayName) {
      res.status(400).json({
        success: false,
        message: 'email, password y displayName son requeridos.',
      });
      return;
    }

    const existing = await UserDAO.findByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'El correo ya está registrado.' });
      return;
    }

    const firebaseUser = await getAuth().createUser({ email, password, displayName });
    const user = await UserDAO.create({
      uid: firebaseUser.uid,
      email,
      displayName,
      photoURL: firebaseUser.photoURL ?? undefined,
    });

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] },
    );

    const response: AuthResponse = {
      token,
      user: { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL },
    };

    res.status(201).json({ success: true, data: response, message: 'Cuenta creada exitosamente.' });
  } catch (error: unknown) {
    console.error('[auth/register]', error);
    const msg =
      (error as { code?: string }).code === 'auth/email-already-exists'
        ? 'El correo ya está en uso.'
        : 'Error al crear la cuenta.';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserDAO.findById(req.user!.uid);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('[auth/me]', error);
    res.status(500).json({ success: false, message: 'Error al obtener perfil.' });
  }
};