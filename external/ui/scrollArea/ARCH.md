# ScrollArea Component - Техническое задание

Компонент расширенной области прокрутки с автоматическим скроллом и интеллектуальным управлением позиционированием на базе Mantine Scrollarea.

## Архитектура компонента

### Составная структура

- `ScrollArea` - корневой контейнер с провайдером контекста
- `ScrollArea.ScrollButton` - опциональная адаптивная кнопка управления прокруткой
- `ScrollArea.Provider` - контекст для передачи состояния между компонентами
- `ScrollArea.Content` - внутренний приватный компонент (не экспортируется)

## Интерфейсы и типы

### Основные пропсы ScrollArea

```typescript
interface ScrollAreaProps extends Omit<MantineScrollAreaProps, "children"> {
  autoScroll?: boolean; // Включение автоскролла (по умолчанию false)
  scrollToBottomOnInit?: boolean; // Прокрутить к концу при инициализации (по умолчанию false)
  animated?: boolean; // Анимированная прокрутка (по умолчанию true)
  nearThreshold?: number; // Отступ для near-зон в пикселях (по умолчанию 100)
  children: ReactNode;
}
```

### Публичный API (useScrollArea)

```typescript
interface ScrollAreaHook {
  // Индикаторы позиции
  isAtTop: boolean; // Точно в начале (scrollTop === 0)
  isNearTop: boolean; // В пределах nearThreshold от начала
  isAtBottom: boolean; // Точно в конце (scrollTop + clientHeight >= scrollHeight)
  isNearBottom: boolean; // В пределах nearThreshold от конца
  isAboveCenter: boolean; // Выше центральной точки области прокрутки
  hasScrollableContent: boolean; // Есть контент требующий прокрутки

  // Методы управления
  scrollToTop: (animated?: boolean) => void;
  scrollToBottom: (animated?: boolean) => void;

  // Доступ к viewport элементу
  viewportRef: React.RefObject<HTMLDivElement | null>;
}
```

### Внутреннее состояние (useScrollAreaState)

```typescript
interface ScrollAreaState extends ScrollAreaHook {
  _callbackRef: (node: HTMLDivElement | null) => void; // для подключения к Mantine
}

interface ScrollAreaContextValue extends ScrollAreaState {
  mantineProps: Omit<MantineScrollAreaProps, "children">; // пропсы Mantine
}
```

## Логика отслеживания позиции

### Расчет состояний позиции

- Отслеживание через событие `scroll` на viewport элементе
- Дебаунсинг через `useDebouncedCallback` (16ms для 60fps)
- Расчет всех индикаторов позиции на основе `scrollTop`, `clientHeight`, `scrollHeight`
- Использование `nearThreshold` для определения `isNearTop` и `isNearBottom`

### Отслеживание изменений контента

- `useResizeObserver` от Mantine для отслеживания изменений размера
- `MutationObserver` для детекции изменений DOM
- `useMergedRef` для объединения refs (scrollAreaRef + resizeRef)
- Перерасчет состояний при изменении размеров

## Автоскролл логика

### Прокрутка при инициализации (scrollToBottomOnInit)

**Условия активации:**

- `scrollToBottomOnInit === true` (независимо от autoScroll)
- `hasScrollableContent === true`

**Поведение:**

- Выполняется при первом рендере с прокручиваемым контентом
- Использует анимацию (если `animated !== false`)
- Прокручивает к концу области

### Автоскролл при добавлении контента

**Условия активации:**

1. `autoScroll === true`
2. `isAtBottom === true` (точное позиционирование, НЕ near!)
3. `!isUserInteracting` (нет активного взаимодействия)

**Поведение:**

- Выполняется мгновенно (instant, без анимации)
- Сохраняет позицию в конце при добавлении нового контента

### Блокировка автоскролла

**Детекция пользовательского взаимодействия:**

- События: `wheel`, `touchstart`, `touchmove`, `mousedown` на области прокрутки
- Установка флага `isUserInteracting = true`
- Автоматический сброс через таймаут (например, 150ms после последнего события)

## Методы управления прокруткой

### scrollToTop(animated?: boolean)

- Прокрутка к началу области
- Использует параметр `animated` или дефолтное значение из пропсов
- Реализация через `element.scrollTo()` с `behavior: 'smooth'` или прямое управление `scrollTop`

### scrollToBottom(animated?: boolean)

- Прокрутка к концу области
- Использует параметр `animated` или дефолтное значение из пропсов
- Реализация через `element.scrollTo()` с `behavior: 'smooth'` или прямое управление `scrollTop`

## ScrollArea.ScrollButton

### Адаптивное поведение

**Логика отображения:**

- Показывается только при `hasScrollableContent === true`
- Скрывается при отсутствии прокручиваемого контента

**Логика направления:**

- `isAboveCenter === true` → стрелка вниз, действие `scrollToBottom()`
- `isAboveCenter === false` → стрелка вверх, действие `scrollToTop()`

### Пропсы ScrollButton

```typescript
interface ScrollButtonProps {
  className?: string;
  upIcon?: ReactNode; // Иконка для прокрутки вверх
  downIcon?: ReactNode; // Иконка для прокрутки вниз
}
```

## Производительность и оптимизация

### Дебаунсинг событий

- `useDebouncedCallback` от Mantine для обработчика `scroll`
- Задержка: 16ms (60fps)

### Объединение refs

- `useMergedRef` от Mantine для объединения scrollAreaRef и resizeRef
- Один callback ref для подключения к Mantine ScrollArea

### Управление подписками

- Правильная очистка обработчиков событий в useEffect cleanup
- Корректное управление ResizeObserver и MutationObserver через Mantine хуки

## Интеграция с Mantine

### Стилизация

- Полная совместимость с системой стилизации Mantine
- Передача всех Mantine ScrollArea пропсов через корневой ScrollArea компонент
- Поддержка кастомизации через className и стили
- Прямой доступ к viewport через `viewportRef` из `useScrollArea()`

### Пропсы Content (приватный компонент)

```typescript
interface ScrollAreaContentProps {
  children: ReactNode;
}
```

**Примечание:** ScrollArea.Content не экспортируется и используется только внутри компонента.

## Требования к реализации

### Обязательные зависимости

- React 18+
- Mantine Scrollarea компонент
- React Context для состояния

### Хуки

- `useScrollArea` - публичный хук для разработчиков (фильтрует внутренние детали)
- `useScrollAreaState` - внутренний хук с полным состоянием
- Разделение ответственности: публичный API vs внутренняя логика

### Типизация

- Полная TypeScript типизация всех интерфейсов
- Экспорт типов для использования потребителями
