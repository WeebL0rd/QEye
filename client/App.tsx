import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import EvaluationForms from './src/screens/EvaluationForms';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { savedEvaluation } from './src/constants/preloadedSavedEvaluation';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a1aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
