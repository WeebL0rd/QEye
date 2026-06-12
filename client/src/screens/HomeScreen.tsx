import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useTheme, spacing, radius, typography } from '../styles/theme' 
import api from '../services/api';

type EvaluationItem = {
  id: string;
  userId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  scores: { criterionId: number; score: number }[];
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const HomeScreen = () => {
  const theme = useTheme();
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/docs');
      if (response.data.success) {
        setItems(response.data.documents);
      }
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchDocuments();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleEdit = (item: EvaluationItem) => {
    router.push({
      pathname: '/form',
      params: { evaluation: JSON.stringify(item) },
    });
  };

  const handleDelete = (item: EvaluationItem) => {
    Alert.alert(
      'Eliminar evaluación',
      `¿Estás seguro que querés eliminar "${item.projectName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/docs/delete/${item.id}`);
              setItems(prev => prev.filter(i => i.id !== item.id));
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar la evaluación.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: EvaluationItem }) => (
    <View style={[styles.card, {
      backgroundColor: theme.surface,
      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: theme.shadow.offset,
      elevation: theme.shadow.elevation,
    }]}>
      <View style={styles.cardHeader}>
        <Text
          style={[typography.body, styles.cardTitle, { color: theme.text.primary }]}
          numberOfLines={1}
        >
          {item.projectName}
        </Text>
        <Text style={[typography.small, { color: theme.text.secondary }]}>
          {formatDate(item.updatedAt)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.dashboardBtn, { backgroundColor: theme.accent }]}
        onPress={() => router.push(`/dashboard/${item.id}`)}
      >
        <Text style={[typography.small, { color: theme.text.onPrimary, fontWeight: '600' }]}>
          Ver dashboard
        </Text>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primarySoft }]}
          onPress={() => handleEdit(item)}
        >
          <Text style={[typography.small, { color: theme.primary, fontWeight: '600' }]}>
            Editar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[typography.small, { color: theme.accent, fontWeight: '600' }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, {
        backgroundColor: theme.surface,
        borderBottomColor: theme.border,
      }]}>
        <View>
          <Text style={[typography.h1, { color: theme.accent }]}>Qeye</Text>
          <Text style={[typography.small, { color: theme.text.secondary, marginTop: 2 }]}>
            Mis evaluaciones
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: '#FEE2E2' }]}
          onPress={() => router.replace('/login')}
        >
          <Text style={[typography.small, { color: '#DC2626', fontWeight: '700' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[typography.h3, { color: theme.text.secondary, marginBottom: spacing.sm }]}>
                Sin evaluaciones
              </Text>
              <Text style={[typography.small, styles.emptySubtitle, { color: theme.text.disabled }]}>
                Toca el botón + para crear tu primera evaluación
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => router.push('/form')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  logoutBtn: {
    paddingVertical: spacing.xs + 7,
    paddingHorizontal: spacing.sm + spacing.xs,
    borderRadius: radius.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  dashboardBtn: {
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptySubtitle: {
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '300',
  },
});

export default HomeScreen;