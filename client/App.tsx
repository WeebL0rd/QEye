import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import EvaluationForms from './src/screens/EvaluationForms';

export default function App() {
  return (<EvaluationForms/>
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
