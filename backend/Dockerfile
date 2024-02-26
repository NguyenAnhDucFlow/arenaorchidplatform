# Sử dụng OpenJDK 17
FROM openjdk:17-jdk-alpine

# Tạo một thư mục /tmp trong image
VOLUME /tmp

# Sao chép file jar của ứng dụng vào image
#ARG JAR_FILE=out/artifacts/backend_jar/backend.jar
COPY target/backend-0.0.1-SNAPSHOT.jar backend.jar

# Định nghĩa lệnh để khởi chạy ứng dụng
ENTRYPOINT ["java","-jar","/backend.jar"]
