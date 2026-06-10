import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {
  CreateQuestionnaireScreen,
  EditQuestionnaireScreen,
} from '../screens/QuestionnaireFormScreens';
import EvaluationForms from '../screens/EvaluationForms';
import { savedEvaluation } from '../constants/preloadedSavedEvaluation';

export type HomeStackParamList = {
  Home: undefined;
  CreateQuestionnaire: undefined;
  EditQuestionnaire: { questionnaireId: string };
  EvaluationForms: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2563EB' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="CreateQuestionnaire"
      component={CreateQuestionnaireScreen}
      options={{ title: 'Nuevo cuestionario' }}
    />
    <Stack.Screen
      name="EditQuestionnaire"
      component={EditQuestionnaireScreen}
      options={{ title: 'Editar cuestionario' }}
    />
    <Stack.Screen
      name="EvaluationForms"
      options={{ headerShown: false }}
    >
      {() => <EvaluationForms evaluationMetadata={savedEvaluation} />}
    </Stack.Screen>
  </Stack.Navigator>
);