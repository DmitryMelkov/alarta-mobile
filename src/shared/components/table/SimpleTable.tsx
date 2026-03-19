import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { COLORS } from '@src/theme/colors';

export type TableAlign = 'left' | 'center' | 'right';

export type TableColumn<T extends Record<string, unknown>> = {
  key: keyof T | string;
  title: string;
  flex?: number;
  width?: number;
  align?: TableAlign;
  render?: (value: unknown, row: T) => React.ReactNode;
};

export type SimpleTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor?: (item: T, index: number) => string;
  onRowPress?: (row: T) => void;
  maxHeight?: number;
  scrollEnabled?: boolean;
};

export const SimpleTable = <T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  onRowPress,
  maxHeight,
  scrollEnabled = true,
}: SimpleTableProps<T>) => {
  const theme = useTheme();

  const getCellContent = (column: TableColumn<T>, row: T) => {
    const rawValue =
      typeof column.key === 'string' && column.key in row
        ? (row as Record<string, unknown>)[column.key]
        : undefined;

    if (column.render) {
      return column.render(rawValue, row);
    }

    if (rawValue == null) return '';
    if (typeof rawValue === 'string' || typeof rawValue === 'number') return String(rawValue);
    return JSON.stringify(rawValue);
  };

  const renderHeader = () => (
    <View
      style={[
        styles.headerRow,
        {
          backgroundColor: COLORS.clearChill,
          borderBottomWidth: 0,
        },
      ]}
    >
      {columns.map((column) => (
        <View
          key={String(column.key)}
          style={[
            styles.cell,
            {
              flex: column.flex ?? (column.width ? 0 : 1),
              width: column.width,
            },
          ]}
        >
          <Text
            variant="labelMedium"
            style={[
              styles.headerText,
              {
                color: COLORS.white,
                textAlign: column.align ?? 'left',
              },
            ]}
            numberOfLines={1}
          >
            {column.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item, index }: { item: T; index: number }) => {
    const Container = onRowPress ? TouchableOpacity : View;

    return (
      <Container
        onPress={onRowPress ? () => onRowPress(item) : undefined}
        style={[
          styles.row,
          {
            borderBottomColor: '#e1e4e8',
            backgroundColor: index % 2 === 0 ? theme.colors.surface : theme.colors.background,
          },
        ]}
      >
        {columns.map((column) => {
          const content = getCellContent(column, item);

          return (
            <View
              key={String(column.key)}
              style={[
                styles.cell,
                {
                  flex: column.flex ?? (column.width ? 0 : 1),
                  width: column.width,
                },
              ]}
            >
              {column.render ? (
                content
              ) : (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.cellText,
                    {
                      textAlign: column.align ?? 'left',
                      color: theme.colors.onSurface,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {content}
                </Text>
              )}
            </View>
          );
        })}
      </Container>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={(item, index) => (keyExtractor ? keyExtractor(item, index) : String(index))}
        renderItem={renderItem}
        style={maxHeight ? { maxHeight } : undefined}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={scrollEnabled && data.length > 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cell: {
    paddingHorizontal: 4,
  },
  headerText: {
    fontWeight: '600',
  },
  cellText: {
    fontSize: 13,
  },
  listContent: {
    flexGrow: 0,
  },
  separator: {
    height: 0,
  },
});

export type { TableColumn as SimpleTableColumn };
