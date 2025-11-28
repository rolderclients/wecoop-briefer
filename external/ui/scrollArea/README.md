# ScrollArea Component

Расширенная область прокрутки с автоматическим скроллом и интеллектуальным управлением позиционированием на базе Mantine ScrollArea.

## Установка

Компонент уже включен в kit компонентов:

```tsx
import { ScrollArea, useScrollArea } from "@/components/kit";
```

## Базовое использование

### Простая прокручиваемая область

```tsx
import { ScrollArea } from "@/components/kit";

function BasicExample() {
  return (
    <ScrollArea h={300}>
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ padding: "10px" }}>
            Элемент {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
```

### Чат с автоскроллом

```tsx
import { ScrollArea } from "@/components/kit";

function ChatMessages({ messages }) {
  return (
    <ScrollArea
      autoScroll
      scrollToBottomOnInit
      animated
      nearThreshold={100}
      h={400}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{ padding: "8px", borderBottom: "1px solid #eee" }}
        >
          <strong>{msg.author}:</strong> {msg.text}
        </div>
      ))}

      <ScrollArea.ScrollButton className="absolute bottom-4 right-4 z-10" />
    </ScrollArea>
  );
}
```

## API

### Важно понимать:

- **ScrollArea** автоматически оборачивает `children` в `ScrollArea.Content`
- **ScrollArea.Content** нужен только когда требуется ref на прокручиваемую область
- **ScrollArea.ScrollButton** работает везде внутри ScrollArea через контекст

### ScrollArea Props

Наследует все пропсы от Mantine ScrollArea плюс дополнительные:

| Prop                   | Type               | Default | Описание                                        |
| ---------------------- | ------------------ | ------- | ----------------------------------------------- |
| `autoScroll`           | `boolean`          | `false` | Включение автоскролла при добавлении контента   |
| `scrollToBottomOnInit` | `boolean`          | `false` | Прокрутить к концу при инициализации компонента |
| `animated`             | `boolean`          | `true`  | Анимированная прокрутка                         |
| `nearThreshold`        | `number`           | `100`   | Отступ для near-зон в пикселях                  |
| `h`                    | `string \| number` | -       | Высота области прокрутки                        |
| `scrollbarSize`        | `number`           | -       | Размер полосы прокрутки                         |
| `type`                 | `string`           | -       | Тип поведения полос прокрутки                   |
| `...mantineProps`      | -                  | -       | Все остальные пропсы Mantine ScrollArea         |

### Доступ к viewport элементу

Используйте `useScrollArea` для получения ref на прокручиваемую область:

```tsx
function MyComponent() {
  const { viewportRef } = useScrollArea();

  const scrollToElement = () => {
    const target = viewportRef.current?.querySelector("[data-target]");
    target?.scrollIntoView();
  };

  const getScrollPosition = () => {
    console.log("Scroll top:", viewportRef.current?.scrollTop);
    console.log("Scroll height:", viewportRef.current?.scrollHeight);
  };

  return (
    <ScrollArea h={400}>
      <div data-target>Элемент для прокрутки</div>
      <button onClick={scrollToElement}>Прокрутить к элементу</button>
      <button onClick={getScrollPosition}>Получить позицию</button>
    </ScrollArea>
  );
}
```

### ScrollArea.ScrollButton Props

✅ **Работает везде внутри ScrollArea** - использует контекст, не требует Content.

| Prop        | Type        | Default               | Описание                   |
| ----------- | ----------- | --------------------- | -------------------------- |
| `className` | `string`    | -                     | CSS классы                 |
| `upIcon`    | `ReactNode` | `<IconChevronUp />`   | Иконка для прокрутки вверх |
| `downIcon`  | `ReactNode` | `<IconChevronDown />` | Иконка для прокрутки вниз  |

#### Примеры размещения:

```tsx
// В любом месте внутри ScrollArea
<ScrollArea h={400}>
  {content}
  <ScrollArea.ScrollButton className="absolute bottom-4 right-4" />
</ScrollArea>

// Даже вложенно
<ScrollArea h={400}>
  <div className="relative">
    {content}
    <ScrollArea.ScrollButton />
  </div>
</ScrollArea>

// Или в начале
<ScrollArea h={400}>
  <ScrollArea.ScrollButton className="mb-4" />
  {content}
</ScrollArea>
```

## Контекст

### useScrollArea

Хук для доступа к состоянию и методам ScrollArea:

