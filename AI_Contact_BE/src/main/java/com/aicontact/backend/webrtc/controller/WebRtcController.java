package com.aicontact.backend.webrtc.controller;

import com.aicontact.backend.global.dto.response.ApiResponse;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RequestMapping("/calls")
@RestController
public class WebRtcController {

    @Value("${LIVEKIT_API_KEY}")
    private String LIVEKIT_API_KEY;

    @Value("${LIVEKIT_API_SECRET}")
    private String LIVEKIT_API_SECRET;

    /**
     * WebRTC 토큰 발급 API
     * @param params JSON object with roomName and participantName
     * @return ApiResponse with token
     */
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<Map<String, String>>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.success(Map.of("errorMessage", "roomName and participantName are required")));
        }

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        String jwtToken = token.toJwt();
        return ResponseEntity.ok(ApiResponse.success(Map.of("token", jwtToken)));
    }

    /**
     * LiveKit Webhook 수신 엔드포인트
     */
    @PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String body
    ) {
        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        try {
            WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
        } catch (Exception e) {
            System.err.println("Error validating webhook event: " + e.getMessage());
        }
        return ResponseEntity.ok("ok");
    }
}
