import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QuestionnaireService, { Questionnaire } from '../services/questionnaireService';
import { useAuth } from '../context/AuthContext';
import type { HomeStackParamList } from '../navigation/HomeNavigator';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
  const { user, logout } = useAuth();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuestionnaires = useCallback(async () => {
    try {
      const data = await QuestionnaireService.getAll();
      setQuestionnaires(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los cuestionarios.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchQuestionnaires();
    }, [fetchQuestionnaires]),
  );

  const handleDelete = (item: Questionnaire) => {
    Alert.alert(
      'Eliminar cuestionario',
      `¿Estás seguro de que deseas eliminar "${item.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await QuestionnaireService.delete(item.id);
              setQuestionnaires((prev) => prev.filter((q) => q.id !== item.id));
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el cuestionario.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Questionnaire }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.badge, item.isPublished ? styles.badgePublished : styles.badgeDraft]}>
          <Text style={styles.badgeText}>{item.isPublished ? 'Publicado' : 'Borrador'}</Text>
        </View>
      </View>

      {item.description
        ? <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        : null}

      <Text style={styles.cardMeta}>
        {item.questions.length} pregunta{item.questions.length !== 1 ? 's' : ''} ·{' '}
        {item.responseCount} respuesta{item.responseCount !== 1 ? 's' : ''}
      </Text>

      <View style={styles.cardActions}>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionEdit]}
          onPress={() => navigation.navigate('EditQuestionnaire', { questionnaireId: item.id })}
        >
          <Text style={styles.actionBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDelete]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionBtnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.displayName?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerSubtitle}>Mis cuestionarios</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={questionnaires}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchQuestionnaires(); }}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin cuestionarios</Text>
              <Text style={styles.emptySubtitle}>
                Toca el botón + para crear tu primer cuestionario
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateQuestionnaire')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 56,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  greeting: { fontSize: 18, fontWeight: '700', color: '#111' },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  logoutBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#FEE2E2' },
  logoutText: { color: '#DC2626', fontWeight: '600', fontSize: 13 },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  badgePublished: { backgroundColor: '#D1FAE5' },
  badgeDraft: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#374151' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  cardMeta: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  actionDashboard: { backgroundColor: '#EFF6FF' },
  actionEdit: { backgroundColor: '#F0FDF4' },
  actionDelete: { backgroundColor: '#FEF2F2' },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 32 },
  fab: {
    position: 'absolute', bottom: 28, right: 24, width: 58, height: 58,
    borderRadius: 29, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '300' },
});

export default HomeScreen;