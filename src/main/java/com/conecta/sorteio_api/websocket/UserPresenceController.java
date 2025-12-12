package com.conecta.sorteio_api.websocket;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserPresenceController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    public UserPresenceController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/user-online")
    public void setOnline(@RequestParam String email) {
        onlineUsers.add(email);
        messagingTemplate.convertAndSend("/topic/online-status", onlineUsers);
    }

    @GetMapping("/user-offline")
    public void setOffline(@RequestParam String email) {
        onlineUsers.remove(email);
        messagingTemplate.convertAndSend("/topic/online-status", onlineUsers);
    }
}
