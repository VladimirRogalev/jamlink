# JamLink Local CI Pipeline

Этот набор скриптов позволяет запускать те же проверки, что и GitHub Actions, локально на вашей машине.

## 🚀 Быстрый старт

### Для Windows (PowerShell)
```powershell
npm run ci:win
```

### Для Windows (Command Prompt)
```cmd
npm run ci:cmd
```

### Для Linux/macOS (Node.js)
```bash
npm run ci
```

## 📋 Что проверяется

1. **📦 Установка зависимостей** - проверяет, что все пакеты установлены корректно
2. **🔍 Линтинг** - проверяет код на соответствие стандартам ESLint
3. **🔧 Проверка типов TypeScript** - проверяет корректность типов
4. **🧪 Тесты** - запускает все unit-тесты
5. **🏗️ Сборка** - проверяет, что проект собирается без ошибок

## 🛠️ Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run ci` | Запуск полного CI pipeline (Node.js) |
| `npm run ci:win` | Запуск CI pipeline в PowerShell |
| `npm run ci:cmd` | Запуск CI pipeline в Command Prompt |
| `npm run lint` | Только линтинг |
| `npm run lint:fix` | Линтинг с автоисправлением |
| `npm run type-check` | Только проверка типов |
| `npm run test:all` | Только тесты |

## 🔧 Параметры PowerShell

Для PowerShell скрипта доступны дополнительные параметры:

```powershell
# Пропустить тесты
.\scripts\local-ci.ps1 -SkipTests

# Пропустить сборку
.\scripts\local-ci.ps1 -SkipBuild

# Подробный вывод
.\scripts\local-ci.ps1 -Verbose

# Комбинация параметров
.\scripts\local-ci.ps1 -SkipTests -Verbose
```

## 📊 Результаты

После выполнения всех проверок вы увидите сводку:

```
📊 CI Pipeline Summary
================================
📦 Dependencies: ✅ Passed
🔍 Linting: ✅ Passed
🔧 Type Check: ✅ Passed
🧪 Tests: ✅ Passed
🏗️ Build: ✅ Passed

⏱️ Duration: 45.23s

🎉 All checks passed! Your code is ready for deployment.
```

## 🚨 Telegram уведомления

В GitHub Actions настроены уведомления в Telegram при:
- ✅ Успешном прохождении всех проверок
- ❌ Ошибках в тестах, линтинге или сборке
- 🚀 Автоматическом деплое на Railway

Для работы уведомлений необходимо настроить секреты в GitHub:
- `TELEGRAM_BOT_TOKEN` - токен бота
- `TELEGRAM_CHAT_ID` - ID чата для уведомлений

## 🔍 Исправление проблем

### Ошибки линтера
```bash
# Автоисправление
npm run lint:fix

# Ручная проверка
npm run lint
```

### Ошибки типов
```bash
npm run type-check
```

### Ошибки тестов
```bash
npm run test:all
```

## 📁 Структура файлов

```
scripts/
├── local-ci.js      # Node.js скрипт для Linux/macOS
├── local-ci.ps1     # PowerShell скрипт для Windows
└── local-ci.bat     # Batch скрипт для Windows
```

## 🤝 Интеграция с IDE

Рекомендуется настроить IDE для автоматического запуска проверок:

### VS Code
Добавьте в `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run CI Pipeline",
      "type": "shell",
      "command": "npm run ci",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## 🐛 Устранение неполадок

### Проблемы с правами выполнения (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Проблемы с Node.js версией
Убедитесь, что используется Node.js версии 18 или выше:
```bash
node --version
```

### Проблемы с зависимостями
```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm run install-all-dev
```
