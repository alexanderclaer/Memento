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

    public Topic deleteTopic(Topic topic) {
        if (topic == null) {
            return null;
        }
        topicRepository.delete(topic);
        return topic;
    }

    public Topic deleteTopicById(String id) {
        return deleteTopic(getTopicById(id));
    }

    public void updateTopicById(String id, Topic updatedTopic) {
        updatedTopic.setId(id);
        updateTopic(updatedTopic);
    }

    public Topic updateTopicDate(String id, Instant date){
        Topic topic = findById(id);
        if (topic!=null){
            topic.setTopicDate(date);
            updateTopic(topic);
            return topic;
        }
        return null;
    }

    public Topic updateTitle(String id, String title) {
        Topic existingTopic = topicRepository.findById(id).orElse(null);
        if (existingTopic != null) {
            existingTopic.setTitle(title);
            updateTopic(existingTopic);
            return existingTopic;
        }
        return null;
    }

    public Topic getTopicById(String id) {
        return topicRepository.findById(id).orElse(null);
    }
   
    public Topic findById(String id){
        return topicRepository.findById(id).orElse(null);
    }

    public Topic moveToNotebook(String topicId, String newNotebookId){
        Topic topic = findById(topicId);
        if(topic!=null){
            topic.setNotebookId(newNotebookId);
            updateTopic(topic);
            return topic;
        }
        return null;
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicByTitle(String title) {
        return topicRepository.findTopicByTitle(title);
    }

    public List<Topic> getTopicsByTitleContaining(String title) {
        return topicRepository.findTopicsByTitleContaining(title);
    }

    public List<Topic> getTopicsByNotebookId(String notebookId) {
        return topicRepository.findTopicByNotebookId(notebookId);
    }

    public void deleteByNotebookId(String notebookId) {
        topicRepository.deleteByNotebookId(notebookId);
    }

}
