import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  FileCode,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Play,
  RotateCcw,
} from 'lucide-react';
import { DOCKERFILE_TEMPLATES } from '../data/doctorData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { createStyles } from '../styles/optimizer.styles';

export default function DockerfileOptimizer({ onExecuteCommand }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors, isDark);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const template = DOCKERFILE_TEMPLATES[selectedTemplateIndex];

  const [dockerfileCode, setDockerfileCode] = useState(template.initialCode);
  const [isOptimized, setIsOptimized] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (idx) => {
    setSelectedTemplateIndex(idx);
    setDockerfileCode(DOCKERFILE_TEMPLATES[idx].initialCode);
    setIsOptimized(false);
  };

  const handleApplyOptimization = () => {
    setDockerfileCode(template.optimizedCode);
    setIsOptimized(true);
  };

  const handleReset = () => {
    setDockerfileCode(template.initialCode);
    setIsOptimized(false);
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(dockerfileCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FileCode size={18} color={colors.primary} />
          <Text style={styles.titleText}>{t('optimizerTitle', 'Dockerfile Server Linter & Optimizer')}</Text>
        </View>
        <Text style={styles.subtitleText}>
          {t('optimizerSubtitle', "Audit your server's Dockerfile for layer caching, non-root security, host binding, and small image footprints.")}
        </Text>

        {/* Template Selectors */}
        <View style={styles.templatesRow}>
          {DOCKERFILE_TEMPLATES.map((tmpl, idx) => {
            const isSelected = idx === selectedTemplateIndex;
            return (
              <TouchableOpacity
                key={tmpl.id}
                style={[styles.templateBtn, isSelected && styles.templateBtnActive]}
                onPress={() => handleSelectTemplate(idx)}
                activeOpacity={0.8}
              >
                <Text style={[styles.templateBtnText, isSelected && styles.templateBtnTextActive]}>
                  {tmpl.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
        {/* Editor & Actions */}
        <View style={styles.editorCard}>
          <View style={styles.editorToolbar}>
            <View style={styles.fileTab}>
              <FileCode size={12} color={colors.primary} />
              <Text style={styles.fileTabText}>Dockerfile</Text>
              {isOptimized && (
                <View style={styles.optimizedBadge}>
                  <Text style={styles.optimizedBadgeText}>OPTIMIZED</Text>
                </View>
              )}
            </View>

            <View style={styles.toolbarActions}>
              {!isOptimized ? (
                <TouchableOpacity
                  style={styles.optimizeBtn}
                  onPress={handleApplyOptimization}
                  activeOpacity={0.8}
                >
                  <Sparkles size={13} color="#ffffff" />
                  <Text style={styles.optimizeBtnText}>{t('autoOptimizeBtn', 'Auto-Optimize Dockerfile')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={12} color={colors.textMuted} />
                  <Text style={styles.resetBtnText}>{t('restoreOriginalBtn', 'Restore Original')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Copy size={12} color={colors.textMuted} />
                <Text style={styles.copyBtnText}>{copied ? t('copiedBtn', 'Copied!') : t('copyBtn', 'Copy')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dockerfile Code Editor Area */}
          <TextInput
            style={styles.codeEditor}
            value={dockerfileCode}
            onChangeText={(txt) => {
              setDockerfileCode(txt);
              setIsOptimized(false);
            }}
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        {/* Suggestion & Linter Findings */}
        <View style={styles.suggestionsCard}>
          <View style={styles.suggestionsHeader}>
            <Sparkles size={16} color={colors.warning} />
            <Text style={styles.suggestionsTitle}>
              {t('auditReportTitle', 'Docker Doctor Findings')} ({template.suggestions.length})
            </Text>
          </View>

          <View style={styles.suggestionsList}>
            {template.suggestions.map((item, idx) => {
              const isWarning = item.type === 'warning';
              const isSecurity = item.type === 'security';
              return (
                <View
                  key={idx}
                  style={[
                    styles.suggestionItem,
                    isWarning && styles.suggestionWarning,
                    isSecurity && styles.suggestionSecurity,
                  ]}
                >
                  <View style={styles.sugHeader}>
                    {isSecurity ? (
                      <ShieldCheck size={14} color={colors.danger} />
                    ) : (
                      <AlertTriangle size={14} color={colors.warning} />
                    )}
                    <Text style={styles.sugTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.sugDesc}>{item.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
