import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  BookmarkCheck,
  Search,
  Play,
  Copy,
  Terminal,
} from 'lucide-react';
import { CHEATSHEET } from '../data/cheatsheetData';

export default function Cheatsheet({ onExecuteCommand }) {
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

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BookmarkCheck size={18} color="#58a6ff" />
          <Text style={styles.titleText}>Interactive Docker Commands Cheatsheet</Text>
        </View>

        <View style={styles.searchBox}>
          <Search size={14} color="#8b949e" />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search commands (e.g. port, logs, network, compose)..."
            placeholderTextColor="#6e7681"
          />
        </View>
      </View>

      {/* Cheatsheet Categories List */}
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No matching commands found for "{searchTerm}".</Text>
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
                        title="Run in CLI"
                      >
                        <Play size={11} color="#ffffff" />
                        <Text style={styles.actionBtnText}>Run</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(item.cmd)}
                      >
                        <Copy size={11} color="#8b949e" />
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
    gap: 10,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f0f6fc',
    fontSize: 12,
    outlineStyle: 'none',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: 14,
    gap: 14,
  },
  categoryCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  categoryTitle: {
    color: '#58a6ff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsList: {
    gap: 8,
  },
  cmdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  cmdInfo: {
    flex: 1,
    minWidth: 200,
    gap: 2,
  },
  cmdText: {
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11.5,
    fontWeight: '600',
  },
  descText: {
    color: '#8b949e',
    fontSize: 11,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30363d',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 3,
  },
  copyBtnText: {
    color: '#c9d1d9',
    fontSize: 10,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8b949e',
    fontSize: 13,
  },
});
