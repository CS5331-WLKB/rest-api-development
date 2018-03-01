FROM python:2.7-alpine
COPY . /service
WORKDIR /service
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
