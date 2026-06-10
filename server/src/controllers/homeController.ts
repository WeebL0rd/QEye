import { Request, Response } from 'express';
import QuestionnaireDAO from '../dao/questionnaireDAO.js';
import type { CreateQuestionnaireDTO, UpdateQuestionnaireDTO } from '../types/index.js';

export const getMyQuestionnaires = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await QuestionnaireDAO.findAllByOwner(req.user!.uid);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('[home/getAll]', error);
    res.status(500).json({ success: false, message: 'Error al obtener cuestionarios.' });
  }
};

export const getQuestionnaireById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const questionnaire = await QuestionnaireDAO.findById(id);
    if (!questionnaire) {
      res.status(404).json({ success: false, message: 'Cuestionario no encontrado.' });
      return;
    }
    if (questionnaire.ownerId !== req.user!.uid) {
      res.status(403).json({ success: false, message: 'Acceso denegado.' });
      return;
    }
    res.status(200).json({ success: true, data: questionnaire });
  } catch (error) {
    console.error('[home/getById]', error);
    res.status(500).json({ success: false, message: 'Error al obtener cuestionario.' });
  }
};

export const createQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const dto = req.body as CreateQuestionnaireDTO;
    if (!dto.title?.trim()) {
      res.status(400).json({ success: false, message: 'El título es requerido.' });
      return;
    }
    const questionnaire = await QuestionnaireDAO.create(req.user!.uid, dto);
    res.status(201).json({
      success: true,
      data: questionnaire,
      message: 'Cuestionario creado exitosamente.',
    });
  } catch (error) {
    console.error('[home/create]', error);
    res.status(500).json({ success: false, message: 'Error al crear cuestionario.' });
  }
};

export const updateQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const dto = req.body as UpdateQuestionnaireDTO;
    const isOwner = await QuestionnaireDAO.isOwner(id, req.user!.uid);
    if (!isOwner) {
      res.status(403).json({ success: false, message: 'Acceso denegado.' });
      return;
    }
    const updated = await QuestionnaireDAO.update(id, dto);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Cuestionario no encontrado.' });
      return;
    }
    res.status(200).json({ success: true, data: updated, message: 'Cuestionario actualizado.' });
  } catch (error) {
    console.error('[home/update]', error);
    res.status(500).json({ success: false, message: 'Error al actualizar cuestionario.' });
  }
};

export const deleteQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const isOwner = await QuestionnaireDAO.isOwner(id, req.user!.uid);
    if (!isOwner) {
      res.status(403).json({ success: false, message: 'Acceso denegado.' });
      return;
    }
    await QuestionnaireDAO.delete(id);
    res.status(200).json({ success: true, message: 'Cuestionario eliminado.' });
  } catch (error) {
    console.error('[home/delete]', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cuestionario.' });
  }
};