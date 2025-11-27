package com.aicontact.backend.global.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GptScenarioService {

    @Value("${GMS_KEY}")
    private String OPENAI_API_KEY;

    @Value("${GPT_ENDPOINT}")
    private String ENDPOINT;

    public String getComicPanels(String location, String activity, String weather) throws IOException {
        OkHttpClient client = new OkHttpClient();

        String prompt = """
                You are a comic scenario formatter.

                Your task is to take the user's input and return only a list of simple scene descriptions for a multi-panel comic strip.
                Each panel must represent a different, non-repetitive moment in the day, and should be arranged in chronological order from beginning to end.
                Each description should be 1 sentence, clearly describing what is happening in that panel — focused on visual elements that can be drawn, not narrative.

                Format:
                Panel 1: [scene description]
                Panel 2: [scene description]
                Panel 3: [scene description]
                Panel 4: [scene description]

                Rules:
                - Do not include any dialogue or text that would appear in the comic
                - Focus on visual actions, background setting, props, and emotion
                - Maintain character and location consistency across all panels
                - Use summer, winter, etc. visuals if season is mentioned
                - Output only the list of panels — no intro, no explanation, no closing

                Location: %s
                Main activity: %s
                Weather/Season: %s
                """
                .formatted(location, activity, weather);

        JSONObject json = new JSONObject()
                .put("model", "gpt-4o")
                .put("messages", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("content", prompt)))
                .put("temperature", 0.7);

        Request request = new Request.Builder()
                .url(ENDPOINT)
                .header("Authorization", OPENAI_API_KEY)
                .post(RequestBody.create(json.toString(), MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            JSONObject resJson = new JSONObject(response.body().string());
            return resJson.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");
        }
    }

    public String getAppearanceAttributes(
            String photoAUrl,
            String photoBUrl) throws IOException {
        // 1) OkHttpClient 재사용 가능하다면 빈으로 분리해도 좋습니다.
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

        String promptSystem = """
                You will receive two user messages each containing one reference image (Photo A and Photo B). After that, output exactly one concise sentence merging both faces’ eye size and color, eyelid shape and crease, nose bridge height and tip shape, lip fullness and shape, and hair features (length, texture, color) into a factual, objective description without using abstract terms like “cupid’s bow”. Use clear language such as “large round eyes”, “straight medium-height nose”, “full lips”, “medium-length wavy hair”, etc.
                """;

        // 2) messages 배열 구성
        JSONArray messages = new JSONArray()
                // system 메시지
                .put(new JSONObject()
                        .put("role", "system")
                        .put("content", promptSystem))
                // 첫 번째 사용자 메시지 (이미지 A)
                .put(new JSONObject()
                        .put("role", "user")
                        .put("content", "Photo A")
                        .put("image_url", photoAUrl))
                // 두 번째 사용자 메시지 (이미지 B)
                .put(new JSONObject()
                        .put("role", "user")
                        .put("content", "Photo B")
                        .put("image_url", photoBUrl));

        // 3) 페이로드 전체 조립
        JSONObject payload = new JSONObject()
                .put("model", "gpt-4o")
                .put("messages", messages)
                .put("temperature", 0.1)
                .put("max_completion_tokens", 200);

        // 4) Request 빌드
        Request request = new Request.Builder()
                .url(ENDPOINT)
                .header("Authorization", OPENAI_API_KEY)
                .post(RequestBody.create(
                        payload.toString(),
                        MediaType.get("application/json")))
                .build();

        // 5) 동기 호출 및 파싱
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                String err = response.body() != null
                        ? response.body().string()
                        : "(empty)";
                throw new IOException("Chat API failed: "
                        + response.code() + " / " + err);
            }

            // 최종 JSON 파싱 후 message.content만 꺼내서 리턴
            JSONObject resJson = new JSONObject(response.body().string());
            return resJson
                    .getJSONArray("choices") // choices 배열
                    .getJSONObject(0) // 첫 번째 요소
                    .getJSONObject("message") // message 객체
                    .getString("content"); // content 필드
        }
    }

    public String getAppearanceAttributesForGrowth(
            String photoAUrl) throws IOException {
        // 1) OkHttpClient 재사용 가능하다면 빈으로 분리해도 좋습니다.
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

//        String promptSystem = """
//                You will receive one user message containing a reference image of a young child. Analyze and output exactly one concise sentence describing the child's facial features including eye size and color, eyelid shape, nose bridge height and tip shape, lip fullness and shape, hair features (length, texture, color), and apparent gender into a factual, objective description without using abstract terms. Use clear language such as "large round eyes", "straight medium-height nose", "full lips", "short straight hair", "appears to be a boy/girl", etc.
//                """;

        String promptSystem = """
                You will receive one user message containing a reference image of a young child. Analyze and output exactly one concise sentence describing the child's facial features including eye size and color, eyelid shape, nose bridge height and tip shape, lip fullness and shape, hair features (length, texture, color), and gender into a factual, objective description. Use clear language such as "large round eyes", "straight medium-height nose", "full lips", "short straight hair", "appears to be a girl/boy", etc.
                """;

        // 2) messages 배열 구성
        JSONArray messages = new JSONArray()
                // system 메시지
                .put(new JSONObject()
                        .put("role", "system")
                        .put("content", promptSystem))
                // 첫 번째 사용자 메시지 (이미지 A)
                .put(new JSONObject()
                        .put("role", "user")
                        .put("content", "ChildPhoto")
                        .put("image_url", photoAUrl));

        // 3) 페이로드 전체 조립
        JSONObject payload = new JSONObject()
                .put("model", "gpt-4o")
                .put("messages", messages)
                .put("temperature", 0.1)
                .put("max_completion_tokens", 200);

        // 4) Request 빌드
        Request request = new Request.Builder()
                .url(ENDPOINT)
                .header("Authorization", OPENAI_API_KEY)
                .post(RequestBody.create(
                        payload.toString(),
                        MediaType.get("application/json")))
                .build();

        // 5) 동기 호출 및 파싱
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                String err = response.body() != null
                        ? response.body().string()
                        : "(empty)";
                throw new IOException("Chat API failed: "
                        + response.code() + " / " + err);
            }

            // 최종 JSON 파싱 후 message.content만 꺼내서 리턴
            JSONObject resJson = new JSONObject(response.body().string());
            return resJson
                    .getJSONArray("choices") // choices 배열
                    .getJSONObject(0) // 첫 번째 요소
                    .getJSONObject("message") // message 객체
                    .getString("content"); // content 필드
        }
    }

}
