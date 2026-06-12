import jwt from 'jsonwebtoken';
import { getAuth } from '../config/firebase.js';
import UserDAO from '../dao/userDAO.js';
import config from '../config/environment.js';

const signToken = (uid, email) =>
  jwt.sign({ uid, email }, config.jwt.secret, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    console.log('BODY RECIBIDO:', req.body);
    if (!email || !password || !displayName) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
    }

    const user = await UserDAO.createUser(email, password, displayName);
    const token = signToken(user.id, user.email);

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    // Firebase lanza este código si el email ya existe
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ success: false, message: 'El email ya está registrado.' });
    }
    console.error('register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
    }

    // Firebase Admin NO verifica passwords directamente.
    // Se usa la REST API de Firebase Auth para verificar credenciales.
    const apiKey = process.env.FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error?.message || 'Credenciales inválidas';
      return res.status(401).json({ success: false, message: msg });
    }

    const profile = await UserDAO.getProfile(data.localId);
    const token = signToken(data.localId, email);

    res.json({ success: true, token, user: profile });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await UserDAO.getProfile(req.user.uid);
    if (!profile) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    res.json({ success: true, user: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};