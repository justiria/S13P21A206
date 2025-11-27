package com.aicontact.backend.global.storage;

import net.coobird.thumbnailator.Thumbnails;
import org.jcodec.api.FrameGrab;
import org.jcodec.api.JCodecException;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.io.SeekableByteChannel;
import org.jcodec.common.model.Picture;
import org.jcodec.scale.AWTUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

/**
 * 썸네일 생성 전용 서비스
 * - 이미지 파일: Thumbnailator 사용
 * - 비디오 파일: JCodec를 사용해 첫 프레임 추출
 */
/**
 * 썸네일 생성 전용 서비스
 * - 이미지 파일: Thumbnailator 사용
 * - 비디오 파일: JCodec를 사용해 첫 프레임 추출
 */
@Service
public class ThumbnailService {

    private static final int THUMB_WIDTH = 200;
    private static final int THUMB_HEIGHT = 200;

    /**
     * 이미지 파일로부터 jpg 썸네일을 생성하여
     * byte[] 형태로 반환
     */
    public byte[] createImageThumbnail(MultipartFile file) throws IOException {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            Thumbnails.of(file.getInputStream())
                    .size(THUMB_WIDTH, THUMB_HEIGHT)              // 썸네일 최대 크기 300x300
                    .outputFormat("jpg")
                    .outputQuality(0.7)          // JPEG 압축 품질 70%
                    .toOutputStream(os);
            return os.toByteArray();
        }
    }

    /**
     * 비디오 파일로부터 썸네일(JPG) 생성하여
     * byte[] 형태로 반환
     */
    public byte[] createVideoThumbnail(MultipartFile file) throws IOException, JCodecException {
        // 1) MultipartFile → 임시 File 생성
        String ext = getExtension(file.getOriginalFilename());
        File temp = File.createTempFile("upload-", "." + ext);
        file.transferTo(temp);

        try (SeekableByteChannel ch = NIOUtils.readableChannel(temp)) {
            FrameGrab grab = FrameGrab.createFrameGrab(NIOUtils.readableChannel(temp));
            Picture picture = grab.getNativeFrame();  // 첫 프레임 반환

            // 3) Picture → BufferedImage 변환
            BufferedImage frame = AWTUtil.toBufferedImage(picture);

            // 4) 리사이즈
            BufferedImage thumb = new BufferedImage(
                    THUMB_WIDTH, THUMB_HEIGHT, BufferedImage.TYPE_3BYTE_BGR);
            Graphics2D g = thumb.createGraphics();
            g.drawImage(frame, 0, 0, THUMB_WIDTH, THUMB_HEIGHT, null);
            g.dispose();

            // 5) JPEG로 인코딩
            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                ImageIO.write(thumb, "jpg", os);
                return os.toByteArray();
            }
        } finally {
            // 임시 파일 삭제
            if (!temp.delete()) temp.deleteOnExit();
        }
    }

    /**
     * 파일명에서 확장자를 추출
     */
    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
