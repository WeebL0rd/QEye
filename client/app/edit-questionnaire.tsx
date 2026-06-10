import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QuestionnaireService, { UpdateQuestionnaireDTO } from '../src/services/questionnaireService';

export default function EditQuestionnaireScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await QuestionnaireService.getById(id);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setIsPublished(data.isPublished);
      } catch {
        Alert.alert('Error', 'No se pudo cargar el cuestionario.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es requerido.');
      return;
    }
    try {
      setSaving(true);
      const dto: UpdateQuestionnaireDTO = {
        title: title.trim(),
        description: description.trim(),
        isPublished,
      };
      await QuestionnaireService.update(id, dto);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Publicado</Text>
        <Switch
          value={isPublished}
          onValueChange={setIsPublished}
          trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
          thumbColor="#fff"
        />
      </View>
      <TouchableOpacity
        style={[styles.btn, saving && styles.btnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Guardar cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, padding: 14, fontSize: 15, color: '#111', marginBottom: 16,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24,
  },
  btn: { backgroundColor: '#2563EB', borderRadius: 10, padding: 15, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});