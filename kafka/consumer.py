from kafka import KafkaConsumer
import json
import csv
import datetime

consumer = KafkaConsumer(
    'customer_support', 
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
    consumer_timeout_ms=900000
)

def consume_data_in_time_batches(batch_duration_minutes=5, max_batches=3):
    batch = []
    batch_number = 1  
    start_time = datetime.datetime.now()

    while batch_number <= max_batches: 
        for message in consumer:
            batch.append(message.value)

            current_time = datetime.datetime.now()
            elapsed_time = (current_time - start_time).total_seconds() / 60 

            if elapsed_time >= batch_duration_minutes:
                file_name = f'batch_{batch_number}.csv'
                with open(file_name, 'w', newline='') as csv_file:
                    writer = csv.DictWriter(csv_file, fieldnames=batch[0].keys())
                    writer.writeheader()
                    writer.writerows(batch)
                print(f"Batch {batch_number} saved to {file_name}")

                batch = []
                batch_number += 1
                start_time = datetime.datetime.now()

                if batch_number > max_batches:
                    print("Consumption completed up to batch 3.")
                    return

if __name__ == "__main__":
    consume_data_in_time_batches()
