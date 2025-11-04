# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файл зависимостей
COPY backend/requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальные файлы бэкенда (включая main.py)
# Это копирует *содержимое* папки backend в /app
COPY backend/ .

# Открываем порт, который будет использовать приложение
EXPOSE 8000

# Команда для запуска приложения
# main.py находится в /app, поэтому указываем просто main:app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]