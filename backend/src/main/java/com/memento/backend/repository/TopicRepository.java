package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.memento.backend.model.Topic;

public interface TopicRepository extends MongoRepository<Topic, String> {
    
    //Topic findTopicById(String id);
    Topic findTopicByTitle(String title);
    List<Topic> findTopicByNotebookId(String notebookId);
    List<Topic> findTopicsByTitleContaining(String title);
    void deleteByNotebookId(String notebookId);
}
