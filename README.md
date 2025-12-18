# Структура папок проекта

Проект базируется на готовых, но кастомизируемых решениях. Проект служит внутренней цели - наработать готовые решения для подобных ИИ-проектов.

По этим двум причинам важно следовать заданной структуре и правилам.

## src/routes

- Стандартная папка Tanstack start. Всякий файл или папка превращается в маршрут.
- Здесь держим только маршруты и код для работы с маршрутизатором. Вся логика, верстка выносится. Например, определение параметра в маршруте остается здесь, но логика использования выносится. Исключение - лоадеры, прелоадеры, валидация и т.п. Так логично - при открытии страницы, закгрузи для нее то-то, проверь так то и отрисуй вот ту импортированную страниц. А в странице уже логика рендеринга.

## src/app

- Обертка всего приложения.
- Компоненты навигации.
- Обработчик ошибок.

## src/api

- Интеграция с БД.
- Интеграция с ИИ.

## src/pages

- Для разработки поведения и верстки страниц.
- Одна папка - одна страница.

## src/components

- `ai-elements` - Внешние компоненты Vercel AI Elements. Редактировать запрещено.
- `ui` - Внешние компоненты Vercel Shadcn. Редактировать запрещено.
- `reusables` - Переиспользуемые компоненты этого проекта.
- `reusables/ai-elements` - Кстомизация Vercel AI Elements под этот проект.
- `composables` - Комопненты собирающие reusables под разную морфологию проекта.
- `kit` - Компоненты, которые сразу претендуют быть частью Rolder UI Kit v3.

## Остальное

- `src/lib` - на этой папке завязана автоматизация двух библиотек - Better Auth и Vercel AI Elements. Поэтому, ничего там не делаем кроме интеграций этих библиотек. ВАЖНО! Не елать там index.ts с экспортами, иначе, все накроется медным тазом! Да так, что придется пересобирать все с 0, т.к. вообще не понятно, чтор это из-за этого.

# direnv и .envrc

direnv - это утилита, которая может применять локальные env параметры (пеерменные) либо запускать команды при переходе в папаку проекта в терминале.
Так как переменные мы используем через .env.local, envrc мы используем для запуска flox при каждом переходе в папку проекта в терминале или запуске терминалав zed/vscode.

Для настройки нужно сначала установить его, например

```sh
sudo apt-get install direnv
```

Затем нужно создать файл .envrc с командой (flox activate) (у нас в проекте уже есть).

Затем, разрешаем direnv командой
```sh
direnv allow
```

И подключаем ег ок терминалу
```sh
eval "$(direnv hook zsh)"  # для zsh
# или
eval "$(direnv hook bash)"  # для bash
```

Проверяем. Выходим из папки
```sh
cd ..
```

И возвращаемся в неё
```sh
cd briefer
```

Терминал должен выглядеть Так
```sh
vezdexod-pc:briefer (vezdexod*) $ direnv allow
# direnv: loading ~/programsVezdexod/Projects/wecoop/briefer/.envrc
# direnv: using flox
# ✅ You are now using the environment 'briefer'.
# To stop using this environment, type 'exit'
vezdexod-pc:briefer (vezdexod*) $ eval "$(direnv hook zsh)"
vezdexod-pc:briefer (vezdexod*) $ cd ..
# direnv: unloading
vezdexod-pc:wecoop $ cd briefer
# direnv: loading ~/programsVezdexod/Projects/wecoop/briefer/.envrc
# direnv: using flox
# ✅ You are now using the environment 'briefer'.
# To stop using this environment, type 'exit'
vezdexod-pc:briefer (vezdexod*) $
```
