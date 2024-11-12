# Project Big Data 2

| **Kelompok 5**           | **NIM**      |
|--------------------------|--------------|
| Jeany Aurellia P.D       | 5027221008   |
| Clara Valentina          | 5027221016   |
| Angella Christie         | 5027221047   |

## Skema Batch Model

Model dibagi berdasarkan waktu 5 menit sebagai berikut:

- **Model 1**: Data 5 menit pertama.
- **Model 2**: Data 5 menit kedua.
- **Model 3**: Data 5 menit ketiga.

## API Endpoint

1. **/api/cluster-stats**  
   - **Fungsi**: Mengembalikan statistik dari masing-masing cluster.
   - **Output**: Statistik dan detail tiap cluster.

2. **/api/clustering-results/:uniqueId**  
   - **Fungsi**: Mengembalikan hasil clustering berdasarkan `uniqueId` yang diberikan.
   - **Output**: Cluster tempat data tersebut berada.

3. **/api/clustering-results**  
   - **Fungsi**: Mengembalikan semua hasil clustering.
   - **Output**: Daftar hasil clustering.

## Cara Menjalankan Proyek

1. **Menjalankan Kafka dan Zookeeper**  
   - Pastikan Docker sudah diinstal, lalu jalankan `docker-compose.yml` di dalam folder `kafka` untuk memulai Kafka dan Zookeeper.

2. **Menjalankan Kafka Producer dan Consumer**  
   - Jalankan `producer.py` untuk mengirim data ke Kafka secara streaming dan `consumer.py` untuk menerima data dari Kafka.

3. **Menjalankan Spark Script**  
   - Gunakan `spark_session.py` untuk memproses data batch dan melatih model.

4. **Menjalankan Backend API**  
   - Jalankan `index.js` di dalam folder `backend` untuk memulai server API. API ini akan melayani permintaan clustering dan statistik sesuai model yang telah dilatih.

### Dokumentasi API
1. **/api/cluster-stats**
![cluster-stats](https://github.com/user-attachments/assets/d384a485-bede-43f0-8240-589566bc3b75)
2. **/api/clustering-results/:uniqueId**
![clusterid](https://github.com/user-attachments/assets/413a8ebb-4f81-41e8-98f8-0b8fbdc335d5)
3. **/api/clustering-results**
![cluster](https://github.com/user-attachments/assets/7019a51a-ceeb-43e5-8e00-0b097afbca56)


