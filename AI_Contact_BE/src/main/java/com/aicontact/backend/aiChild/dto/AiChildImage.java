package com.aicontact.backend.aiChild.dto;

public class AiChildImage {
    private final byte[] data;
    private final String mimeType;
    public AiChildImage(byte[] data, String mimeType) {
        this.data = data;
        this.mimeType = mimeType;
    }
    public byte[] getData() { return data; }
    public String getMimeType() { return mimeType; }
}
