import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { FileText } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

interface NotesCardProps {
  notes: string;
}

export default function NotesCard({ notes }: NotesCardProps) {
  if (!notes) return null;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <FileText size={18} color={colors.primary} />
        </View>
        <Text style={styles.title}>Clinical Notes</Text>
      </View>

      <View style={styles.content}>
        <Markdown style={markdownStyles}>
          {notes}
        </Markdown>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.xl,
    backgroundColor: '#FAFBFA',
    borderWidth: 1,
    borderColor: '#EAF2EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EAF2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.primary,
  },
  content: {
    paddingLeft: spacing.xs,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  heading1: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  heading3: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  strong: {
    fontWeight: '700',
    color: colors.text.primary,
  },
  bullet_list: {
    marginBottom: 12,
  },
  bullet_list_icon: {
    marginLeft: 0,
    marginRight: 8,
    marginTop: 6,
    color: colors.primary,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 12,
  },
});
