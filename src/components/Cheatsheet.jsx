import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/cheatsheet.styles';
import {
  BookmarkCheck,
  Search,
  Play,
  Copy,
  Terminal,
  X,
} from 'lucide-react';
import { CHEATSHEET } from '../data/cheatsheetData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Cheatsheet({ onExecuteCommand }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);

  const handleCopy = (cmd) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd(null), 1500);
    }
  };

  const filteredCategories = CHEATSHEET.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  const totalMatches = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Header with Search */}
      <View style={[styles.header, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <BookmarkCheck size={18} color={colors.primary} />
            <Text style={[styles.titleText, { color: colors.text }]}>{t('cheatsheetTitle', 'Interactive Docker Commands Cheatsheet')}</Text>
          </View>
          <View style={[styles.matchCountBadge, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.matchCountText, { color: colors.primary }]}>{totalMatches} {t('commandsLabel', 'Commands')}</Text>
          </View>
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Search size={14} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={t('searchCommandsPlaceholder', 'Search commands (e.g. port, logs, network, compose)...')}
            placeholderTextColor={colors.textMuted}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearSearchBtn}>
              <X size={13} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cheatsheet Categories List */}
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('noMatchingCommands', 'No matching commands found for')} "{searchTerm}".</Text>
          </View>
        ) : (
          filteredCategories.map((cat, idx) => (
            <View key={idx} style={[styles.categoryCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.categoryTitle, { color: colors.primary }]}>{cat.category}</Text>

              <View style={styles.itemsList}>
                {cat.items.map((item, itemIdx) => (
                  <View key={itemIdx} style={[styles.cmdRow, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}>
                    <View style={styles.cmdInfo}>
                      <Text style={[styles.cmdText, { color: colors.text }]} selectable={true}>
                        {item.cmd}
                      </Text>
                      <Text style={[styles.descText, { color: colors.textSub }]}>{item.desc}</Text>
                    </View>

                    <View style={styles.actionsGroup}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                        onPress={() => onExecuteCommand(item.cmd)}
                        title="Run in CLI"
                      >
                        <Play size={11} color="#ffffff" />
                        <Text style={styles.actionBtnText}>{t('runBtn', 'Run')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.copyBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                        onPress={() => handleCopy(item.cmd)}
                      >
                        <Copy size={11} color={colors.textMuted} />
                        <Text style={[styles.copyBtnText, { color: colors.text }]}>
                          {copiedCmd === item.cmd ? t('copiedBtn', 'Copied') : t('copyBtn', 'Copy')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
