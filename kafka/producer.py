from kafka import KafkaProducer
import csv
import json
import time
import random
import datetime

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

topic_name = 'customer_support'
file_path = '../data/Customer_support_data.csv'
max_batches = 3 

def send_csv_data(max_duration_minutes=5):
    for batch_number in range(1, max_batches + 1):
        print(f"Starting batch {batch_number}")

        start_time = datetime.datetime.now()
        
        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                current_time = datetime.datetime.now()
                elapsed_time = (current_time - start_time).total_seconds() / 60 

                if elapsed_time >= max_duration_minutes:
                    print(f"Batch {batch_number} finished.")
                    break

                producer.send(topic_name, value=row)
                print(f"Sent: {row}")

                time.sleep(random.uniform(0.1, 0.8))

        time.sleep(1)

    print("Data sending completed after 3 batches.")

if __name__ == "__main__":
    send_csv_data()
