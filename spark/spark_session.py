from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, FloatType
from pyspark.ml.feature import VectorAssembler, StandardScaler, StringIndexer
from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator
from pyspark.sql.functions import mean

# Start Spark session
spark = SparkSession.builder \
    .appName("CustomerSupportClusteringApplication") \
    .getOrCreate()

# Define schema based on Customer_support_data.csv structure
schema = StructType([
    StructField("Unique id", StringType(), True),
    StructField("channel_name", StringType(), True),
    StructField("category", StringType(), True),
    StructField("Sub-category", StringType(), True),
    StructField("Customer Remarks", StringType(), True),
    StructField("Order_id", StringType(), True),
    StructField("order_date_time", StringType(), True),
    StructField("Issue_reported at", StringType(), True),
    StructField("issue_responded", StringType(), True),
    StructField("Survey_response_Date", StringType(), True),
    StructField("Customer_City", StringType(), True),
    StructField("Product_category", StringType(), True),
    StructField("Item_price", FloatType(), True),
    StructField("connected_handling_time", FloatType(), True),
    StructField("Agent_name", StringType(), True),
    StructField("Supervisor", StringType(), True),
    StructField("Manager", StringType(), True),
    StructField("Tenure Bucket", StringType(), True),
    StructField("Agent Shift", StringType(), True),
    StructField("CSAT Score", FloatType(), True)
])

# Process each batch file
batch_files = ["batch_1.csv", "batch_2.csv", "batch_3.csv"]

def handle_missing_values(df, threshold=0.3):
    """
    Fungsi untuk menangani nilai kosong di DataFrame.
    - Jika persentase nilai kosong lebih dari threshold, kolom dihapus.
    - Jika persentase nilai kosong lebih kecil dari threshold, nilai kosong diisi dengan rata-rata.
    """
    for column in df.columns:
        # Menghitung persentase nilai kosong
        null_count = df.filter(df[column].isNull()).count()
        total_count = df.count()
        null_percentage = null_count / total_count

        if null_percentage > threshold:
            # Jika nilai kosong lebih dari threshold, hapus kolom
            df = df.drop(column)
            print(f"Kolom '{column}' memiliki banyak nilai kosong, jadi dihapus.")
        else:
            # Jika nilai kosong sedikit, isi dengan nilai rata-rata (hanya untuk kolom numerik)
            if isinstance(df.schema[column].dataType, FloatType):
                mean_value = df.agg(mean(column)).collect()[0][0]
                df = df.fillna({column: mean_value})
                print(f"Nilai kosong di kolom '{column}' diisi dengan nilai rata-rata {mean_value}.")
    return df

for i, batch_file in enumerate(batch_files, 1):
    print(f"\nProcessing {batch_file}...")

    batch_data = spark.read.csv(batch_file, header=True, schema=schema)

    # Tangani nilai kosong sebelum melanjutkan proses
    batch_data = handle_missing_values(batch_data, threshold=0.3)

    # Transformasi kolom string menjadi numerik dengan StringIndexer
    indexer_channel = StringIndexer(inputCol="channel_name", outputCol="channel_name_index")
    indexer_sub_category = StringIndexer(inputCol="Sub-category", outputCol="Sub-category_index")

    batch_data = indexer_channel.fit(batch_data).transform(batch_data)
    batch_data = indexer_sub_category.fit(batch_data).transform(batch_data)

    # Select relevant feature columns for clustering (gunakan kolom numerik setelah diindeks)
    featureCols = ["channel_name_index", "Sub-category_index", "CSAT Score"]
    assembler = VectorAssembler(inputCols=featureCols, outputCol="features", handleInvalid="skip")
    assembled_df = assembler.transform(batch_data)

    # Standardize features
    standardScaler = StandardScaler(inputCol="features", outputCol="features_scaled")
    scaled_df = standardScaler.fit(assembled_df).transform(assembled_df)

    # KMeans clustering
    kmeans = KMeans(featuresCol='features_scaled', k=2, seed=23)
    kmeans_model = kmeans.fit(scaled_df)
    kmeans_predictions = kmeans_model.transform(scaled_df)

    # Evaluate clustering performance
    evaluator = ClusteringEvaluator(featuresCol='features_scaled', metricName='silhouette', distanceMeasure='squaredEuclidean')
    silhouette_score = evaluator.evaluate(kmeans_predictions)
    print(f"Silhouette Score for {batch_file}: {silhouette_score}")

    # Show predictions and save results
    kmeans_predictions.select("Unique id", "channel_name_index", "Sub-category_index", "CSAT Score", "prediction").show(10)
    output_path = f"clustering_results_batch_{i}"
    kmeans_predictions.select("Unique id", "channel_name_index", "Sub-category_index", "CSAT Score", "prediction") \
        .coalesce(1) \
        .write.csv(output_path, header=True, mode="overwrite")
    print(f"Clustering results saved in {output_path}")

# Stop Spark session
spark.stop()
