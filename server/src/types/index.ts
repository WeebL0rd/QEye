// User

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateUserDTO {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Questionnaire

export type QuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'true_false'
  | 'rating'
  | 'open_ended';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
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
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
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

// Auth

export interface AuthResponse {
  token: string;
  user: Omit<User, 'createdAt' | 'updatedAt'>;
}

// API generics

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;