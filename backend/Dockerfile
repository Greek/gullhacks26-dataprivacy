FROM python:3.14

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 3001
CMD ["python", "server.py"]