```tsx
import { ScrollArea, useScrollArea } from "@/components/kit";

function CustomControls() {
  const {
    isAtTop,
    isNearTop,
    isAtBottom,
    isNearBottom,
    isAboveCenter,
    hasScrollableContent,
    scrollToTop,
    scrollToBottom,
    viewportRef,
  } = useScrollArea();

  return (
    <div>
      <button onClick={() => scrollToTop()} disabled={isAtTop}>
        В начало
      </button>

      <button onClick={() => scrollToBottom()} disabled={isAtBottom}>
        В конец
      </button>

      {hasScrollableContent && (
        <span>{isAboveCenter ? "Верхняя половина" : "Нижняя половина"}</span>
      )}
    </div>
  );
}

function App() {
  return (
    <ScrollArea>
      {/* контент */}
      <CustomControls />
    </ScrollArea>
  );
}
```

### Состояния позиции

- `isAtTop`: точно в начале (scrollTop === 0)
- `isNearTop`: в пределах nearThreshold от начала
- `isAtBottom`: точно в конце
- `isNearBottom`: в пределах nearThreshold от конца
- `isAboveCenter`: выше центральной точки
- `hasScrollableContent`: есть контент для прокрутки

### Методы управления

- `scrollToTop(animated?: boolean)`: прокрутить к началу
- `scrollToBottom(animated?: boolean)`: прокрутить к концу
- `viewportRef`: React RefObject на viewport элемент для прямого доступа

## Логика автоскролла

### Автоскролл при инициализации

Выполняется когда:

- `autoScroll === true`
- `scrollToBottomOnInit === true`
- Есть прокручиваемый контент

### Автоскролл при добавлении контента

Выполняется когда:

- `autoScroll === true`
- `isAtBottom === true` (точное позиционирование!)
- Нет активного взаимодействия пользователя

## Примеры использования

### Логи в реальном времени

```tsx
function LogViewer({ logs }) {
  return (
    <ScrollArea
      autoScroll
      h={500}
      style={{ fontFamily: "monospace", fontSize: "12px" }}
    >
      {logs.map((log, index) => (
        <div key={index} style={{ padding: "2px 8px" }}>
          <span style={{ color: "#666" }}>{log.timestamp}</span>
          <span
            style={{
              color:
                log.level === "error"
                  ? "red"
                  : log.level === "warn"
                    ? "orange"
                    : "inherit",
            }}
          >
            {log.message}
          </span>
        </div>
      ))}
    </ScrollArea>
  );
}
```

### Список с кастомными контролами

```tsx
function ItemsList({ items }) {
  return (
    <ScrollArea nearThreshold={50} h={400}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{ padding: "12px", borderBottom: "1px solid #eee" }}
        >
          {item.name}
        </div>
      ))}

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <CustomScrollControls />
      </div>
    </ScrollArea>
  );
}

function CustomScrollControls() {
  const { scrollToTop, scrollToBottom, hasScrollableContent } = useScrollArea();

  if (!hasScrollableContent) return null;

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={() => scrollToTop()}>↑</button>
      <button onClick={() => scrollToBottom()}>↓</button>
    </div>
  );
}
```

### Комбинация с другими компонентами

```tsx
import { ScrollArea } from "@/components/kit";
import { Button, Text, Badge } from "@mantine/core";

function NotificationCenter({ notifications }) {
  return (
    <ScrollArea autoScroll maxH={300} p="md">
      {notifications.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Нет уведомлений
        </Text>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text size="sm" fw={500}>
                {notification.title}
              </Text>
              <Badge
                size="xs"
                color={notification.priority === "high" ? "red" : "blue"}
              >
                {notification.priority}
              </Badge>
            </div>
            <Text size="xs" c="dimmed" mt={4}>
              {notification.message}
            </Text>
          </div>
        ))
      )}
    </ScrollArea>
  );
}
```

## Стилизация

Компонент полностью совместим с системой стилизации Mantine. Вы можете передавать все стандартные Mantine пропсы через `ScrollArea.Content`:

```tsx
<ScrollArea
  h={400}
  p="md"
  style={{ backgroundColor: "#f8f9fa" }}
  scrollbarSize={6}
  scrollHideDelay={1500}
  type="hover"
>
  {/* контент */}
</ScrollArea>
```

## Производительность

Компонент оптимизирован для производительности:

- Дебаунсинг событий скролла (16ms для 60fps)
- Оптимальное отслеживание изменений размера через ResizeObserver
- Минимальные ререндеры благодаря правильной мемоизации
- Автоматическая очистка event listeners и таймеров
