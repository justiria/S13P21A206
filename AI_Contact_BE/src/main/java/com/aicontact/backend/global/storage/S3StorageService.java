package com.aicontact.backend.global.storage;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final AmazonS3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * 업로드: MultipartFile 원본
     */
    public String upload(MultipartFile file, String key) throws IOException {
        return upload(file.getBytes(), key, file.getContentType());
    }

    /**
     * 범용 업로드: 바이트 배열 + MIME 타입
     */
    public String upload(byte[] data, String key, String contentType) {
        ObjectMetadata meta = new ObjectMetadata();
        meta.setContentType(contentType);
        meta.setContentLength(data.length);

        ByteArrayInputStream input = new ByteArrayInputStream(data);
        s3Client.putObject(bucketName, key, input, meta);
        return s3Client.getUrl(bucketName, key).toString();
    }

    /**
     * S3 객체 삭제
     */
    public void delete(String key) {
        s3Client.deleteObject(bucketName, key);
    }
}

