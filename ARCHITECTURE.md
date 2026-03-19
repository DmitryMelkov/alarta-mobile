# Архитектура приложения

## Структура проекта

Приложение следует упрощённой версии **Feature-Sliced Design (FSD)** с чётким разделением на слои:

```
alarta-mobile/
├── app/                          # Expo Router — только маршрутизация
│   ├── _layout.tsx               # Корневой layout с провайдерами
│   ├── index.tsx                 # Главная страница (dashboard selector)
│   ├── settings.tsx              # Настройки
│   └── mechanic-assist-details/  # Маршруты деталей (прокси-файлы)
│       ├── index.tsx
│       ├── status.tsx
│       ├── malfunction.tsx
│       └── maintenance.tsx
│
├── src/
│   ├── features/                 # Бизнес-фичи (самодостаточные модули)
│   │   ├── auth/                 # Авторизация
│   │   │   ├── api/              # Auth-specific API
│   │   │   ├── components/       # Auth UI компоненты
│   │   │   ├── hooks/            # Auth hooks
│   │   │   ├── screens/          # Auth экраны
│   │   │   └── utils/            # Auth утилиты
│   │   │
│   │   ├── mechanic-assist/      # Механик Ассист фича
│   │   │   ├── api/              # DTC API
│   │   │   ├── components/       # Карточки (MalfunctionsCard, StatusCard...)
│   │   │   ├── hooks/            # useMechanicAssistData
│   │   │   ├── screens/          # Экраны (MechanicAssistScreen, DetailsScreen...)
│   │   │   ├── utils/            # Расчёты статистик, трансформеры
│   │   │   └── types/            # Типы, специфичные для фичи
│   │   │
│   │   └── analytics/            # Аналитика (в разработке)
│   │       └── screens/
│   │
│   ├── shared/                   # Общий код, используемый в разных фичах
│   │   ├── api/                  # HTTP-клиент (axios instance, interceptors)
│   │   │   ├── client.ts
│   │   │   └── transport.ts
│   │   │
│   │   ├── components/           # Общие UI компоненты
│   │   │   ├── ui/               # Базовые UI компоненты (CardTitle, LoadingState)
│   │   │   ├── layout/           # Layout компоненты (DashboardLayout, Header...)
│   │   │   └── table/            # Таблицы (SimpleTable)
│   │   │
│   │   ├── lib/                  # Общие утилиты и функции
│   │   │   ├── auth.ts           # Проверка токенов
│   │   │   └── authValidation.ts # Валидация формы авторизации
│   │   │
│   │   ├── store/                # Глобальные Zustand store'ы
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   └── types/                # Общие типы TypeScript
│   │       ├── auth.ts
│   │       └── dtc.ts
│   │
│   └── theme/                    # Темизация и цвета
│       └── colors.ts
│
├── assets/                       # Статические ресурсы (изображения, шрифты)
│   └── img/
│
├── index.ts                      # Точка входа Expo
└── package.json
```

---

## Слои архитектуры

### 1. `app/` — Маршрутизация (Expo Router)

**Назначение:** Только определение маршрутов и навигации. Не содержит бизнес-логики.

**Правила:**

- Файлы экспортируют компоненты из `features/*/screens/`
- Для сложных экранов используются прокси-файлы
- `_layout.tsx` содержит все провайдеры (Paper, SafeArea, Zustand)

**Пример:**

```tsx
// app/index.tsx
import { MechanicAssistScreen } from '@features/mechanic-assist/screens/MechanicAssistScreen';

export default function HomeScreen() {
  return <MechanicAssistScreen />;
}
```

---

### 2. `src/features/` — Бизнес-фичи

**Назначение:** Самодостаточные модули, реализующие конкретную бизнес-возможность.

**Структура фичи:**

```
feature-name/
├── api/          # API, специфичное для фичи
├── components/   # UI компоненты фичи (карточки, таблицы)
├── hooks/        # React hooks фичи
├── screens/      # Полноценные экраны (бизнес-логика + UI)
├── utils/        # Утилиты и расчёты фичи
└── types/        # Типы, специфичные для фичи (опционально)
```

