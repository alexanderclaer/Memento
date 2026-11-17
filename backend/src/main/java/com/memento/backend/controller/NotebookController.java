package com.memento.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.memento.backend.model.Notebook;
import com.memento.backend.service.NotebookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping("/api/notebook")
@CrossOrigin(origins = "*")
public class NotebookController {

    private final NotebookService notebookService;

    public NotebookController(NotebookService notebookService){
        this.notebookService = notebookService;
    }


    //Creates notebook
    @PostMapping
    public ResponseEntity<Notebook> createNotebook(@RequestBody Notebook notebook) {
        Notebook created = notebookService.createNotebook(notebook);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    

    //Returns NB by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notebook> getNotebookById(@PathVariable  String id) {
        Notebook notebook = notebookService.getNotebookById(id);
        return notebook != null ? ResponseEntity.ok(notebook) : ResponseEntity.notFound().build();
    }

    //Returns NB by title
    @GetMapping("/title")
    public ResponseEntity<Notebook> getNotebookByTitle(@RequestParam String title) {
        Notebook notebook = notebookService.getNotebookByTitle(title);
        return notebook != null ? ResponseEntity.ok(notebook): ResponseEntity.notFound().build();
    }

    //Returns notebooks from partial search
    @GetMapping("/search")
    public ResponseEntity<List<Notebook>> getNotebooksByTitleContaining(@RequestBody String title){
        return ResponseEntity.ok(notebookService.getNotebooksByTitleContaining(title));
    }
    
    //Returns all notes form a workspace
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<Notebook>> getNotebooksByWorkspace(@PathVariable String workspaceId){
        return ResponseEntity.ok(notebookService.getNotebooksByWorkspaceId(workspaceId));
    }

    //Modify title
    @PatchMapping("/{id}/title")
    public ResponseEntity<Notebook> updateTitle(@PathVariable String id, @RequestBody String title){
        return notebookService.existsNotebook(id) ? 
            ResponseEntity.ok(notebookService.updateTitle(id, title)):
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotebook(@PathVariable String id){
        notebookService.deleteNotebookById(id);
        return (ResponseEntity.noContent().build());
    }




}
