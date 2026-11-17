package com.memento.backend.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.memento.backend.model.Topic;
import com.memento.backend.service.TopicService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController 
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*") // dominio sin restricciones para desarrollo local, cambiar en producción
public class TopicController {
    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    // 1. CREATE TOPIC
    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        Topic createdTopic = topicService.createTopic(topic);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTopic);
    }

    // 2. GET TOPIC BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable String id){
        
        Topic topic = topicService.getTopicById(id);
        return topic != null ? ResponseEntity.ok(topic): ResponseEntity.notFound().build();
    }

    // 3. GET TOPIC BY TITLE
    @GetMapping("/title")
    public ResponseEntity<Topic> getTopicByTitle(@RequestParam String title){
        Topic topic = topicService.getTopicByTitle(title);
        return topic != null ? ResponseEntity.ok(topic): ResponseEntity.notFound().build();
    }

    // 4. GET TOPICS BY NOTEBOOK ID
    @GetMapping("/notebook/{notebookId}")
    public ResponseEntity<List<Topic>> getTopicsByNotebookId(@PathVariable String notebookId){
        return ResponseEntity.ok(topicService.getTopicsByNotebookId(notebookId));
    }

    // 5. GET TOPICS BY TITLE CONTAINING
    @GetMapping("/search")
    public ResponseEntity<List<Topic>> getTopicsByTitleContaining(@RequestParam String title){
        return ResponseEntity.ok(topicService.getTopicsByTitleContaining(title));
    }

    // 6. UPDATE TOPIC TITLE
    @PatchMapping ("/{id}/title")
    public ResponseEntity<Topic> updateTopicTitle(@PathVariable String id, @RequestBody String title) {
        Topic updatedTopic = topicService.updateTitle(id, title);
        return updatedTopic != null ? ResponseEntity.ok(updatedTopic) : ResponseEntity.notFound().build();
    }

    // MOVE TOPIC TO ANOTHER NOTEBOOK
    @PatchMapping("/{id}/notebookId")
    public ResponseEntity<Topic> moveTopicToNotebook(@PathVariable String id, @RequestParam String newNotebookId) {
        Topic topic = topicService.moveToNotebook(id, newNotebookId);
        return topic != null ? ResponseEntity.ok(topic): ResponseEntity.notFound().build();
    }

    // Update topicDate
    @PatchMapping("/{id}/date")
    public ResponseEntity<Topic> updateTopicDate(@PathVariable String id, @RequestParam Instant date){
        Topic topic = topicService.updateTopicDate(id, date);
        return topic != null ? ResponseEntity.ok(topic): ResponseEntity.notFound().build();
    }
    

    // DELETE TOPIC BY ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Topic> deleteTopicById(@PathVariable String id) {
        Topic topic = topicService.deleteTopicById(id);
        return topic != null ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}