**Правила:**

- Фича импортирует только из `@shared/` и других `@features/`
- Фича **не должна** импортировать из `app/`
- Внутри фичи можно импортировать между своими папками
- Экраны (`screens/`) содержат навигационную логику (useRouter, useLocalSearchParams)

**Пример:**

```tsx
// src/features/mechanic-assist/screens/MechanicAssistScreen.tsx
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import { MalfunctionsCard } from '../components/MalfunctionsCard';
import { DashboardLayout } from '@shared/components/layout/DashboardLayout';

export const MechanicAssistScreen = () => {
  const { malfunctions, loading, error } = useMechanicAssistData();

  return (
    <DashboardLayout>
      <MalfunctionsCard data={malfunctions} loading={loading} error={error} />
    </DashboardLayout>
  );
};
```

---

### 3. `src/shared/` — Общие ресурсы

**Назначение:** Код, используемый в нескольких фичах.

#### Слои shared:

| Слой          | Назначение                      | Примеры                                |
| ------------- | ------------------------------- | -------------------------------------- |
| `api/`        | HTTP-клиент, базовые запросы    | `apiClient`, `fetchTransportAnalytics` |
| `components/` | UI компоненты общего назначения | `Button`, `Card`, `Table`, `Layout`    |
| `lib/`        | Утилиты, функции, валидации     | `isTokenExpired`, `validateAuthForm`   |
| `store/`      | Глобальные Zustand store'ы      | `authStore`, `uiStore`                 |
| `types/`      | Общие TypeScript типы           | `JwtPayload`, `DTCCar`, `ActiveDTC`    |

**Правила:**

- `shared` **не импортирует** из `features` или `app`
- `shared` импортирует только из других `shared/` папок или внешних библиотек
- Компоненты `shared` не должны содержать бизнес-логики фич

---

## Импорты и пути

### Настройки tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["app/*"],
      "@shared/*": ["src/shared/*"],
      "@features/*": ["src/features/*"],
      "@src/*": ["src/*"]
    }
  }
}
```

### Правила импортов

| Откуда → Куда                            | Можно? | Пример                                                                                          |
| ---------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `app/` → `@features/`                    | ✅     | `import { MechanicAssistScreen } from '@features/mechanic-assist/screens/MechanicAssistScreen'` |
| `app/` → `@shared/`                      | ✅     | `import { DashboardLayout } from '@shared/components/layout/DashboardLayout'`                   |
| `features/` → `@shared/`                 | ✅     | `import { LoadingState } from '@shared/components/LoadingState'`                                |
| `features/` → `@features/` (другая фича) | ⚠️     | Только если необходимо, лучше через shared                                                      |
| `shared/` → `@features/`                 | ❌     | Запрещено (нарушение слоёв)                                                                     |
| `shared/` → `app/`                       | ❌     | Запрещено                                                                                       |

---

## Навигация (Expo Router)

### Типы экранов

1. **Основные экраны** — находятся в `features/*/screens/`, импортируются в `app/`
2. **Экраны деталей** — находятся в `features/*/screens/`, имеют прокси в `app/*/`

### Пример маршрута с параметрами

```tsx
// app/mechanic-assist-details/malfunction.tsx (прокси)
export { default } from '@features/mechanic-assist/screens/MalfunctionDetailsScreen';

// app/_layout.tsx (настройка маршрута)
<Stack.Screen name="mechanic-assist-details/malfunction" options={{ presentation: 'card' }} />;

// features/mechanic-assist/screens/MalfunctionDetailsScreen.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MalfunctionDetailsScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();

  // ... логика
}
```

---

## Управление состоянием

### Zustand Store'ы

**Глобальные store'ы** находятся в `@shared/store/`:

- `authStore` — состояние авторизации (токены, пользователь)
- `uiStore` — UI состояние (тема, выбранная панель, сайдбар)

**Локальное состояние фичи** — через React hooks в `features/*/hooks/`:

```tsx
// src/features/mechanic-assist/hooks/useMechanicAssistData.ts
export const useMechanicAssistData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dtcCars, setDtcCars] = useState<DTCCar[] | null>(null);

  // ... логика загрузки данных

  return { loading, error, dtcCars /* ... */ };
};
```

---

## API слой

### Двухуровневая архитектура API

1. **`@shared/api/`** — базовый HTTP-клиент:
   - `client.ts` — axios instance с interceptors (авторизация, refresh токена)
   - `transport.ts` — общие транспортные функции

2. **`@features/*/api/`** — специфичное API фичи:
   - `dtcApi.ts` — методы для DTC данных

**Пример:**

```tsx
// @shared/api/client.ts
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// @features/mechanic-assist/api/dtcApi.ts
import { apiClient } from '@shared/api/client';

export const fetchDTCCars = async (): Promise<DTCCar[]> => {
  const response = await apiClient.post('/DTC/get-cars/', {});
  return response.data;
};
```

---

## Типы TypeScript

### Расположение типов

| Тип                     | Где хранить                         |
| ----------------------- | ----------------------------------- |
| Общие (JwtPayload, DTC) | `@shared/types/`                    |
| Специфичные для фичи    | `@features/*/types/` или в `utils/` |
| Props компонентов       | Внутри файла компонента             |

### Пример

```ts
// @shared/types/dtc.ts
export interface ActiveDTC {
  spn: number;
  fmi: number;
  severity: number;
}

