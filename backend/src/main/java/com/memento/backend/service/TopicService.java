package com.memento.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.memento.backend.model.Topic;
import com.memento.backend.repository.TopicRepository;

@Service 
public class TopicService {
    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;   
    }

    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public void updateTopic(Topic topic) {
        topic.setUpdatedAt(Instant.now());
        topicRepository.save(topic);
    }

    public void deleteTopic(String topicId) {
            topicRepository.deleteById(topicId);
    }

    public void deleteTopicById(String id) {
        topicRepository.deleteById(id);
    }

    public void updateTopicById(String id, Topic updatedTopic) {
        updatedTopic.setId(id);
        updateTopic(updatedTopic);
    }

    public Topic getTopicById(String id) {
        return topicRepository.findById(id).orElse(null);
    }
   
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicByTitle(String title) {
        return topicRepository.getTopicByTitle(title);
    }

    public List<Topic> getTopicsByTitleContaining(String title) {
        return topicRepository.getTopicsByTitleContaining(title);
    }

    public List<Topic> getTopicsByNotebookId(String notebookId) {
        return topicRepository.getTopicByNotebookId(notebookId);
    }

}
