import api from './api';

export interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false' | 'rating' | 'open_ended';
  text: string;
  options?: { id: string; text: string; isCorrect?: boolean }[];
  required: boolean;
  order: number;
}

export interface Questionnaire {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  questions: Question[];
  isPublished: boolean;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionnaireDTO {
  title: string;
  description?: string;
  questions?: Question[];
}

export interface UpdateQuestionnaireDTO {
  title?: string;
  description?: string;
  questions?: Question[];
  isPublished?: boolean;
}

const QuestionnaireService = {
  async getAll(): Promise<Questionnaire[]> {
    const { data } = await api.get<{ success: boolean; data: Questionnaire[] }>(
      '/home/questionnaires',
    );
    return data.data;
  },

  async getById(id: string): Promise<Questionnaire> {
    const { data } = await api.get<{ success: boolean; data: Questionnaire }>(
      `/home/questionnaires/${id}`,
    );
    return data.data;
  },

  async create(dto: CreateQuestionnaireDTO): Promise<Questionnaire> {
    const { data } = await api.post<{ success: boolean; data: Questionnaire }>(
      '/home/questionnaires',
      dto,
    );
    return data.data;
  },

  async update(id: string, dto: UpdateQuestionnaireDTO): Promise<Questionnaire> {
    const { data } = await api.put<{ success: boolean; data: Questionnaire }>(
      `/home/questionnaires/${id}`,
      dto,
    );
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/home/questionnaires/${id}`);
  },
};

export default QuestionnaireService;