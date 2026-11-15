package com.memento.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.memento.backend.model.Notebook;
import com.memento.backend.repository.NotebookRepository;

@Service 
public class NotebookService {
    private final NotebookRepository notebookRepository;

    public NotebookService(NotebookRepository notebookRepository) {
        this.notebookRepository = notebookRepository;
    }

    public Notebook createNotebook(Notebook notebook) {
        return notebookRepository.save(notebook);
    }

    public void updateNotebook(Notebook notebook) {
        notebook.setUpdatedAt(Instant.now());
        notebookRepository.save(notebook);
    }

    public void updateNotebookById(String id, Notebook updatedNotebook) {
        updatedNotebook.setId(id);
        updateNotebook(updatedNotebook);
    }

    public void deleteNotebookById(String notebookId) {
        notebookRepository.deleteById(notebookId);
    }

    public void deleteNotebook(Notebook notebook) {
        notebookRepository.deleteById(notebook.getId());
    }

    public Notebook getNotebookById(String id) {
        return notebookRepository.findById(id).orElse(null);
    }


    public List<Notebook> getNotebooksByWorkspaceId(String workspaceId) {
        return notebookRepository.findByWorkspaceId(workspaceId);
    }

    public List<Notebook> getAllNotebooks() {
        return notebookRepository.findAll();
    }

    public List<Notebook> getNotebooksByTitleContaining(String title) {
        return notebookRepository.findByTitleContaining(title);
    }

    public Notebook getNotebookByTitle(String title) {
        return notebookRepository.findByTitle(title);
    }
}