// @features/mechanic-assist/utils/malfunctionsStats.ts
export type MalfunctionsStats = {
  critical: number;
  important: number;
  minor: number;
};
```

---

## Добавление новой фичи

### Чек-лист

1. **Создать папку фичи:**

   ```bash
   mkdir src/features/new-feature/{api,components,hooks,screens,utils}
   ```

2. **Создать экран:**

   ```tsx
   // src/features/new-feature/screens/NewFeatureScreen.tsx
   export const NewFeatureScreen = () => {
     // ...
   };
   ```

3. **Добавить маршрут в app/:**

   ```tsx
   // app/new-feature.tsx
   export { default } from '@features/new-feature/screens/NewFeatureScreen';
   ```

4. **Настроить маршрут в \_layout.tsx:**

   ```tsx
   <Stack.Screen name="new-feature" />
   ```

5. **Добавить навигацию в Dashboard:**
   - Обновить `@shared/store/uiStore.ts` (добавить DashboardId)
   - Обновить `@shared/components/layout/Sidebar.tsx` и `SidebarOverlay.tsx`
   - Обновить `app/index.tsx`

---

## Лучшие практики

### ✅ Делать

- Компоненты `shared` должны быть переиспользуемыми и без бизнес-логики
- Хуки `features/*/hooks/` инкапсулируют всю логику загрузки данных
- Экраны `features/*/screens/` содержат навигацию и композицию компонентов
- Использовать TypeScript строго (no implicit any)
- Следовать принципу единой ответственности

### ❌ Не делать

- Не импортировать из `features` в `shared`
- Не размещать бизнес-логику в UI компонентах `shared`
- Не дублировать типы — выносить в `@shared/types/`
- Не хранить состояние в `app/` файлах

---

## Миграция и обратная совместимость

### Старые импорты (не используются)

| Старый путь      | Новый путь                 |
| ---------------- | -------------------------- |
| `@store/*`       | `@shared/store/*`          |
| `@components/*`  | `@shared/components/*`     |
| `@api/*`         | `@shared/api/*`            |
| `@src/utils/*`   | `@shared/lib/*`            |
| `@src/types/*`   | `@shared/types/*`          |
| `@src/screens/*` | `@features/auth/screens/*` |

---

## Инструменты

### Команды разработки

```bash
npm run start       # Expo dev server
npm run lint        # ESLint проверка
npm run lint:fix    # ESLint исправление
npm run format      # Prettier форматирование
npm run typecheck   # TypeScript проверка
```

### Pre-commit hooks

Настроены через `husky` + `lint-staged`:

- ESLint для `.ts,.tsx,.js,.jsx`
- Prettier для всех файлов

---
