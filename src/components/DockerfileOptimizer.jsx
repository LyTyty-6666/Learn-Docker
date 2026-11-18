import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/optimizer.styles';
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

export default function DockerfileOptimizer({ onExecuteCommand }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
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
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.titleRow}>
          <FileCode size={18} color={colors.primary} />
          <Text style={[styles.titleText, { color: colors.text }]}>{t('optimizerTitle', 'Dockerfile Server Linter & Optimizer')}</Text>
        </View>
        <Text style={[styles.subtitleText, { color: colors.textMuted }]}>
          {t('optimizerSubtitle', "Audit your server's Dockerfile for layer caching, non-root security, host binding, and small image footprints.")}
        </Text>

        {/* Template Selectors */}
        <View style={styles.templatesRow}>
          {DOCKERFILE_TEMPLATES.map((tmpl, idx) => {
            const isSelected = idx === selectedTemplateIndex;
            return (
              <TouchableOpacity
                key={tmpl.id}
                style={[
                  styles.templateBtn,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  isSelected && [styles.templateBtnActive, { backgroundColor: colors.primaryBg, borderColor: colors.primary }]
                ]}
                onPress={() => handleSelectTemplate(idx)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.templateBtnText,
                  { color: colors.textSub },
                  isSelected && [styles.templateBtnTextActive, { color: colors.primary }]
                ]}>
                  {tmpl.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
        {/* Editor & Actions */}
        <View style={[styles.editorCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={[styles.editorToolbar, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
            <View style={[styles.fileTab, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <FileCode size={12} color={colors.primary} />
              <Text style={[styles.fileTabText, { color: colors.text }]}>Dockerfile</Text>
              {isOptimized && (
                <View style={[styles.optimizedBadge, { backgroundColor: colors.successBg }]}>
                  <Text style={[styles.optimizedBadgeText, { color: colors.success }]}>OPTIMIZED</Text>
                </View>
              )}
            </View>

            <View style={styles.toolbarActions}>
              {!isOptimized ? (
                <TouchableOpacity
                  style={[styles.optimizeBtn, { backgroundColor: colors.primary }]}
                  onPress={handleApplyOptimization}
                  activeOpacity={0.8}
                >
                  <Sparkles size={13} color="#ffffff" />
                  <Text style={styles.optimizeBtnText}>{t('autoOptimizeBtn', 'Auto-Optimize Dockerfile')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.resetBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={12} color={colors.textMuted} />
                  <Text style={[styles.resetBtnText, { color: colors.text }]}>{t('restoreOriginalBtn', 'Restore Original')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} onPress={handleCopy}>
                <Copy size={12} color={colors.textMuted} />
                <Text style={[styles.copyBtnText, { color: colors.text }]}>{copied ? t('copiedBtn', 'Copied!') : t('copyBtn', 'Copy')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dockerfile Code Editor Area */}
          <TextInput
            style={[
              styles.codeEditor,
              { backgroundColor: isDark ? '#0d1117' : '#F3EDE4', color: isDark ? '#c9d1d9' : '#1C1917' }
            ]}
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
        <View style={[styles.suggestionsCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.suggestionsHeader}>
            <Sparkles size={16} color={colors.warning} />
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
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
                    { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder },
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
                    <Text style={[styles.sugTitle, { color: colors.text }]}>{item.title}</Text>
                  </View>
                  <Text style={[styles.sugDesc, { color: colors.textSub }]}>{item.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
