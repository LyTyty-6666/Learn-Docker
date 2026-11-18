import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
import { createStyles } from '../styles/cheatsheet.styles';

export default function Cheatsheet({ onExecuteCommand }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

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
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <BookmarkCheck size={18} color={colors.primary} />
            <Text style={styles.titleText}>{t('cheatsheetTitle', 'Interactive Docker Commands Cheatsheet')}</Text>
          </View>
          <View style={styles.matchCountBadge}>
            <Text style={styles.matchCountText}>{totalMatches} {t('commandsLabel', 'Commands')}</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Search size={14} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
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
            <Text style={styles.emptyText}>{t('noMatchingCommands', 'No matching commands found for')} "{searchTerm}".</Text>
          </View>
        ) : (
          filteredCategories.map((cat, idx) => (
            <View key={idx} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{cat.category}</Text>

              <View style={styles.itemsList}>
                {cat.items.map((item, itemIdx) => (
                  <View key={itemIdx} style={styles.cmdRow}>
                    <View style={styles.cmdInfo}>
                      <Text style={styles.cmdText} selectable={true}>
                        {item.cmd}
                      </Text>
                      <Text style={styles.descText}>{item.desc}</Text>
                    </View>

                    <View style={styles.actionsGroup}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => onExecuteCommand(item.cmd)}
                        activeOpacity={0.8}
                      >
                        <Play size={11} color="#ffffff" />
                        <Text style={styles.actionBtnText}>Run</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(item.cmd)}
                        activeOpacity={0.7}
                      >
                        <Copy size={11} color={colors.textMuted} />
                        <Text style={styles.copyBtnText}>
                          {copiedCmd === item.cmd ? 'Copied' : 'Copy'}
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
