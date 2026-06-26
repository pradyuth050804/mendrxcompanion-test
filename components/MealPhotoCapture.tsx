import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { Camera, X, RotateCcw, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface MealPhotoCaptureProps {
  visible: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onClose: () => void;
  onSuccess: () => void;
}

export default function MealPhotoCapture({
  visible,
  mealType,
  onClose,
  onSuccess,
}: MealPhotoCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const [mealSource, setMealSource] = useState<'homemade' | 'outside'>('homemade');
  const [saving, setSaving] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        setPhoto(photoData.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleSave = async () => {
    if (!photo) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('meal_photos').insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_type: mealType,
        photo_url: photo,
        meal_source: mealSource,
        meal_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error saving meal photo:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPhoto(null);
    setMealSource('homemade');
    onClose();
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Camera Permission</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.permissionContainer}>
            <Camera size={64} color={colors.text.light} />
            <Text style={styles.permissionTitle}>Camera Access Needed</Text>
            <Text style={styles.permissionText}>
              We need access to your camera to take meal photos
            </Text>
            <Button title="Grant Permission" onPress={requestPermission} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {!photo ? (
          <>
            <View style={styles.cameraContainer}>
              {Platform.OS !== 'web' ? (
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                />
              ) : (
                <View style={[styles.camera, styles.webCameraPlaceholder]}>
                  <Camera size={64} color={colors.text.light} />
                  <Text style={styles.webCameraText}>
                    Camera not available on web
                  </Text>
                  <Text style={styles.webCameraSubtext}>
                    Please use a mobile device
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.controls}>
              {Platform.OS !== 'web' && (
                <>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleCameraFacing}
                  >
                    <RotateCcw size={24} color={colors.white} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={handleTakePhoto}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>

                  <View style={{ width: 60 }} />
                </>
              )}
            </View>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photo }} style={styles.previewImage} />

            <View style={styles.infoSection}>
              <Card style={styles.infoCard}>
                <Text style={styles.infoTitle}>Meal Source</Text>
                <View style={styles.optionGroup}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      mealSource === 'homemade' && styles.optionSelected,
                    ]}
                    onPress={() => setMealSource('homemade')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        mealSource === 'homemade' && styles.optionTextSelected,
                      ]}
                    >
                      Homemade
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      mealSource === 'outside' && styles.optionSelected,
                    ]}
                    onPress={() => setMealSource('outside')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        mealSource === 'outside' && styles.optionTextSelected,
                      ]}
                    >
                      Outside
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <View style={styles.actionButtons}>
              <Button
                title="Retake"
                onPress={handleRetake}
                variant="outline"
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.md }} />
              <Button
                title={saving ? 'Saving...' : 'Save'}
                onPress={handleSave}
                disabled={saving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  permissionText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.text.primary,
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.border,
  },
  webCameraText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  webCameraSubtext: {
    ...typography.small,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.card,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '50%',
    backgroundColor: colors.border,
  },
  infoSection: {
    flex: 1,
    padding: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
