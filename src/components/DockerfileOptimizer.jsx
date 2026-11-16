import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
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

export default function DockerfileOptimizer({ onExecuteCommand }) {
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
          <FileCode size={18} color="#58a6ff" />
          <Text style={styles.titleText}>Dockerfile Server Linter & Optimizer</Text>
        </View>
        <Text style={styles.subtitleText}>
          Audit your server's Dockerfile for layer caching, non-root security, host binding, and small image footprints.
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
              <FileCode size={12} color="#58a6ff" />
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
                  <Text style={styles.optimizeBtnText}>Auto-Optimize Dockerfile</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={12} color="#8b949e" />
                  <Text style={styles.resetBtnText}>Restore Original</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Copy size={12} color="#8b949e" />
                <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy'}</Text>
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
            <Sparkles size={16} color="#e3b341" />
            <Text style={styles.suggestionsTitle}>
              Docker Doctor Findings ({template.suggestions.length})
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
                      <ShieldCheck size={14} color="#f85149" />
                    ) : (
                      <AlertTriangle size={14} color="#e3b341" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 14,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: '#f0f6fc',
    fontSize: 15,
    fontWeight: '700',
  },
  subtitleText: {
    color: '#8b949e',
    fontSize: 12,
  },
  templatesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  templateBtn: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  templateBtnActive: {
    borderColor: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
  },
  templateBtnText: {
    color: '#8b949e',
    fontSize: 12,
    fontWeight: '600',
  },
  templateBtnTextActive: {
    color: '#58a6ff',
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: 14,
    gap: 14,
  },
  editorCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    overflow: 'hidden',
  },
  editorToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#21262d',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexWrap: 'wrap',
    gap: 8,
  },
  fileTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161b22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fileTabText: {
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  optimizedBadge: {
    backgroundColor: 'rgba(63, 185, 80, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  optimizedBadgeText: {
    color: '#3fb950',
    fontSize: 9,
    fontWeight: '800',
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  optimizeBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30363d',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  resetBtnText: {
    color: '#c9d1d9',
    fontSize: 11,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30363d',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  copyBtnText: {
    color: '#c9d1d9',
    fontSize: 11,
  },
  codeEditor: {
    backgroundColor: '#090d12',
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
    minHeight: 220,
    outlineStyle: 'none',
  },
  suggestionsCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 10,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  suggestionsTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionItem: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    gap: 4,
  },
  suggestionWarning: {
    borderLeftWidth: 3,
    borderLeftColor: '#e3b341',
  },
  suggestionSecurity: {
    borderLeftWidth: 3,
    borderLeftColor: '#f85149',
  },
  sugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sugTitle: {
    color: '#f0f6fc',
    fontSize: 12,
    fontWeight: '700',
  },
  sugDesc: {
    color: '#8b949e',
    fontSize: 11,
    lineHeight: 16,
  },
});
