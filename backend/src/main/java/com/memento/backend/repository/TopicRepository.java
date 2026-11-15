package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.memento.backend.model.Topic;

public interface TopicRepository extends MongoRepository<Topic, String> {
    
    Topic getTopicById(String id);
    Topic getTopicByTitle(String title);
    List<Topic> getTopicByNotebookId(String notebookId);
    List<Topic> getTopicsByTitleContaining(String title);
}
