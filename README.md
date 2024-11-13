# Project Big Data 2
 **Kelompok 5** 
|         **Nama**         |   **NRP**    |
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

### Hasil Clustering
1. **Bacth 1**
   ![image](https://github.com/user-attachments/assets/5bc2ad18-28dc-4fcf-a2df-60ef03c84d7a)
- Beberapa kolom yang memiliki banyak nilai kosong dihapus untuk membersihkan data. Kolom yang dihapus adalah:
``Customer Remarks,
order_date_time,
Customer_City,
Product_category,
Item_price,
connected_handling_time. ``
- Nilai kosong di kolom ``CSAT Score`` diisi dengan rata-rata nilai dari kolom tersebut, yaitu ``4.2304``. Ini memungkinkan penggunaan nilai yang representatif tanpa perlu menghapus data terkait.
- Tabel Hasil Clustering: 
``Unique id: ID unik untuk setiap data.
channel_name_index: Hasil encoding untuk kolom channel_name.
Sub-category_index: Hasil encoding untuk kolom Sub-category.
CSAT Score: Skor CSAT dari data.
prediction: Cluster yang dihasilkan oleh model K-Means untuk data ini (label cluster).``
- Hasil clustering menunjukkan Silhouette Score sebesar ``0.5868``, yang menunjukkan kualitas clustering yang cukup baik
3. **Batch 2**
  ![image](https://github.com/user-attachments/assets/a4eb0798-6b35-4b3f-992a-091254eb0c27)
- Beberapa kolom yang memiliki banyak nilai kosong dihapus untuk membersihkan data. Kolom yang dihapus adalah:
``Customer Remarks,
order_date_time,
Customer_City,
Product_category,
Item_price,
connected_handling_time. ``
- Nilai kosong di kolom ``CSAT Score`` diisi dengan rata-rata nilai dari kolom tersebut, yaitu ``4.2214``. Ini memungkinkan penggunaan nilai yang representatif tanpa perlu menghapus data terkait.
- Tabel Hasil Clustering: 
``Unique id: ID unik untuk setiap data.
channel_name_index: Hasil encoding untuk kolom channel_name.
Sub-category_index: Hasil encoding untuk kolom Sub-category.
CSAT Score: Skor CSAT dari data.
prediction: Cluster yang dihasilkan oleh model K-Means untuk data ini (label cluster).``
- Hasil clustering menunjukkan Silhouette Score sebesar  ``0.4665``, yang lebih rendah dibandingkan batch sebelumnya (0.5868). Ini mengindikasikan bahwa kualitas clustering untuk batch ini sedikit kurang optimal.
4. **Batch 3**
![image](https://github.com/user-attachments/assets/d5b62099-ebd3-4cf7-8261-7c4bcaf75c40)
- Beberapa kolom yang memiliki banyak nilai kosong dihapus untuk membersihkan data. Kolom yang dihapus adalah:
``Customer Remarks,
order_date_time,
Customer_City,
Product_category,
Item_price,
connected_handling_time. ``
- Nilai kosong di kolom ``CSAT Score`` diisi dengan rata-rata nilai dari kolom tersebut, yaitu ``4.2228``. Ini memungkinkan penggunaan nilai yang representatif tanpa perlu menghapus data terkait.
- Tabel Hasil Clustering: 
``Unique id: ID unik untuk setiap data.
channel_name_index: Hasil encoding untuk kolom channel_name.
Sub-category_index: Hasil encoding untuk kolom Sub-category.
CSAT Score: Skor CSAT dari data.
prediction: Cluster yang dihasilkan oleh model K-Means untuk data ini (label cluster).``
- Hasil clustering menunjukkan Silhouette Score sebesar ``0.5140``, yang lebih rendah dari batch pertama tetapi lebih tinggi dari batch kedua. Ini menunjukkan bahwa kualitas clustering untuk batch ini berada di antara kedua batch sebelumnya.

### Dokumentasi API
1. **/api/cluster-stats**
![cluster-stats](https://github.com/user-attachments/assets/d384a485-bede-43f0-8240-589566bc3b75)
2. **/api/clustering-results/:uniqueId**
![clusterid](https://github.com/user-attachments/assets/413a8ebb-4f81-41e8-98f8-0b8fbdc335d5)
3. **/api/clustering-results**
![cluster](https://github.com/user-attachments/assets/7019a51a-ceeb-43e5-8e00-0b097afbca56)


